import httpx
import hashlib
import hmac
import time
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


class DarazClient:
    """
    Daraz Open Platform API Client
    - Rate limit tracking (1000/day)
    - Polling fallback for unreliable webhooks
    - Commission rate auto-sync
    """
    BASE_URL = "https://api.daraz.pk/rest"
    RATE_LIMIT_DAILY = 1000

    def __init__(self, app_key: str = "", app_secret: str = "", access_token: str = ""):
        self.app_key = app_key or settings.DARAZ_APP_KEY if hasattr(settings, "DARAZ_APP_KEY") else ""
        self.app_secret = app_secret or settings.DARAZ_APP_SECRET if hasattr(settings, "DARAZ_APP_SECRET") else ""
        self.access_token = access_token

    # ──────────────────────────────────────────────────────
    # Rate Limit Tracking
    # ──────────────────────────────────────────────────────
    async def _check_rate_limit(self) -> bool:
        """Check if we're under the daily 1000 call limit."""
        r = await _get_redis()
        key = f"daraz_rate:{datetime.utcnow().strftime('%Y-%m-%d')}"
        count = await r.get(key)
        if count and int(count) >= self.RATE_LIMIT_DAILY:
            logger.warning(f"Daraz API rate limit reached: {count}/{self.RATE_LIMIT_DAILY}")
            return False
        return True

    async def _increment_rate(self):
        """Increment daily API call counter."""
        r = await _get_redis()
        key = f"daraz_rate:{datetime.utcnow().strftime('%Y-%m-%d')}"
        pipe = r.pipeline()
        pipe.incr(key)
        pipe.expire(key, 86400)  # 24hr expiry
        await pipe.execute()

    async def _get_remaining_calls(self) -> int:
        r = await _get_redis()
        key = f"daraz_rate:{datetime.utcnow().strftime('%Y-%m-%d')}"
        count = await r.get(key)
        return self.RATE_LIMIT_DAILY - int(count or 0)

    # ──────────────────────────────────────────────────────
    # API Signature
    # ──────────────────────────────────────────────────────
    def _sign_request(self, api_path: str, params: dict) -> str:
        """HMAC-SHA256 signature for Daraz Open Platform."""
        sorted_params = sorted(params.items())
        concat = api_path + "".join(f"{k}{v}" for k, v in sorted_params)
        return hmac.new(
            self.app_secret.encode(), concat.encode(), hashlib.sha256
        ).hexdigest().upper()

    # ──────────────────────────────────────────────────────
    # Core API Call (with rate limit + retry)
    # ──────────────────────────────────────────────────────
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def _call(self, api_path: str, params: dict = None) -> dict:
        if not await self._check_rate_limit():
            raise Exception(f"Daraz daily rate limit ({self.RATE_LIMIT_DAILY}) reached")

        params = params or {}
        params.update({
            "app_key": self.app_key,
            "access_token": self.access_token,
            "timestamp": str(int(time.time() * 1000)),
            "sign_method": "sha256",
        })
        params["sign"] = self._sign_request(api_path, params)

        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL}{api_path}",
                params=params, timeout=30,
            )
            await self._increment_rate()
            data = r.json()

            if data.get("code") != "0":
                logger.error(f"Daraz API error: {data.get('message')} [{api_path}]")

            return data

    # ──────────────────────────────────────────────────────
    # Orders
    # ──────────────────────────────────────────────────────
    async def get_orders(self, seller_id: str, days_back: int = 30) -> list:
        """Fetch orders — uses API if rate limit allows, else polls from DB cache."""
        remaining = await self._get_remaining_calls()

        if remaining < 50:
            logger.info("Rate limit low — using cached orders from DB")
            return await self._get_cached_orders(seller_id, days_back)

        created_after = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%dT00:00:00+05:00")
        data = await self._call("/orders/get", {
            "created_after": created_after,
            "status": "all",
            "sort_by": "created_at",
            "sort_direction": "DESC",
            "limit": "100",
            "offset": "0",
        })

        orders = data.get("data", {}).get("orders", [])

        # Cache to DB for fallback
        for order in orders:
            await self._cache_order(seller_id, order)

        return orders

    async def get_order_items(self, order_id: str) -> list:
        data = await self._call("/order/items/get", {"order_id": order_id})
        return data.get("data", [])

    # ──────────────────────────────────────────────────────
    # Polling Fallback (Webhook unreliable fix)
    # ──────────────────────────────────────────────────────
    async def poll_new_orders(self, seller_id: str, last_check: datetime = None) -> list:
        """
        Polling fallback — jab webhook miss ho jaye.
        Har 15 min Celery task se call hota hai.
        """
        if last_check is None:
            last_check = datetime.utcnow() - timedelta(minutes=20)

        remaining = await self._get_remaining_calls()
        if remaining < 30:
            logger.warning("Rate limit critically low — skipping poll")
            return []

        created_after = last_check.strftime("%Y-%m-%dT%H:%M:%S+05:00")
        data = await self._call("/orders/get", {
            "created_after": created_after,
            "status": "pending",
            "limit": "50",
            "offset": "0",
        })

        new_orders = data.get("data", {}).get("orders", [])

        # Deduplicate — skip if already in DB
        truly_new = []
        for order in new_orders:
            exists = await db.fetch_val(
                "SELECT 1 FROM orders WHERE platform_order_id = $1 AND platform = 'daraz' AND seller_id = $2",
                str(order.get("order_id")), seller_id,
            )
            if not exists:
                truly_new.append(order)
                await self._cache_order(seller_id, order)

        if truly_new:
            logger.info(f"Polling found {len(truly_new)} new Daraz orders (webhook missed)")

        return truly_new

    # ──────────────────────────────────────────────────────
    # Commission Rate Auto-Sync
    # ──────────────────────────────────────────────────────
    async def sync_commission_rates(self) -> dict:
        """
        Category commission rates — Daraz changes these regularly.
        Cache in Redis, refresh weekly.
        """
        r = await _get_redis()
        cache_key = "daraz:commission_rates"

        # Check cache first
        cached = await r.get(cache_key)
        if cached:
            import json
            return json.loads(cached)

        # Fetch from API
        data = await self._call("/category/commission/get", {})
        rates = {}

        for cat in data.get("data", {}).get("categories", []):
            cat_id = cat.get("category_id")
            rates[cat_id] = {
                "name": cat.get("name", ""),
                "commission_rate": float(cat.get("commission_rate", 5.0)),
                "updated_at": datetime.utcnow().isoformat(),
            }

        # Cache for 7 days
        if rates:
            import json
            await r.setex(cache_key, 604800, json.dumps(rates))

        return rates

    async def get_commission_for_category(self, category_id: str) -> float:
        """Get commission rate for a specific category."""
        rates = await self.sync_commission_rates()
        cat = rates.get(category_id, {})
        return cat.get("commission_rate", 5.0)  # Default 5%

    # ──────────────────────────────────────────────────────
    # Inventory
    # ──────────────────────────────────────────────────────
    async def update_inventory(self, seller_sku: str, quantity: int):
        await self._call("/product/stock/sellable/update", {
            "seller_sku": seller_sku,
            "sellable_quantity": str(quantity),
        })

    async def is_connected(self) -> bool:
        try:
            data = await self._call("/seller/get")
            return data.get("code") == "0"
        except Exception:
            return False

    # ──────────────────────────────────────────────────────
    # DB Cache Helpers
    # ──────────────────────────────────────────────────────
    async def _cache_order(self, seller_id: str, order: dict):
        """Cache Daraz order into orders table."""
        try:
            await db.execute(
                """INSERT INTO orders (seller_id, platform_order_id, platform, order_value,
                     customer_phone, customer_city, customer_address, payment_method,
                     status, created_at)
                   VALUES ($1, $2, 'daraz', $3, $4, $5, $6, $7, $8, $9)
                   ON CONFLICT (seller_id, platform, platform_order_id) DO UPDATE SET
                     status = $8, updated_at = NOW()""",
                seller_id,
                str(order.get("order_id")),
                float(order.get("price", 0)),
                order.get("address", {}).get("phone", ""),
                order.get("address", {}).get("city", ""),
                order.get("address", {}).get("address1", ""),
                "cod" if order.get("payment_method") == "COD" else "prepaid",
                order.get("statuses", ["pending"])[0],
                order.get("created_at", datetime.utcnow().isoformat()),
            )
        except Exception as e:
            logger.error(f"Failed to cache Daraz order: {e}")

    async def _get_cached_orders(self, seller_id: str, days_back: int) -> list:
        """Fallback — get orders from local DB instead of API."""
        rows = await db.fetch_all(
            """SELECT platform_order_id AS order_id, order_value AS price,
                      customer_city AS city, status, created_at
               FROM orders
               WHERE seller_id = $1 AND platform = 'daraz'
                 AND created_at >= $2
               ORDER BY created_at DESC""",
            seller_id, datetime.utcnow() - timedelta(days=days_back),
        )
        return [dict(r) for r in rows]
