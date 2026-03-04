import httpx

class PostExClient:
    BASE_URL = "https://api.postex.pk/services/integration/api"

    def __init__(self, token: str):
        self.headers = {"token": token, "Content-Type": "application/json"}

    async def create_order(self, order: dict) -> dict:
        payload = {
            "orderRefNumber": order["order_id"],
            "orderType":      "Normal",
            "paymentType":    "COD" if order.get("payment_method") == "cod" else "Prepaid",
            "orderAmount":    str(order.get("cod_amount", 0)),
            "customerName":   order["customer_name"],
            "customerPhone":  order["customer_phone"],
            "deliveryAddress": order["customer_address"],
            "cityName":       order["customer_city"],
            "itemName":       ", ".join(i["name"] for i in order.get("items", [])),
        }
        async with httpx.AsyncClient() as client:
            r = await client.post(f"{self.BASE_URL}/order/create", headers=self.headers, json=payload, timeout=30)
            data = r.json()
            if data.get("statusCode") == "200":
                return {"tracking_number": data["dist"]["trackingNumber"], "status": "booked"}
            raise Exception(f"PostEx error: {data.get('statusMessage')}")

    async def track(self, tracking_number: str) -> dict:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL}/order/track/{tracking_number}",
                headers=self.headers, timeout=15,
            )
            return r.json()
