import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["service"] == "tijarat-ai-core"

@pytest.mark.asyncio
async def test_process_order():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/process-order", json={
            "platform": "shopify",
            "order_data": {"id": "TEST-1", "total_price": 5000}
        })
    assert resp.status_code == 200
    assert resp.json()["status"] == "queued"

@pytest.mark.asyncio
async def test_shipment_update():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/shipment-update", json={
            "tracking_number": "TCS-12345",
            "status": "delivered",
            "courier": "tcs"
        })
    assert resp.status_code == 200
    assert resp.json()["status"] == "updated"

@pytest.mark.asyncio
async def test_health_score():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/seller/test-seller/health-score")
    assert resp.status_code == 200
    data = resp.json()
    assert "business_health_score" in data
    assert data["seller_id"] == "test-seller"
