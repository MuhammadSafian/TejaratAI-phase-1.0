from datetime import datetime
from core import db

RTO_SIGNALS = {
    "phone_previous_return":   +25,
    "phone_repeated_fake":     +35,
    "phone_no_history":         +5,
    "phone_verified_buyer":    -15,
    "address_incomplete":      +15,
    "address_validated":       -10,
    "address_rural_remote":    +10,
    "order_time_odd_hours":    +10,
    "order_high_value_cod":    +15,
    "order_multiple_same_day": +20,
    "order_price_mismatch":    +12,
    "first_order_high_value":   +8,
    "city_high_rto_courier":   +15,
    "city_low_rto_courier":    -10,
}

BASE_SCORE = 20


async def calculate_rto_score(
    phone: str, city: str, courier: str,
    order_value: float, order_time: datetime,
    order_count_today: int, is_new_customer: bool,
    payment_method: str = "cod",
) -> tuple[float, dict]:
    score = BASE_SCORE
    signals_fired = {}

    # ── Phone History ──────────────────────────────
    row = await db.fetch_one(
        """
        SELECT COUNT(*) AS total,
               COALESCE(SUM(CASE WHEN order_returned THEN 1 ELSE 0 END), 0) AS returns,
               COALESCE(SUM(CASE WHEN order_delivered THEN 1 ELSE 0 END), 0) AS deliveries
        FROM rto_history WHERE phone_number = $1
        """,
        phone,
    )
    if row:
        total, returns, deliveries = row["total"], row["returns"], row["deliveries"]
        if total == 0:
            score += RTO_SIGNALS["phone_no_history"]
            signals_fired["phone_no_history"] = True
        elif returns >= 3:
            score += RTO_SIGNALS["phone_repeated_fake"]
            signals_fired["phone_repeated_fake"] = True
        elif returns > 0:
            score += RTO_SIGNALS["phone_previous_return"]
            signals_fired["phone_previous_return"] = True
        elif deliveries >= 2:
            score += RTO_SIGNALS["phone_verified_buyer"]
            signals_fired["phone_verified_buyer"] = True

    # ── Address Quality ────────────────────────────
    from integrations.address_validator import validate_address_quality
    addr_score = validate_address_quality("", city)
    if addr_score < 0.5:
        score += RTO_SIGNALS["address_incomplete"]
        signals_fired["address_incomplete"] = True

    # ── Order Patterns ─────────────────────────────
    hour = order_time.hour
    if hour < 5 or hour >= 1:
        score += RTO_SIGNALS["order_time_odd_hours"]
        signals_fired["order_time_odd_hours"] = True

    if order_value >= 5000 and payment_method == "cod":
        score += RTO_SIGNALS["order_high_value_cod"]
        signals_fired["order_high_value_cod"] = True

    if order_count_today >= 3:
        score += RTO_SIGNALS["order_multiple_same_day"]
        signals_fired["order_multiple_same_day"] = True

    if is_new_customer and order_value >= 3000:
        score += RTO_SIGNALS["first_order_high_value"]
        signals_fired["first_order_high_value"] = True

    # ── City-Courier Matrix ────────────────────────
    city_rto = await db.fetch_val(
        "SELECT return_rate_pct FROM city_courier_rto_rate WHERE city = $1 AND courier = $2",
        city, courier,
    )
    if city_rto is not None:
        if city_rto > 35:
            score += RTO_SIGNALS["city_high_rto_courier"]
            signals_fired["city_high_rto_courier"] = True
        elif city_rto < 15:
            score += RTO_SIGNALS["city_low_rto_courier"]
            signals_fired["city_low_rto_courier"] = True

    final_score = max(0, min(100, score))
    return final_score, signals_fired


async def count_orders_today(phone: str) -> int:
    val = await db.fetch_val(
        "SELECT COUNT(*) FROM orders WHERE customer_phone = $1 AND created_at::date = CURRENT_DATE",
        phone,
    )
    return val or 0


async def is_new_customer(phone: str) -> bool:
    val = await db.fetch_val(
        "SELECT COUNT(*) FROM orders WHERE customer_phone = $1", phone,
    )
    return (val or 0) == 0
