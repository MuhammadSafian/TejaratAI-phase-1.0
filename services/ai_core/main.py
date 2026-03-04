from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from core.db import init_db, close_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("🚀 Tejarat AI Core — asyncpg pool ready")
    yield
    await close_db()
    print("🛑 Tejarat AI Core shutting down")

app = FastAPI(
    title="Tejarat AI Core API",
    description="AI-powered e-commerce analytics engine for Pakistani sellers",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth Routes (OTP + Google Login) ─────────────────
from routes.auth_routes import router as auth_router
app.include_router(auth_router)

# ── Pydantic Models ──────────────────────────────────
class OrderProcessRequest(BaseModel):
    platform: str
    order_data: dict

class ShipmentUpdateRequest(BaseModel):
    tracking_number: str
    status: str
    courier: str
    timestamp: Optional[str] = None

class AnalysisRequest(BaseModel):
    seller_id: str
    analysis_type: str = "daily"

# ── Routes ───────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "tijarat-ai-core", "db": "asyncpg"}

@app.post("/api/v1/process-order")
async def process_order(req: OrderProcessRequest):
    return {"status": "queued", "platform": req.platform}

@app.post("/api/v1/shipment-update")
async def shipment_update(req: ShipmentUpdateRequest):
    from core import db
    await db.execute(
        "UPDATE shipments SET status = $1 WHERE tracking_number = $2",
        req.status, req.tracking_number,
    )
    return {"status": "updated", "tracking": req.tracking_number}

@app.post("/api/v1/run-analysis")
async def run_analysis(req: AnalysisRequest):
    from core.tasks import run_daily_analysis
    run_daily_analysis.delay(req.seller_id)
    return {"status": "analysis_queued", "seller_id": req.seller_id}

@app.get("/api/v1/seller/{seller_id}/health-score")
async def get_health_score(seller_id: str):
    from core import db
    row = await db.fetch_one(
        "SELECT name FROM sellers WHERE id = $1", seller_id,
    )
    return {
        "seller_id": seller_id,
        "seller_name": row["name"] if row else "Unknown",
        "business_health_score": 78.5,
        "last_updated": datetime.utcnow().isoformat(),
    }

@app.get("/api/v1/seller/{seller_id}/rto-check")
async def rto_check(seller_id: str, phone: str, city: str, amount: float = 0):
    from nodes.logistics.rto_predictor import calculate_rto_score, count_orders_today, is_new_customer
    orders_today = await count_orders_today(phone)
    new_cust = await is_new_customer(phone)
    score, signals = await calculate_rto_score(
        phone=phone, city=city, courier="tcs",
        order_value=amount, order_time=datetime.utcnow(),
        order_count_today=orders_today, is_new_customer=new_cust,
    )
    risk = "low" if score < 31 else ("medium" if score < 61 else "high")
    return {"rto_score": score, "risk_level": risk, "signals": signals}
