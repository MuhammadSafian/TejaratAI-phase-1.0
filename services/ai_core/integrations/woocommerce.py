import httpx
import logging
import redis.asyncio as aioredis
from datetime import datetime, timedelta
from base64 import b64encode
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


class WooCommerceClient:
    """
    WooCommerce REST API v3 Client
    - Rate limit tracking (configurable per host)
    - Polling fallback for unreliable webhooks
    - Fee/tax sync
    """

    def __init__(self, store_url: str = "", consumer_key: str = "", consumer_secret: str = ""):
        self.store_url = store_url.rstrip("/")
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.api_url = f"{self.store_url}/wp-json/wc/v3"

    # ──────────────────────────────────────────────────────
    # Rate Limit Tracking
    # ──────────────────────────────────────────────────────
    async def _check_rate_limit(self) -> bool:
        """WooCommerce rate limit depends on hosting — track per minute."""
        r = await _get_redis()
        key = f"woo_rate:{self.store_url}:{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        count = await r.get(key)
        if count and int(count) >= 60:  # 60/min safe limit
            logger.warning(f"WooCommerce rate limit near for {self.store_url}")
            return False
        return True

    async def _increment_rate(self):
        r = await _get_redis()
        key = f"woo_rate:{self.store_url}:{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        pipe = r.pipeline()
        pipe.incr(key)
        pipe.expire(key, 120)
        await pipe.execute()

    # ──────────────────────────────────────────────────────
    # Core API Call
    # ──────────────────────────────────────────────────────
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def _call(self, method: str, endpoint: str, params: dict = None, json_data: dict = None) -> dict:
        if not await self._check_rate_limit():
            raise Exception("WooCommerce rate limit reached — retry later")

        async with httpx.AsyncClient() as client:
            r = await client.request(
                method,
                f"{self.api_url}/{endpoint}",
                auth=(self.consumer_key, self.consumer_secret),
                params=params,
                json=json_data,
                timeout=30,
            )
            await self._increment_rate()

            if r.status_code == 429:
                import asyncio
                logger.warning("WooCommerce 429 — waiting 5s")
                await asyncio.sleep(5)
                raise Exception("Rate limited — retrying")

            r.raise_for_status()
            return r.json()

    # ──────────────────────────────────────────────────────
    # Orders
    # ──────────────────────────────────────────────────────
    async def get_orders(self, seller_id: str, days_back: int = 30) -> list:
        after = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%dT00:00:00Z")
        data = await self._call("GET", "orders", params={
            "after": after,
            "per_page": 100,
            "orderby": "date",
            "order": "desc",
        })

        for order in data:
            await self._cache_order(seller_id, order)

        return data

    async def get_order(self, order_id: str) -> dict:
        return await self._call("GET", f"orders/{order_id}")

    # ──────────────────────────────────────────────────────
    # Polling Fallback (webhook unreliable fix)
    # ──────────────────────────────────────────────────────
    async def poll_new_orders(self, seller_id: str, last_check: datetime = None) -> list:
        """Polling fallback — jab webhook miss ho jaye."""
        if last_check is None:
            last_check = datetime.utcnow() - timedelta(minutes=20)

        after = last_check.strftime("%Y-%m-%dT%H:%M:%SZ")
        data = await self._call("GET", "orders", params={
            "after": after,
            "per_page": 50,
            "status": "any",
        })

        truly_new = []
        for order in data:
            exists = await db.fetch_val(
                "SELECT 1 FROM orders WHERE platform_order_id = $1 AND platform = 'woocommerce' AND seller_id = $2",
                str(order.get("id")), seller_id,
            )
            if not exists:
                truly_new.append(order)
                await self._cache_order(seller_id, order)

        if truly_new:
            logger.info(f"WooCommerce polling found {len(truly_new)} new orders (webhook missed)")
        return truly_new

    # ──────────────────────────────────────────────────────
    # Fee / Tax Sync
    # ──────────────────────────────────────────────────────
    async def get_order_fees(self, order_id: str) -> dict:
        """Get payment gateway fees and taxes for an order."""
        order = await self.get_order(order_id)
        fees = {
            "total_tax": float(order.get("total_tax", 0)),
            "shipping_total": float(order.get("shipping_total", 0)),
            "fee_lines": [],
        }
        for fee in order.get("fee_lines", []):
            fees["fee_lines"].append({
                "name": fee.get("name", ""),
                "total": float(fee.get("total", 0)),
            })
        return fees

    async def sync_tax_rates(self) -> list:
        """Sync WooCommerce tax settings — cache in Redis."""
        r = await _get_redis()
        cache_key = f"woo_taxes:{self.store_url}"
        import json

        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)

        data = await self._call("GET", "taxes", params={"per_page": 100})
        rates = []
        for tax in data:
            rates.append({
                "id": tax.get("id"),
                "country": tax.get("country"),
                "state": tax.get("state"),
                "rate": float(tax.get("rate", 0)),
                "name": tax.get("name", ""),
                "class": tax.get("class", "standard"),
            })

        await r.setex(cache_key, 604800, json.dumps(rates))  # 7 days cache
        return rates

    async def sync_payment_gateways(self) -> list:
        """Sync active payment gateway settings."""
        data = await self._call("GET", "payment_gateways")
        return [
            {"id": gw.get("id"), "title": gw.get("title"), "enabled": gw.get("enabled")}
            for gw in data if gw.get("enabled")
        ]

    # ──────────────────────────────────────────────────────
    # Inventory
    # ──────────────────────────────────────────────────────
    async def update_inventory(self, product_id: str, quantity: int):
        await self._call("PUT", f"products/{product_id}", json_data={
            "stock_quantity": quantity,
            "manage_stock": True,
        })

    async def is_connected(self) -> bool:
        try:
            data = await self._call("GET", "system_status")
            return "environment" in data
        except Exception:
            return False

    # ──────────────────────────────────────────────────────
    # DB Cache
    # ──────────────────────────────────────────────────────
    async def _cache_order(self, seller_id: str, order: dict):
        try:
            billing = order.get("billing") or {}
            shipping = order.get("shipping") or {}
            await db.execute(
                """INSERT INTO orders (seller_id, platform_order_id, platform, order_value,
                     customer_phone, customer_city, customer_address, payment_method,
                     status, created_at)
                   VALUES ($1, $2, 'woocommerce', $3, $4, $5, $6, $7, $8, $9)
                   ON CONFLICT (seller_id, platform, platform_order_id) DO UPDATE SET
                     status = $8, updated_at = NOW()""",
                seller_id,
                str(order.get("id")),
                float(order.get("total", 0)),
                billing.get("phone", ""),
                shipping.get("city", billing.get("city", "")),
                f"{shipping.get('address_1', '')} {shipping.get('address_2', '')}".strip(),
                "cod" if order.get("payment_method") == "cod" else "prepaid",
                order.get("status", "pending"),
                order.get("date_created", datetime.utcnow().isoformat()),
            )
        except Exception as e:
            logger.error(f"Failed to cache WooCommerce order: {e}")
