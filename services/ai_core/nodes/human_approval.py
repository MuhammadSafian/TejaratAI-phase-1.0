from integrations.whatsapp import send_seller_notification


async def human_approval_node(state: dict) -> dict:
    """
    INTERRUPT point — graph pauses here.
    Seller ko WhatsApp/Dashboard pe notification jaati hai.
    """
    order_id = state.get("order_id", "?")
    rto_score = state.get("rto_score", 0)
    seller_id = state.get("seller_id", "")

    # Notify seller
    await send_seller_notification(
        seller_phone="",  # loaded from DB at runtime
        notification_type="high_rto_alert",
        data={
            "order_id": order_id,
            "rto_score": rto_score,
            "message": (
                f"⚠️ Order #{order_id} HIGH RISK (Score: {rto_score}/100).\n"
                f"COD amount: Rs {state.get('order_value', 0):,.0f}\n"
                f"City: {state.get('customer_city', '?')}\n\n"
                f"Reply: APPROVE / REJECT / ADVANCE"
            ),
        },
    )

    return {"requires_human_approval": True}
