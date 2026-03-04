from integrations.whatsapp import send_seller_notification


async def output_node(state: dict) -> dict:
    """Send final results via WhatsApp + Dashboard."""
    wa_msg = state.get("whatsapp_message", "")
    seller_id = state.get("seller_id", "")

    if wa_msg:
        await send_seller_notification(
            seller_phone="",  # loaded from DB at runtime
            notification_type="daily_report",
            data={"whatsapp_message": wa_msg},
        )

    return {"output_sent": True}
