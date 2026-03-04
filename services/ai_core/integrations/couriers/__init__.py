import logging
from core import db
from core.config import settings
from .tcs import TCSClient
from .leopards import LeopardsClient
from .postex import PostExClient
from .trax import TraxClient
from .blueex import BlueExClient

logger = logging.getLogger(__name__)

COURIER_CLIENTS = {
    "tcs":      lambda: TCSClient(settings.TCS_API_KEY),
    "leopards": lambda: LeopardsClient(settings.LEOPARDS_API_KEY, settings.LEOPARDS_API_PASSWORD),
    "postex":   lambda: PostExClient(settings.POSTEX_TOKEN),
    "trax":     lambda: TraxClient(settings.TRAX_API_KEY, settings.TRAX_USERNAME),
    "blueex":   lambda: BlueExClient(settings.BLUEEX_USERNAME, settings.BLUEEX_PASSWORD),
}

CITY_DEFAULTS = {
    "Karachi":    "tcs",
    "Lahore":     "leopards",
    "Islamabad":  "tcs",
    "Rawalpindi": "tcs",
    "Peshawar":   "trax",
    "Quetta":     "postex",
    "Faisalabad": "leopards",
    "Multan":     "leopards",
}


async def get_best_courier(city: str) -> str:
    """City ke hisaab se best courier — lowest RTO rate wala."""
    try:
        row = await db.fetch_one(
            """SELECT courier FROM city_courier_rto_rate
               WHERE city = $1
               ORDER BY return_rate_pct ASC LIMIT 1""",
            city,
        )
        if row:
            return row["courier"]
    except Exception:
        pass
    return CITY_DEFAULTS.get(city, "leopards")


async def book_with_recommended_courier(order: dict, seller_id: str) -> dict:
    """Best courier se book karo. Failure pe fallback try karo."""
    primary = await get_best_courier(order["customer_city"])
    fallbacks = [c for c in COURIER_CLIENTS if c != primary]

    for courier_name in [primary] + fallbacks[:2]:
        try:
            client = COURIER_CLIENTS[courier_name]()
            if hasattr(client, "create_shipment"):
                result = await client.create_shipment(order)
            else:
                result = await client.create_order(order)

            await db.execute(
                """INSERT INTO shipments (order_id, courier, tracking_number, seller_id, created_at)
                   VALUES ($1, $2, $3, $4, NOW())""",
                order["order_id"], courier_name, result.get("tracking_number"), seller_id,
            )
            return {**result, "courier": courier_name}
        except Exception as e:
            logger.error(f"Courier {courier_name} booking failed: {e}")
            continue

    raise Exception("All couriers failed — manual booking required")
