from datetime import datetime, timedelta
from core import db


async def inventory_node(state: dict) -> dict:
    seller_id = state["seller_id"]

    inventory = await db.fetch_all(
        "SELECT * FROM inventory WHERE seller_id = $1", seller_id,
    )

    low_stock = []
    dead_stock = []
    reorder_req = []
    health_scores = []

    for item in inventory:
        sku = item["sku"]
        current_stock = item["quantity"]

        # ── Velocity ───────────────────────────────────
        sales_30 = await db.fetch_val(
            """SELECT COALESCE(SUM(oi.quantity), 0)
               FROM order_items oi JOIN orders o ON oi.order_id = o.id
               WHERE oi.sku = $1 AND o.seller_id = $2
                 AND o.created_at >= $3 AND o.status != 'returned'""",
            sku, seller_id, datetime.utcnow() - timedelta(days=30),
        )
        avg_daily = (sales_30 or 0) / 30

        # ── ROP ────────────────────────────────────────
        lead_time = item.get("lead_time_days") or 7
        max_lead = item.get("max_lead_time_days") or 10
        safety_stock = avg_daily * (max_lead - lead_time)
        rop = (avg_daily * lead_time) + safety_stock

        # ── Dead Stock ─────────────────────────────────
        last_sale = await db.fetch_val(
            """SELECT MAX(o.created_at) FROM order_items oi
               JOIN orders o ON oi.order_id = o.id
               WHERE oi.sku = $1 AND o.seller_id = $2""",
            sku, seller_id,
        )
        days_stagnant = (datetime.utcnow() - last_sale).days if last_sale else 999

        # ── Classify ───────────────────────────────────
        cost_price = float(item.get("cost_price") or 0)

        if days_stagnant >= 45:
            est_value = current_stock * cost_price
            dead_stock.append({
                "sku": sku, "name": item["product_name"],
                "quantity": current_stock, "days_stagnant": days_stagnant,
                "estimated_value": est_value,
                "action_suggestion": _suggest_dead_stock(est_value),
            })
        elif current_stock <= rop:
            reorder_qty = max(int(avg_daily * (30 + lead_time)), 1)
            days_remaining = round(current_stock / avg_daily, 1) if avg_daily > 0 else 999
            low_stock.append({
                "sku": sku, "name": item["product_name"],
                "current_stock": current_stock, "rop": round(rop, 1),
                "days_remaining": days_remaining, "reorder_qty": reorder_qty,
            })
            reorder_req.append({
                "sku": sku, "qty": reorder_qty,
                "supplier_whatsapp": item.get("supplier_phone"),
                "estimated_cost": reorder_qty * cost_price,
            })

        health = 100
        if days_stagnant >= 45:   health -= 50
        elif current_stock <= rop: health -= 30
        elif current_stock <= rop * 2: health -= 10
        health_scores.append(health)

    overall = sum(health_scores) / len(health_scores) if health_scores else 0

    return {
        "inventory_status": {"total_skus": len(inventory), "synced_at": datetime.utcnow().isoformat()},
        "low_stock_items": low_stock,
        "dead_stock_items": dead_stock,
        "reorder_required": reorder_req,
        "inventory_health_score": round(overall, 1),
    }


def _suggest_dead_stock(value: float) -> str:
    if value > 10000:
        return "Bundle deal banao ya Daraz flash sale mein daalo"
    elif value > 3000:
        return "10% discount do ya OLX pe list karo"
    return "Giveaway ya free-with-purchase offer karo"
