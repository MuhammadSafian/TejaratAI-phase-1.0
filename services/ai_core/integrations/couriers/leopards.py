import httpx
import logging

logger = logging.getLogger(__name__)


class LeopardsClient:
    """Leopards Courier API Client — booking + tracking."""
    BASE_URL = "https://merchantapi.leopardscourier.com/api"

    def __init__(self, api_key: str, api_password: str):
        self.api_key = api_key
        self.api_password = api_password

    def _auth_params(self) -> dict:
        return {"api_key": self.api_key, "api_password": self.api_password}

    async def create_shipment(self, order: dict) -> dict:
        payload = {
            **self._auth_params(),
            "booked_packet_consignment_name": order.get("customer_name", ""),
            "booked_packet_consignment_phone": order.get("customer_phone", ""),
            "booked_packet_consignment_address": order.get("customer_address", ""),
            "booked_packet_destination_city": order.get("city", ""),
            "booked_packet_collect_amount": str(order.get("order_value", 0)),
            "booked_packet_weight": str(order.get("weight", 0.5)),
            "booked_packet_no_piece": str(order.get("pieces", 1)),
            "booked_packet_order_id": order.get("order_id", ""),
        }
        async with httpx.AsyncClient() as client:
            r = await client.post(f"{self.BASE_URL}/bookPacket/format/json", data=payload, timeout=30)
            data = r.json()
            packet = data.get("data", {})
            return {
                "tracking_number": packet.get("track_number", ""),
                "slip_link": packet.get("slip_link", ""),
                "status": packet.get("booked_packet_status", ""),
            }

    async def track(self, tracking_number: str) -> dict:
        params = {**self._auth_params(), "track_numbers": tracking_number}
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.BASE_URL}/trackBookedPacket/format/json", params=params, timeout=30)
            data = r.json()
            packet = data.get("data", [{}])
            if isinstance(packet, list) and packet:
                packet = packet[0]
            status = packet.get("booked_packet_status", "unknown")
            # Normalize Leopards statuses
            status_map = {
                "Delivered": "delivered",
                "Returned": "returned",
                "In Transit": "in_transit",
                "Arrived at Station": "in_transit",
                "Dispatched": "out_for_delivery",
            }
            return {
                "tracking_number": tracking_number,
                "status": status_map.get(status, status.lower()),
                "raw_status": status,
            }

    async def get_cities(self) -> list:
        """Get list of serviceable cities."""
        params = self._auth_params()
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.BASE_URL}/getAllCities/format/json", params=params, timeout=15)
            data = r.json()
            return data.get("data", [])

    async def get_rate(self, origin_city: str, destination_city: str, weight: float) -> float:
        """Calculate shipping rate."""
        params = {
            **self._auth_params(),
            "origin_city": origin_city,
            "destination_city": destination_city,
            "weight": str(weight),
        }
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.BASE_URL}/getShipmentRate/format/json", params=params, timeout=15)
            data = r.json()
            return float(data.get("data", {}).get("rate", 200))

    async def cancel(self, tracking_number: str) -> bool:
        try:
            payload = {**self._auth_params(), "cn_numbers": tracking_number}
            async with httpx.AsyncClient() as client:
                r = await client.post(f"{self.BASE_URL}/cancelBookedPacket/format/json", data=payload, timeout=15)
                return r.json().get("status", 0) == 1
        except Exception:
            return False
