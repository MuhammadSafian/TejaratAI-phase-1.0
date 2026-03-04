import httpx

class TraxClient:
    BASE_URL = "https://sonic.pk/api"

    def __init__(self, api_key: str, username: str = ""):
        self.api_key = api_key
        self.username = username

    async def create_shipment(self, order: dict) -> dict:
        payload = {
            "service_type_id": 2 if order.get("payment_method") == "cod" else 1,
            "order_id": order["order_id"],
            "consignment": {
                "name":    order["customer_name"],
                "phone":   order["customer_phone"],
                "address": order["customer_address"],
                "city":    order["customer_city"],
            },
            "cod_amount": order.get("cod_amount", 0),
            "items": [{"description": i["name"], "qty": i.get("quantity", 1)} for i in order.get("items", [])],
        }
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/orders",
                auth=(self.username, self.api_key),
                json=payload, timeout=30,
            )
            return {"tracking_number": r.json().get("tracking_number")}

    async def track(self, tracking_number: str) -> dict:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL}/orders/{tracking_number}",
                auth=(self.username, self.api_key), timeout=15,
            )
            return r.json()
