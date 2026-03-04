import asyncio

class BlueExClient:
    """BlueEx SOAP API wrapper — uses zeep library."""
    WSDL_URL = "https://blueex.com.pk/WebService/BlueExService.svc?wsdl"

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self._client = None

    def _get_client(self):
        if self._client is None:
            try:
                from zeep import Client
                self._client = Client(self.WSDL_URL)
            except ImportError:
                raise ImportError("zeep library required for BlueEx: pip install zeep")
        return self._client

    async def create_shipment(self, order: dict) -> dict:
        client = self._get_client()
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: client.service.CreateShipment(
                UserName=self.username,
                Password=self.password,
                OrderRef=order["order_id"],
                ConsigneeName=order["customer_name"],
                ConsigneePhone=order["customer_phone"],
                ConsigneeAddress=order["customer_address"],
                ConsigneeCity=order["customer_city"],
                CODAmount=str(order.get("cod_amount", 0)),
                Weight=str(order.get("weight_kg", 0.5)),
            ),
        )
        return {"tracking_number": result.get("TrackingNumber") if result else None}
