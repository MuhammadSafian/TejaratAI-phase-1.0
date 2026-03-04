import httpx
import logging

logger = logging.getLogger(__name__)


class TCSClient:
    """TCS Courier API Client — booking + tracking."""
    BASE_URL = "https://api.tcscourier.com"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {"X-API-Key": api_key, "Content-Type": "application/json"}

    async def create_shipment(self, order: dict) -> dict:
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/v1/shipments",
                headers=self.headers,
                json={
                    "consignee_name": order.get("customer_name", ""),
                    "consignee_phone": order.get("customer_phone", ""),
                    "consignee_address": order.get("customer_address", ""),
                    "consignee_city": order.get("city", ""),
                    "cod_amount": float(order.get("order_value", 0)),
                    "weight": float(order.get("weight", 0.5)),
                    "pieces": int(order.get("pieces", 1)),
                    "service_type": "overnight",
                },
                timeout=30,
            )
            data = r.json()
            return {"tracking_number": data.get("consignmentNo", ""), "status": data.get("status", "")}

    async def track(self, tracking_number: str) -> dict:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL}/v1/tracking/{tracking_number}",
                headers=self.headers,
                timeout=30,
            )
            data = r.json()
            events = data.get("events", [])
            last_status = events[-1].get("status", "in_transit") if events else "unknown"
            return {
                "tracking_number": tracking_number,
                "status": last_status,
                "events": events,
                "delivered_at": data.get("delivered_at"),
            }

    async def get_rate(self, origin_city: str, destination_city: str, weight: float) -> float:
        """Calculate shipping rate."""
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL}/v1/rates",
                params={"origin": origin_city, "destination": destination_city, "weight": weight},
                headers=self.headers,
                timeout=15,
            )
            data = r.json()
            return float(data.get("rate", 250))

    async def cancel(self, tracking_number: str) -> bool:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    f"{self.BASE_URL}/v1/shipments/{tracking_number}/cancel",
                    headers=self.headers, timeout=15,
                )
                return r.status_code == 200
        except Exception:
            return False
