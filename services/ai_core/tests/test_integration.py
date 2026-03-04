"""
Tejarat AI — Integration Tests
Tests with real asyncpg DB (uses test DB from CI/CD pipeline).
"""
import pytest
import asyncio
import os

# Only run integration tests when DB is available
SKIP_INTEGRATION = os.environ.get("TESTING") != "true"
skip_reason = "Integration tests require TESTING=true and test DB"


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="module")
async def db_pool():
    """Initialize test DB pool."""
    if SKIP_INTEGRATION:
        pytest.skip(skip_reason)
    from core.db import init_db, close_db, get_pool
    await init_db()
    pool = await get_pool()
    yield pool
    await close_db()


# ──────────────────────────────────────────────────────────
# DB Connection Tests
# ──────────────────────────────────────────────────────────
@pytest.mark.skipif(SKIP_INTEGRATION, reason=skip_reason)
@pytest.mark.asyncio
async def test_db_connection(db_pool):
    result = await db_pool.fetchval("SELECT 1")
    assert result == 1


@pytest.mark.skipif(SKIP_INTEGRATION, reason=skip_reason)
@pytest.mark.asyncio
async def test_tables_exist(db_pool):
    tables = await db_pool.fetch(
        """SELECT table_name FROM information_schema.tables
           WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"""
    )
    table_names = [t["table_name"] for t in tables]
    expected = ["sellers", "orders", "inventory", "shipments", "rto_history", "platform_tokens"]
    for t in expected:
        assert t in table_names, f"Table {t} missing"


@pytest.mark.skipif(SKIP_INTEGRATION, reason=skip_reason)
@pytest.mark.asyncio
async def test_rls_policies_exist(db_pool):
    policies = await db_pool.fetch(
        "SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public'"
    )
    assert len(policies) >= 7, f"Expected 7+ RLS policies, got {len(policies)}"


# ──────────────────────────────────────────────────────────
# Seller CRUD Tests
# ──────────────────────────────────────────────────────────
@pytest.mark.skipif(SKIP_INTEGRATION, reason=skip_reason)
@pytest.mark.asyncio
async def test_create_seller(db_pool):
    from core import db
    seller_id = await db.fetch_val(
        """INSERT INTO sellers (name, phone, password_hash)
           VALUES ($1, $2, $3) RETURNING id::text""",
        "Test Seller", "+923001234567", "hashed_pw",
    )
    assert seller_id is not None
    # Cleanup
    await db.execute("DELETE FROM sellers WHERE id = $1", seller_id)


# ──────────────────────────────────────────────────────────
# Security Tests
# ──────────────────────────────────────────────────────────
def test_password_hashing():
    from security.passwords import hash_password, verify_password
    hashed = hash_password("test_password_123")
    assert hashed != "test_password_123"
    assert verify_password("test_password_123", hashed)
    assert not verify_password("wrong_password", hashed)


def test_otp_generation():
    from security.otp import generate_otp
    otp = generate_otp()
    assert len(otp) == 6
    assert otp.isdigit()


def test_vault_encryption():
    from cryptography.fernet import Fernet
    from hashlib import sha256
    import base64, json

    key = base64.urlsafe_b64encode(sha256(b"test_key").digest())
    f = Fernet(key)

    data = {"access_token": "test_token_123", "shop": "test.myshopify.com"}
    encrypted = f.encrypt(json.dumps(data).encode())
    decrypted = json.loads(f.decrypt(encrypted))
    assert decrypted == data


# ──────────────────────────────────────────────────────────
# Address Validator Tests
# ──────────────────────────────────────────────────────────
def test_address_quality_karachi():
    from integrations.address_validator import validate_address_quality
    score = validate_address_quality("House #123, Block 5, Clifton, near Sea View", "Karachi")
    assert score >= 0.8  # Known city + area + house + long address


def test_address_quality_unknown_city():
    from integrations.address_validator import validate_address_quality
    score = validate_address_quality("some place", "UnknownVillage")
    assert score <= 0.2


def test_geo_db_coverage():
    from integrations.address_validator import PAKISTAN_GEO_DB
    assert len(PAKISTAN_GEO_DB) >= 90  # 90+ cities
    # All provinces covered
    provinces = set(city["province"] for city in PAKISTAN_GEO_DB.values())
    assert "Punjab" in provinces
    assert "Sindh" in provinces
    assert "KPK" in provinces
    assert "Balochistan" in provinces


def test_cold_start_benchmarks():
    from integrations.address_validator import get_cold_start_benchmarks
    clothing = get_cold_start_benchmarks("clothing")
    assert clothing["avg_rto"] == 28
    assert clothing["avg_margin"] == 35
    default = get_cold_start_benchmarks("nonexistent")
    assert default["avg_rto"] == 27


# ──────────────────────────────────────────────────────────
# RTO Predictor Unit Tests
# ──────────────────────────────────────────────────────────
def test_rto_signal_weights():
    from nodes.logistics.rto_predictor import RTO_SIGNALS, BASE_SCORE
    assert BASE_SCORE == 20
    assert RTO_SIGNALS["phone_repeated_fake"] == 35
    assert RTO_SIGNALS["phone_verified_buyer"] == -15
    assert len(RTO_SIGNALS) >= 14


# ──────────────────────────────────────────────────────────
# ROI Calculator Unit Tests
# ──────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_courier_rate():
    from nodes.logistics.roi_calculator import _get_courier_rate
    rate = await _get_courier_rate("tcs", "Karachi", 0.5)
    assert rate == 250  # base rate
    rate_heavy = await _get_courier_rate("tcs", "Karachi", 2.0)
    assert rate_heavy == 325  # 250 + (1.5 * 50)


# ──────────────────────────────────────────────────────────
# BHS Calculator Tests
# ──────────────────────────────────────────────────────────
def test_bhs_calculator():
    from nodes.supervisor import calculate_business_health_score
    state = {
        "sales_trends": {"weekly_trend": 10},
        "rto_score": 20,
        "true_roi": 30,
        "inventory_status": {"total_skus": 10},
        "low_stock_items": [],
        "dead_stock_items": [],
        "cod_confirmed": True,
    }
    score = calculate_business_health_score(state)
    assert 0 <= score <= 100


def test_priority_actions():
    from nodes.supervisor import generate_priority_actions
    state = {
        "rto_score": 75,
        "true_roi": -5,
        "low_stock_items": [{"name": "Item A"}],
        "dead_stock_items": [{"name": "Item B", "action_suggestion": "discount"}],
        "anomalies_detected": ["Sales down 30%"],
    }
    actions = generate_priority_actions(state)
    assert len(actions) >= 1
