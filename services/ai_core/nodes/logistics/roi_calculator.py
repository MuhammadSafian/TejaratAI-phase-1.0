from core import db


async def calculate_true_roi(
    seller_id: str, order_value: float, order_items: list,
    courier: str, city: str, rto_score: float, payment_method: str,
) -> float:
    """
    True ROI = (Delivered Sales - All Costs) / Total Investment × 100
    """
    # ── COGS ──────────────────────────────────────
    cogs = 0.0
    for item in order_items:
        cost = await db.fetch_val(
            "SELECT cost_price FROM inventory WHERE sku = $1 AND seller_id = $2",
            item.get("sku"), seller_id,
        )
        cogs += float(cost or 0) * item.get("quantity", 1)

    # ── Platform Commission (est. 5%) ──────────────
    commission = order_value * 0.05

    # ── Shipping Cost ──────────────────────────────
    total_weight = sum(i.get("weight_grams", 500) for i in order_items)
    shipping = await _get_courier_rate(courier, city, total_weight / 1000)

    # ── RTO Penalty ────────────────────────────────
    rto_probability = rto_score / 100
    return_shipping = shipping
    rto_penalty = rto_probability * (return_shipping + cogs * 0.1)

    # ── Ad Spend ───────────────────────────────────
    row = await db.fetch_one(
        "SELECT avg_ad_cost_per_order FROM seller_config WHERE seller_id = $1",
        seller_id,
    )
    ad_spend = float(row["avg_ad_cost_per_order"]) if row else 0.0

    # ── Overhead per Order ─────────────────────────
    overhead = await _calculate_overhead_per_order(seller_id)

    # ── Packaging ──────────────────────────────────
    packaging = await db.fetch_val(
        "SELECT packaging_cost_per_order FROM seller_config WHERE seller_id = $1",
        seller_id,
    )
    packaging = float(packaging or 50.0)

    # ── True ROI Formula ───────────────────────────
    delivered_sales = order_value * (1 - rto_probability)
    total_cost = cogs + commission + shipping + rto_penalty + ad_spend + overhead + packaging
    total_investment = cogs + overhead + packaging

    if total_investment == 0:
        return 0.0

    net_profit = delivered_sales - total_cost
    true_roi = (net_profit / total_investment) * 100
    return round(true_roi, 2)


async def _get_courier_rate(courier: str, city: str, weight_kg: float) -> float:
    """Fallback static rates if API unavailable."""
    BASE_RATES = {"tcs": 250, "leopards": 220, "postex": 200, "trax": 230, "blueex": 210}
    base = BASE_RATES.get(courier, 250)
    return base + max(0, (weight_kg - 0.5)) * 50


async def _calculate_overhead_per_order(seller_id: str) -> float:
    row = await db.fetch_one(
        """SELECT monthly_rent, team_cost_daily, electricity_monthly
           FROM seller_config WHERE seller_id = $1""",
        seller_id,
    )
    if not row:
        return 0.0
    monthly_rent = float(row["monthly_rent"] or 0)
    team_daily = float(row["team_cost_daily"] or 0)
    electricity = float(row["electricity_monthly"] or 0)
    monthly_overhead = monthly_rent + (team_daily * 30) + electricity

    avg_orders = await db.fetch_val(
        """SELECT COUNT(*) / GREATEST(1,
             EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 86400 / 30)
           FROM orders WHERE seller_id = $1
             AND created_at >= NOW() - INTERVAL '90 days'""",
        seller_id,
    )
    monthly_orders = float(avg_orders or 100)
    return round(monthly_overhead / max(monthly_orders, 1), 2)
