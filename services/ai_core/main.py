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
from routes.data_routes import router as data_router
app.include_router(auth_router)
app.include_router(data_router)

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

class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []

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

@app.post("/api/v1/seller/{seller_id}/chat")
async def chat_with_agent(seller_id: str, req: ChatRequest):
    # This is the Brain of TijaratAI Chat
    # It bridges natural language queries to our 4-agent core
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from core.config import settings
        
        if not settings.GOOGLE_API_KEY:
            # Fallback if no API key
            return {
                "message": "AI core is in 'Local Protocol' mode. I can see your dashboard data but Gemini brain is offline. How can I help with your inventory?",
                "role": "assistant"
            }

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
        
        # Pull context from DB for personal touch
        from core import db
        seller = await db.fetch_one("SELECT name FROM sellers WHERE id = $1", seller_id)
        seller_name = seller["name"] if seller else "Safian"
        
        # Create a system prompt that gives the AI 'Consciousness' of the business
        system_prompt = f"""You are 'TijaratAI Supervisor', the neural brain of a premium e-commerce management platform for Pakistan.
Your user is {seller_name}.
You have access to:
1. Sales Agent (Predictive trends)
2. Inventory Agent (Stock velocity)
3. Logistics Agent (RTO risk & Courier ROI)
4. Supervisor Agent (Health Score Logic)

Your tone: Professional, 'Terminal-inspired', slightly futuristic, and helpful. 
Language: Mix of English and Roman Urdu (Hinglish/Urdu-ish) to feel local.
Always include a short Urdu summary at the end of technical advice.

User Query: {req.message}"""

        response = await llm.ainvoke(system_prompt)
        return {
            "message": response.content,
            "role": "assistant"
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Neural core connection failed")
