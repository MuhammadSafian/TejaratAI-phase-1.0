import httpx
import logging
import redis.asyncio as aioredis
from datetime import datetime, timedelta
from core.config import settings
from core import db
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

_redis = None

async def _get_redis():
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


class ShopifyClient:
    """
    Shopify Admin REST + GraphQL API Client
    - Rate limit: Shopify uses leaky bucket (2 calls/sec, 40 bucket size)
    - Polling fallback for webhook failures
    - Transaction fee tracking
    """

    def __init__(self, shop_domain: str = "", access_token: str = ""):
        self.shop = shop_domain
        self.token = access_token
        self.base_url = f"https://{self.shop}/admin/api/2024-01"

    # ──────────────────────────────────────────────────────
    # Rate Limit (Shopify Leaky Bucket)
    # ──────────────────────────────────────────────────────
    async def _wait_for_rate_limit(self):
        """Shopify returns X-Shopify-Shop-Api-Call-Limit header.
        Format: '32/40' — we pause when bucket > 35."""
        r = await _get_redis()
        bucket = await r.get(f"shopify_bucket:{self.shop}")
        if bucket and int(bucket) >= 35:
            import asyncio
            logger.info(f"Shopify rate limit near ({bucket}/40) — pausing 2s")
            await asyncio.sleep(2)

    async def _update_bucket(self, response: httpx.Response):
        """Update bucket counter from response header."""
        limit_header = response.headers.get("X-Shopify-Shop-Api-Call-Limit", "0/40")
        current = int(limit_header.split("/")[0])
        r = await _get_redis()
        await r.setex(f"shopify_bucket:{self.shop}", 10, str(current))

    # ──────────────────────────────────────────────────────
    # Core API Call
    # ──────────────────────────────────────────────────────
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def _call(self, method: str, endpoint: str, json_data: dict = None) -> dict:
        await self._wait_for_rate_limit()

        async with httpx.AsyncClient() as client:
            r = await client.request(
                method,
                f"{self.base_url}/{endpoint}",
                headers={
                    "X-Shopify-Access-Token": self.token,
                    "Content-Type": "application/json",
                },
                json=json_data,
                timeout=30,
            )
            await self._update_bucket(r)

            if r.status_code == 429:
                import asyncio
                retry_after = float(r.headers.get("Retry-After", 2))
                logger.warning(f"Shopify 429 — waiting {retry_after}s")
                await asyncio.sleep(retry_after)
                raise Exception("Rate limited — retrying")

            r.raise_for_status()
            return r.json()

    # ──────────────────────────────────────────────────────
    # Orders
    # ──────────────────────────────────────────────────────
    async def get_orders(self, seller_id: str, days_back: int = 30) -> list:
        created_min = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%dT00:00:00Z")
        data = await self._call("GET", f"orders.json?created_at_min={created_min}&status=any&limit=250")
        orders = data.get("orders", [])

        # Cache to DB
        for order in orders:
            await self._cache_order(seller_id, order)

        return orders

    async def get_order(self, order_id: str) -> dict:
        data = await self._call("GET", f"orders/{order_id}.json")
        return data.get("order", {})

    # ──────────────────────────────────────────────────────
    # Polling Fallback (webhook unreliable fix)
    # ──────────────────────────────────────────────────────
    async def poll_new_orders(self, seller_id: str, last_check: datetime = None) -> list:
        """Polling fallback — jab webhook miss ho jaye."""
        if last_check is None:
            last_check = datetime.utcnow() - timedelta(minutes=20)

        created_min = last_check.strftime("%Y-%m-%dT%H:%M:%SZ")
        data = await self._call("GET", f"orders.json?created_at_min={created_min}&status=any&limit=50")
        orders = data.get("orders", [])

        truly_new = []
        for order in orders:
            exists = await db.fetch_val(
                "SELECT 1 FROM orders WHERE platform_order_id = $1 AND platform = 'shopify' AND seller_id = $2",
                str(order.get("id")), seller_id,
            )
            if not exists:
                truly_new.append(order)
                await self._cache_order(seller_id, order)

        if truly_new:
            logger.info(f"Shopify polling found {len(truly_new)} new orders (webhook missed)")
        return truly_new

    # ──────────────────────────────────────────────────────
    # Transaction Fees
    # ──────────────────────────────────────────────────────
    async def get_transaction_fees(self, order_id: str) -> float:
        """Shopify transaction fees for an order."""
        data = await self._call("GET", f"orders/{order_id}/transactions.json")
        total_fee = 0.0
        for txn in data.get("transactions", []):
            total_fee += float(txn.get("fee", {}).get("amount", 0))
        return total_fee

    async def sync_all_fees(self, seller_id: str, days_back: int = 30) -> dict:
        """Sync transaction fees for recent orders — cache in Redis."""
        r = await _get_redis()
        cache_key = f"shopify_fees:{seller_id}"
        import json

        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)

        orders = await self.get_orders(seller_id, days_back)
        fee_map = {}
        for order in orders[:50]:
            oid = str(order.get("id"))
            fee = await self.get_transaction_fees(oid)
            fee_map[oid] = fee

        await r.setex(cache_key, 86400, json.dumps(fee_map))
        return fee_map

    # ──────────────────────────────────────────────────────
    # Inventory
    # ──────────────────────────────────────────────────────
    async def update_inventory(self, inventory_item_id: str, quantity: int):
        locations = await self._call("GET", "locations.json")
        loc_id = locations.get("locations", [{}])[0].get("id")
        if loc_id:
            await self._call("POST", "inventory_levels/set.json", {
                "location_id": loc_id,
                "inventory_item_id": inventory_item_id,
                "available": quantity,
            })

    async def is_connected(self) -> bool:
        try:
            data = await self._call("GET", "shop.json")
            return "shop" in data
        except Exception:
            return False

    # ──────────────────────────────────────────────────────
    # DB Cache
    # ──────────────────────────────────────────────────────
    async def _cache_order(self, seller_id: str, order: dict):
        try:
            shipping = order.get("shipping_address") or {}
            await db.execute(
                """INSERT INTO orders (seller_id, platform_order_id, platform, order_value,
                     customer_phone, customer_city, customer_address, payment_method,
                     status, created_at)
                   VALUES ($1, $2, 'shopify', $3, $4, $5, $6, $7, $8, $9)
                   ON CONFLICT (seller_id, platform, platform_order_id) DO UPDATE SET
                     status = $8, updated_at = NOW()""",
                seller_id,
                str(order.get("id")),
                float(order.get("total_price", 0)),
                shipping.get("phone", ""),
                shipping.get("city", ""),
                shipping.get("address1", ""),
                "cod" if order.get("gateway") == "Cash on Delivery (COD)" else "prepaid",
                order.get("financial_status", "pending"),
                order.get("created_at", datetime.utcnow().isoformat()),
            )
        except Exception as e:
            logger.error(f"Failed to cache Shopify order: {e}")
