from integrations.couriers import get_best_courier, COURIER_CLIENTS
import pytest

@pytest.mark.asyncio
async def test_get_best_courier_karachi():
    result = await get_best_courier("Karachi")
    assert result == "tcs"

@pytest.mark.asyncio
async def test_get_best_courier_lahore():
    result = await get_best_courier("Lahore")
    assert result == "leopards"

@pytest.mark.asyncio
async def test_get_best_courier_unknown():
    result = await get_best_courier("SomeVillage")
    assert result == "leopards"  # default fallback

def test_courier_clients_registry():
    assert "tcs" in COURIER_CLIENTS
    assert "leopards" in COURIER_CLIENTS
