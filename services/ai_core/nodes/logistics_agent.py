from datetime import datetime
from integrations.couriers import get_best_courier
from integrations.whatsapp import send_cod_confirmation_whatsapp
from nodes.logistics.rto_predictor import calculate_rto_score, count_orders_today, is_new_customer
from nodes.logistics.roi_calculator import calculate_true_roi


async def logistics_node(state: dict) -> dict:
    order_value = state.get("order_value", 0)
    phone = state.get("customer_phone", "")
    city = state.get("customer_city", "")
    items = state.get("order_items", [])
    payment = state.get("payment_method", "cod")

    # ── Best Courier ──────────────────────────────
    recommended_courier = await get_best_courier(city)

    rto_score, rto_signals = 0.0, {}
    if payment == "cod" and phone:
        orders_today = await count_orders_today(phone)
        new_customer = await is_new_customer(phone)
        rto_score, rto_signals = await calculate_rto_score(
            phone=phone, city=city, courier=recommended_courier,
            order_value=order_value, order_time=datetime.utcnow(),
            order_count_today=orders_today, is_new_customer=new_customer,
            payment_method=payment,
        )

    # ── Risk Level ────────────────────────────────
    if rto_score < 31:
        risk_level = "low"
    elif rto_score < 61:
        risk_level = "medium"
    else:
        risk_level = "high"

    # ── COD Confirmation ──────────────────────────
    cod_confirmed = None
    if risk_level == "medium" and payment == "cod" and phone:
        cod_confirmed = await send_cod_confirmation_whatsapp(
            phone=phone, order_id=state.get("order_id", ""),
            order_value=order_value,
        )

    # ── True ROI ──────────────────────────────────
    true_roi = 0.0
    if state.get("seller_id"):
        true_roi = await calculate_true_roi(
            seller_id=state["seller_id"], order_value=order_value,
            order_items=items, courier=recommended_courier,
            city=city, rto_score=rto_score, payment_method=payment,
        )

    return {
        "rto_score": rto_score,
        "rto_risk_level": risk_level,
        "rto_signals": rto_signals,
        "true_roi": true_roi,
        "cod_confirmed": cod_confirmed,
        "recommended_courier": recommended_courier,
    }
