import httpx
from core.config import settings

WHATSAPP_API_URL = "https://graph.facebook.com/v18.0"

class WhatsAppBusinessAPI:
    """WhatsApp Business API — Cloud API integration."""

    def __init__(self):
        self.token = settings.WHATSAPP_TOKEN if hasattr(settings, 'WHATSAPP_TOKEN') else ""
        self.phone_id = settings.WHATSAPP_PHONE_ID if hasattr(settings, 'WHATSAPP_PHONE_ID') else ""
        self.base_url = f"{WHATSAPP_API_URL}/{self.phone_id}/messages"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

    async def send_text(self, to: str, text: str) -> dict:
        """Send a plain text WhatsApp message."""
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": text},
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(self.base_url, json=payload, headers=self.headers)
            return resp.json()

    async def send_template_message(self, to: str, template: str, params: dict) -> dict:
        """Send a template-based WhatsApp message."""
        components = []
        if params:
            body_params = [{"type": "text", "text": v} for v in params.values()]
            components.append({"type": "body", "parameters": body_params})

        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "template",
            "template": {
                "name": template,
                "language": {"code": "en"},
                "components": components,
            },
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(self.base_url, json=payload, headers=self.headers)
            return resp.json()


async def send_cod_confirmation_whatsapp(phone: str, order_id: str, order_value: float) -> bool:
    """Send COD confirmation request to customer."""
    wa = WhatsAppBusinessAPI()
    msg = (
        f"🛒 Tejarat AI — Order Confirmation\n\n"
        f"Order #{order_id}\n"
        f"Amount: Rs. {order_value:,.0f}\n\n"
        f"Kya aap yeh order confirm karte hain?\n"
        f"Reply: YES ya NO"
    )
    result = await wa.send_text(phone, msg)
    return "messages" in result


async def send_seller_notification(seller_phone: str, notification_type: str, data: dict) -> bool:
    """Send seller notification via WhatsApp."""
    wa = WhatsAppBusinessAPI()

    if notification_type == "daily_report":
        msg = data.get("whatsapp_message", "Daily report tayyar hai.")
    elif notification_type == "low_stock_alert":
        items = data.get("items", [])
        msg = f"⚠️ Low Stock Alert!\n\n" + "\n".join(
            [f"• {i['name']}: {i['qty']} left" for i in items]
        )
    elif notification_type == "high_rto_alert":
        msg = f"🚨 High RTO Alert!\nOrder #{data.get('order_id')} — RTO Score: {data.get('rto_score')}%"
    else:
        msg = f"Tejarat AI Update: {data.get('message', '')}"

    result = await wa.send_text(seller_phone, msg)
    return "messages" in result
