# TEJARAT.AI — Phase 1 Complete Technical Blueprint
> Pakistan ka Pehla Full-Stack E-Commerce AI Platform  
> Shopify · Daraz · WooCommerce | TCS · Leopards · PostEx · Trax · BlueEx  
> Version: 1.0 | Status: MVP Design Specification

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview & Architecture](#2-system-overview--architecture)
3. [LangGraph Multi-Agent Architecture](#3-langgraph-multi-agent-architecture)
4. [Agent A — Sales Analysis Agent](#4-agent-a--sales-analysis-agent)
5. [Agent B — Inventory Agent](#5-agent-b--inventory-agent)
6. [Agent C — Local Logistics Agent (RTO + ROI + COD)](#6-agent-c--local-logistics-agent-rto--roi--cod)
7. [Agent D — Business Manager (Supervisor Node)](#7-agent-d--business-manager-supervisor-node)
8. [Platform Integrations](#8-platform-integrations)
9. [Logistics Provider Integrations](#9-logistics-provider-integrations)
10. [Security Framework](#10-security-framework)
11. [Docker Compose Infrastructure](#11-docker-compose-infrastructure)
12. [CI/CD Pipeline](#12-cicd-pipeline)
13. [Database Schema Design](#13-database-schema-design)
14. [WhatsApp Notification System](#14-whatsapp-notification-system)
15. [Missing Pieces — Added to Plan](#15-missing-pieces--added-to-plan)
16. [Environment Variables Reference](#16-environment-variables-reference)
17. [API Endpoints Reference](#17-api-endpoints-reference)
18. [Phase 2 Preview](#18-phase-2-preview)

---

## 1. Executive Summary

### Problem Statement

Pakistan mein e-commerce sellers ko 5 critical problems face karne padte hain:

| # | Problem | Business Impact |
|---|---------|----------------|
| 1 | **RTO Rate 30–45%** (Return-to-Origin) | Har return = courier cost + packaging + opportunity loss |
| 2 | **COD Cash Flow Blind Spot** | Seller nahi jaanta paisa kab aayega | 
| 3 | **Multi-Platform Data Silos** | Shopify + Daraz + WooCommerce — teen jagah manually dekhna |
| 4 | **Inventory Overselling** | Ek product dono platforms pe bik jaata hai |
| 5 | **Hidden Profit Erosion** | Real margin pata nahi — 12 hidden costs ignore hote hain |

### Solution: Tejarat.AI Phase 1

Ek unified AI platform jo **4 intelligent agents** ke through in sab problems ko solve kare:

```
Sales Analysis Agent  →  Inventory Agent  →  Logistics Agent  →  Business Manager
       ↑                      ↑                    ↑                     ↑
  Shopify/Daraz         Stock Tracking         RTO/ROI/COD          Orchestrator
  WooCommerce           Multi-Platform         TCS/Leopards          WhatsApp/UI
```

### Tech Stack Summary

```
Backend:      FastAPI (Python 3.11) + NestJS (Node.js 20)
AI Engine:    LangGraph + LangChain + Gemini Pro / GPT-4o-mini
Database:     PostgreSQL 15 + TimescaleDB + Redis 7
Mobile:       React Native (Expo)
Frontend:     Next.js 14 (App Router)
Queue:        Celery + Redis (Bull MQ for Node services)
Deploy:       Docker Compose → AWS ECS (Phase 2)
Auth:         JWT (RS256) + OAuth 2.0 + bcrypt
Encryption:   AES-256-GCM (Fernet) via cryptography library
```

---

## 2. System Overview & Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                            │
│   Shopify API    Daraz OP API    WooCommerce    WhatsApp User    │
└──────────┬──────────────┬───────────────┬──────────────┬────────┘
           │              │               │              │
           ▼              ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│              tijarat-gateway  (NestJS — Port 3000)              │
│         OAuth Handler · Rate Limiter · JWT Validator            │
│         Webhook Receiver · Request Router · API Gateway         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Internal HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│             tijarat-ai-core  (FastAPI — Port 8000)              │
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│   │ Sales Agent │  │  Inventory  │  │  Logistics Agent    │    │
│   │   (Node)    │  │   Agent     │  │  RTO + ROI + COD    │    │
│   └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘    │
│          └────────────────┴──────────────────────┘             │
│                           │  LangGraph StateGraph              │
│                           ▼                                    │
│              ┌─────────────────────────┐                       │
│              │  Business Manager Node  │                       │
│              │  (Supervisor / Boss)    │                       │
│              └────────────┬────────────┘                       │
└───────────────────────────┼─────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         WhatsApp      Dashboard      Celery Worker
         (Output)     (Next.js)      (Background Jobs)
```

### Microservices Port Map

| Service | Technology | Port | Responsibility |
|---------|------------|------|----------------|
| `tijarat-gateway` | NestJS | 3000 | API Gateway, Auth, OAuth, Webhooks |
| `tijarat-ai-core` | FastAPI | 8000 | LangGraph Agents, AI Logic |
| `tijarat-dashboard` | Next.js | 80/443 | Seller Dashboard UI |
| `tijarat-db` | PostgreSQL + TimescaleDB | 5432 | Primary Database |
| `tijarat-cache` | Redis 7 | 6379 | Cache + Rate Limit + Queue |
| `tijarat-worker` | Celery | — | Async Background Tasks |
| `tijarat-minio` | MinIO | 9000 | File Storage (Reports, Exports) |

> **Missing Piece Added:** MinIO for PDF report storage and Excel exports — bina file storage ke reports lost ho jayenge.

---

## 3. LangGraph Multi-Agent Architecture

### Why LangGraph?

LangGraph ek **StateGraph** framework hai jo:
- **Persistent State** maintain karta hai across agent calls
- **Human-in-the-loop interrupts** support karta hai
- **Conditional edges** — agent ka output decide karta hai next step
- **Retry logic** — graph ke andar built-in error handling
- **Checkpointing** — state save hoti hai, crash pe resume ho sakta hai

### State Definition

```python
# core/state.py
from typing import TypedDict, Optional, List, Annotated
from langgraph.graph.message import add_messages
from datetime import datetime

class TijaratState(TypedDict):
    """
    Shared State — har agent is object ko read/write karta hai.
    Ek baar Sales Agent ne city nikali, Logistics ko dobara mehnat nahi karni.
    """
    # === Trigger Info ===
    trigger_type: str           # "new_order" | "daily_analysis" | "manual"
    trigger_time: datetime
    seller_id: str
    
    # === Order Data (new_order trigger ke liye) ===
    order_id: Optional[str]
    order_platform: Optional[str]   # "shopify" | "daraz" | "woocommerce"
    customer_phone: Optional[str]
    customer_city: Optional[str]
    order_value: Optional[float]
    order_items: Optional[List[dict]]
    payment_method: Optional[str]   # "cod" | "prepaid"
    
    # === Sales Agent Output ===
    sales_trends: Optional[dict]    # city/product/time breakdown
    top_products: Optional[List[str]]
    anomalies_detected: Optional[List[str]]
    sales_insights_urdu: Optional[str]   # Gemini-generated Urdu text
    
    # === Inventory Agent Output ===
    inventory_status: Optional[dict]
    low_stock_items: Optional[List[dict]]
    dead_stock_items: Optional[List[dict]]
    reorder_required: Optional[List[dict]]
    inventory_health_score: Optional[float]
    
    # === Logistics Agent Output ===
    rto_score: Optional[float]          # 0–100
    rto_risk_level: Optional[str]       # "low" | "medium" | "high"
    rto_signals: Optional[dict]         # breakdown of signals
    true_roi: Optional[float]           # calculated ROI %
    cod_confirmed: Optional[bool]       # WhatsApp confirm status
    recommended_courier: Optional[str]
    
    # === Business Manager Output ===
    business_health_score: Optional[float]   # 0–100 composite
    priority_actions: Optional[List[str]]    # top 3 actions
    final_report_urdu: Optional[str]
    whatsapp_message: Optional[str]
    
    # === Control Flow ===
    requires_human_approval: bool       # Human-in-the-loop flag
    human_decision: Optional[str]       # "approve" | "reject" | "override"
    error_log: Optional[List[str]]
    
    # === Message History (LangGraph built-in) ===
    messages: Annotated[list, add_messages]
```

### Graph Definition

```python
# core/graph.py
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.postgres import PostgresSaver
from .state import TijaratState
from .nodes import (
    sales_node, inventory_node, logistics_node,
    supervisor_node, human_approval_node, output_node,
    error_handler_node
)

def build_graph(checkpointer) -> StateGraph:
    graph = StateGraph(TijaratState)
    
    # ── Register Nodes ──────────────────────────────
    graph.add_node("sales_agent",    sales_node)
    graph.add_node("inventory_agent", inventory_node)
    graph.add_node("logistics_agent", logistics_node)
    graph.add_node("supervisor",      supervisor_node)
    graph.add_node("human_approval",  human_approval_node)   # INTERRUPT point
    graph.add_node("output",          output_node)
    graph.add_node("error_handler",   error_handler_node)
    
    # ── Edges ────────────────────────────────────────
    # START → Sales (always first — context establish karo)
    graph.add_edge(START, "sales_agent")
    
    # Sales → Inventory (parallel possible in Phase 2, sequential for now)
    graph.add_edge("sales_agent", "inventory_agent")
    
    # Inventory → Logistics
    graph.add_edge("inventory_agent", "logistics_agent")
    
    # Logistics → Conditional: human approval needed?
    graph.add_conditional_edges(
        "logistics_agent",
        route_after_logistics,   # decides next node
        {
            "needs_approval": "human_approval",
            "auto_proceed":   "supervisor",
            "error":          "error_handler",
        }
    )
    
    # Human Approval → wait for seller input → Supervisor
    graph.add_conditional_edges(
        "human_approval",
        route_after_human,
        {
            "approved":  "supervisor",
            "rejected":  "output",       # skip supervisor, direct output
            "timeout":   "supervisor",   # 30 min timeout → auto proceed conservative
        }
    )
    
    # Supervisor → Output
    graph.add_edge("supervisor", "output")
    
    # Error Handler → Output (with error info in state)
    graph.add_edge("error_handler", "output")
    
    # Output → END
    graph.add_edge("output", END)
    
    return graph.compile(
        checkpointer=checkpointer,          # PostgreSQL checkpointing
        interrupt_before=["human_approval"] # pause yahan pe
    )


def route_after_logistics(state: TijaratState) -> str:
    """
    Logistics node ke baad kahan jaana hai decide karo.
    High RTO + COD order = human approval chahiye.
    """
    if state.get("error_log"):
        return "error"
    
    rto_score = state.get("rto_score", 0)
    payment   = state.get("payment_method", "prepaid")
    
    # High risk COD orders require human approval (Pakistan-specific logic)
    if rto_score >= 61 and payment == "cod":
        return "needs_approval"
    
    return "auto_proceed"


def route_after_human(state: TijaratState) -> str:
    decision = state.get("human_decision")
    if decision == "reject":
        return "rejected"
    if decision is None:  # timeout
        return "timeout"
    return "approved"
```

### Routing Logic Diagram

```
START
  │
  ▼
[Sales Agent] ──error──► [Error Handler]──►[Output]──► END
  │
  ▼
[Inventory Agent] ──error──► [Error Handler]
  │
  ▼
[Logistics Agent]
  │
  ├── RTO ≥ 61 + COD ──► [Human Approval] ──approve──► [Supervisor]
  │                                        ──reject───► [Output] ──► END
  │                                        ──timeout──► [Supervisor]
  │
  └── RTO < 61 OR Prepaid ──► [Supervisor]
                                   │
                                   ▼
                              [Output Node]
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼               ▼
               WhatsApp       Dashboard        PDF Store
                                                  END
```

### State Management — Shared Memory

```python
# Ek baar Sales Agent ne city extract ki — Logistics directly use karta hai
# Dobara API call ki zaroorat nahi

# Sales Agent mein:
state["customer_city"] = extracted_city  # "Karachi"

# Logistics Agent mein:
city = state["customer_city"]  # direct — no re-fetch
rto = lookup_rto_score(city, phone)
```

### Human-in-the-Loop Implementation

```python
# nodes/human_approval.py
import asyncio
from ..state import TijaratState

async def human_approval_node(state: TijaratState) -> dict:
    """
    Yeh node INTERRUPT karta hai graph ko.
    Seller ko WhatsApp/Dashboard pe notification jaati hai.
    30 minute tak wait karta hai seller ki response ka.
    """
    order_id    = state["order_id"]
    rto_score   = state["rto_score"]
    seller_id   = state["seller_id"]
    
    # Seller ko notify karo
    await send_approval_request(
        seller_id  = seller_id,
        order_id   = order_id,
        rto_score  = rto_score,
        message    = (
            f"⚠️ Order #{order_id} HIGH RISK hai (Score: {rto_score}/100).\n"
            f"COD amount: Rs {state['order_value']}\n"
            f"City: {state['customer_city']}\n\n"
            f"Kya aap yeh order process karna chahte hain?\n"
            f"Reply: APPROVE / REJECT / ADVANCE\n"
            f"(30 minute mein respond karein)"
        )
    )
    
    # State save karke interrupt — LangGraph yahan pause ho jaata hai
    # Seller ka response Dashboard ya WhatsApp se aayega
    # Graph tab resume hoga jab human_decision state mein set ho
    return {"requires_human_approval": True}


async def resume_after_human(
    graph, thread_id: str, seller_decision: str
):
    """
    Seller ne decision diya — graph resume karo.
    Dashboard ya WhatsApp se call hota hai yeh function.
    """
    decision_map = {
        "APPROVE":  "approve",
        "REJECT":   "reject", 
        "ADVANCE":  "advance",  # partial payment request karega
    }
    
    decision = decision_map.get(seller_decision.upper(), "approve")
    
    await graph.ainvoke(
        {"human_decision": decision},
        config={"configurable": {"thread_id": thread_id}}
    )
```

### Error Handling & Retry

```python
# nodes/error_handler.py

async def error_handler_node(state: TijaratState) -> dict:
    """
    Agar Daraz API down hai ya koi agent fail kiya —
    system crash nahi karta, graceful degradation hota hai.
    """
    errors = state.get("error_log", [])
    
    recovery_actions = []
    
    for error in errors:
        if "daraz_api" in error:
            # Daraz down — cached data use karo
            cached = await get_cached_daraz_data(state["seller_id"])
            state["sales_trends"] = cached or {"status": "unavailable"}
            recovery_actions.append("Daraz data: cached version used")
            
        elif "logistics_api" in error:
            # Courier API down — average RTO use karo
            city = state.get("customer_city", "unknown")
            state["rto_score"] = get_city_average_rto(city)
            recovery_actions.append(f"RTO: city average used for {city}")
            
        elif "gemini_api" in error:
            # AI insights unavailable — template use karo
            state["sales_insights_urdu"] = generate_template_insight(state)
            recovery_actions.append("AI insights: template fallback used")
    
    state["final_report_urdu"] = (
        "⚠️ Kuch services temporarily unavailable thin.\n"
        f"Recovery: {', '.join(recovery_actions)}\n"
        "Data partial ho sakta hai."
    )
    
    return state
```

---

## 4. Agent A — Sales Analysis Agent

### Responsibility

Shopify, Daraz, WooCommerce se pichle 6 mahine ka data pull karke:
- Sales ko City / Product / Time categories mein divide karna
- Trends aur anomalies detect karna  
- Gemini AI se Urdu mein actionable insight generate karna

### Node Implementation

```python
# nodes/sales_agent.py
from langchain_google_genai import ChatGoogleGenerativeAI
from ..integrations import ShopifyClient, DarazClient, WooCommerceClient
from ..state import TijaratState
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

gemini = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0.3
)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def fetch_platform_data(client, seller_id: str, days: int = 180):
    """Retry logic — API fail hone par automatically retry."""
    return await client.get_orders(seller_id=seller_id, days_back=days)

async def sales_node(state: TijaratState) -> dict:
    seller_id = state["seller_id"]
    
    # ── 1. Data Pull ──────────────────────────────────────
    raw_orders = []
    errors = []
    
    platforms = [
        ("shopify",      ShopifyClient),
        ("daraz",        DarazClient),
        ("woocommerce",  WooCommerceClient),
    ]
    
    for platform_name, ClientClass in platforms:
        try:
            client = ClientClass(seller_id=seller_id)
            if await client.is_connected():
                orders = await fetch_platform_data(client, seller_id)
                for order in orders:
                    order["_platform"] = platform_name
                raw_orders.extend(orders)
        except Exception as e:
            errors.append(f"daraz_api: {str(e)}" if "daraz" in platform_name else f"{platform_name}_api: {str(e)}")
    
    # ── 2. Data Analysis ─────────────────────────────────
    analysis = analyze_sales_data(raw_orders)
    
    # ── 3. Anomaly Detection ─────────────────────────────
    anomalies = detect_anomalies(analysis)
    
    # ── 4. Gemini AI Insight (Urdu) ───────────────────────
    insight_prompt = f"""
    Aap ek Pakistan e-commerce business advisor hain.
    Neeche ek seller ka sales data hai. Urdu mein ek friendly, 
    actionable insight likhein — jaise koi dost baat kar raha ho.
    
    Data:
    - Best selling product: {analysis['top_product']}
    - Best city: {analysis['top_city']}  
    - Best day: {analysis['best_day']}
    - Weekly trend: {analysis['weekly_trend']}%
    - Anomalies: {anomalies}
    
    Format: 2-3 sentences max. Roman Urdu ya Nastaleeq — seller ki preference: {get_seller_pref(seller_id)}
    
    Example: "Sir, aapki 'Blue Kurti' Tuesday ko sab se zyada bikti hai Karachi mein. 
    Is hafte sales 12% upar gayi hain. Lahore mein demand badhh rahi hai — wahan listing strong karein."
    """
    
    response = await gemini.ainvoke(insight_prompt)
    
    return {
        "sales_trends":       analysis,
        "top_products":       analysis["top_products"][:5],
        "anomalies_detected": anomalies,
        "sales_insights_urdu": response.content,
        "customer_city":      analysis.get("top_city"),  # Logistics Agent use karega
        "error_log":          errors if errors else state.get("error_log", []),
    }


def analyze_sales_data(orders: list) -> dict:
    """
    Sales ko 3 dimensions mein divide karo:
    1. City  — Karachi, Lahore, Islamabad, etc.
    2. Product — SKU level
    3. Time  — Hour of day, Day of week, Month
    """
    from collections import defaultdict
    import pandas as pd
    
    df = pd.DataFrame(orders)
    if df.empty:
        return {"status": "no_data"}
    
    # City breakdown
    city_sales = df.groupby("city")["total_price"].sum().to_dict()
    
    # Product breakdown  
    product_sales = df.explode("line_items").groupby(
        "line_items.product_id"
    )["line_items.quantity"].sum().to_dict()
    
    # Time breakdown
    df["created_at"] = pd.to_datetime(df["created_at"])
    df["day_of_week"] = df["created_at"].dt.day_name()
    day_sales = df.groupby("day_of_week")["total_price"].sum().to_dict()
    
    # Week-over-week trend
    this_week  = df[df["created_at"] >= pd.Timestamp.now() - pd.Timedelta(days=7)]["total_price"].sum()
    last_week  = df[(df["created_at"] >= pd.Timestamp.now() - pd.Timedelta(days=14)) & 
                    (df["created_at"] < pd.Timestamp.now() - pd.Timedelta(days=7))]["total_price"].sum()
    trend_pct  = ((this_week - last_week) / last_week * 100) if last_week > 0 else 0
    
    return {
        "city_breakdown":   city_sales,
        "product_breakdown": product_sales,
        "time_breakdown":   day_sales,
        "top_city":         max(city_sales, key=city_sales.get) if city_sales else "Unknown",
        "top_product":      max(product_sales, key=product_sales.get) if product_sales else "Unknown",
        "best_day":         max(day_sales, key=day_sales.get) if day_sales else "Unknown",
        "weekly_trend":     round(trend_pct, 1),
        "top_products":     sorted(product_sales, key=product_sales.get, reverse=True)[:10],
        "total_revenue_6m": float(df["total_price"].sum()),
        "total_orders_6m":  len(df),
        "return_rate":      len(df[df["financial_status"] == "refunded"]) / len(df) * 100,
    }
```

### Shopify OAuth Integration

```python
# integrations/shopify.py
import httpx
from cryptography.fernet import Fernet
from ..security import get_decrypted_token

class ShopifyClient:
    BASE_URL = "https://{shop}.myshopify.com/admin/api/2024-01"
    
    def __init__(self, seller_id: str):
        self.seller_id = seller_id
        # Encrypted token DB se lo — kabhi plain text mein nahi
        creds = get_decrypted_token(seller_id, "shopify")
        self.shop    = creds["shop_domain"]
        self.token   = creds["access_token"]
        self.headers = {
            "X-Shopify-Access-Token": self.token,
            "Content-Type": "application/json"
        }
    
    async def is_connected(self) -> bool:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL.format(shop=self.shop)}/shop.json",
                headers=self.headers, timeout=5
            )
            return r.status_code == 200
    
    async def get_orders(self, seller_id: str, days_back: int = 180) -> list:
        """
        Shopify Orders API — pagination handle karta hai.
        Rate limit: 2 req/sec (Shopify Basic), 4 req/sec (Advanced)
        """
        from datetime import datetime, timedelta
        
        since = (datetime.now() - timedelta(days=days_back)).isoformat()
        orders = []
        url = f"{self.BASE_URL.format(shop=self.shop)}/orders.json"
        params = {
            "created_at_min": since,
            "limit": 250,          # max per page
            "status": "any",
            "fields": "id,created_at,total_price,line_items,shipping_address,financial_status,fulfillment_status"
        }
        
        async with httpx.AsyncClient() as client:
            while url:
                response = await client.get(url, headers=self.headers, params=params, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                batch = data.get("orders", [])
                
                # Flatten for our schema
                for order in batch:
                    orders.append({
                        "order_id":      order["id"],
                        "created_at":    order["created_at"],
                        "total_price":   float(order["total_price"]),
                        "city":          order.get("shipping_address", {}).get("city", "Unknown"),
                        "financial_status": order["financial_status"],
                        "fulfillment_status": order.get("fulfillment_status"),
                        "line_items":    order["line_items"],
                    })
                
                # Pagination — Link header se next URL
                link_header = response.headers.get("Link", "")
                url = parse_next_link(link_header)
                params = {}  # URL already has params
        
        return orders
    
    async def register_webhook(self, topic: str, callback_url: str):
        """
        Shopify webhook register karo — real-time order notifications.
        Topics: orders/create, orders/updated, inventory_levels/update
        """
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{self.BASE_URL.format(shop=self.shop)}/webhooks.json",
                headers=self.headers,
                json={"webhook": {"topic": topic, "address": callback_url, "format": "json"}}
            )
```

### Daraz Integration

```python
# integrations/daraz.py
import hashlib, hmac, time
import httpx

class DarazClient:
    """
    Daraz Open Platform API
    Rate Limit: 1000 calls/day (Basic), 5000/day (Partner)
    Auth: HMAC-SHA256 signature
    """
    BASE_URL = "https://api.daraz.pk/rest"
    
    def __init__(self, seller_id: str):
        creds = get_decrypted_token(seller_id, "daraz")
        self.app_key    = creds["app_key"]
        self.app_secret = creds["app_secret"]
        self.access_token = creds["access_token"]
    
    def _sign(self, params: dict) -> str:
        """Daraz HMAC-SHA256 signature generation."""
        sorted_params = sorted(params.items())
        sign_string   = "".join(f"{k}{v}" for k, v in sorted_params)
        return hmac.new(
            self.app_secret.encode(),
            sign_string.encode(),
            hashlib.sha256
        ).hexdigest().upper()
    
    async def get_orders(self, seller_id: str, days_back: int = 180) -> list:
        """
        Daraz Orders API — strict rate limiting ke wajah se caching zaroori.
        Max 50 orders per call. Pagination loop.
        """
        from datetime import datetime, timedelta
        
        cache_key = f"daraz_orders:{seller_id}:{days_back}"
        cached = await redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
        
        since = int((datetime.now() - timedelta(days=days_back)).timestamp() * 1000)
        orders = []
        offset = 0
        limit  = 50
        
        async with httpx.AsyncClient() as client:
            while True:
                params = {
                    "app_key":     self.app_key,
                    "timestamp":   str(int(time.time() * 1000)),
                    "access_token": self.access_token,
                    "sign_method": "sha256",
                    "created_after": since,
                    "offset": offset,
                    "limit":  limit,
                }
                params["sign"] = self._sign(params)
                
                response = await client.get(
                    f"{self.BASE_URL}/orders/get",
                    params=params, timeout=30
                )
                
                data = response.json()
                batch = data.get("data", {}).get("orders", [])
                
                if not batch:
                    break
                
                orders.extend(self._normalize_orders(batch))
                offset += limit
                
                # Rate limit respect — 1 sec delay
                await asyncio.sleep(1)
        
        # Cache 6 ghante
        await redis_client.setex(cache_key, 21600, json.dumps(orders))
        return orders
    
    def _normalize_orders(self, daraz_orders: list) -> list:
        """Daraz format → Unified Tejarat format."""
        normalized = []
        for o in daraz_orders:
            normalized.append({
                "order_id":    o.get("order_id"),
                "created_at":  o.get("created_at"),
                "total_price": float(o.get("price", 0)),
                "city":        o.get("address_shipping", {}).get("city", "Unknown"),
                "financial_status": "paid" if o.get("statuses") == "delivered" else "pending",
                "fulfillment_status": o.get("statuses"),
                "line_items":  o.get("order_items", []),
            })
        return normalized
```

---

## 5. Agent B — Inventory Agent

### Responsibility

1. Sales Agent ke data se **velocity** calculate karna
2. **Reorder Point (ROP)** formula lagana
3. **Dead Stock** 45 din se nahi bika — Red flag karna
4. Multi-platform inventory sync (Shopify + Daraz — overselling rokna)

### ROP Formula

```
ROP = (Average Daily Sales × Lead Time) + Safety Stock

Where:
  Average Daily Sales = Total sold in last 30 days ÷ 30
  Lead Time           = Supplier se delivery ke average din (seller configure karta hai)
  Safety Stock        = Average Daily Sales × (Max Lead Time - Avg Lead Time)
```

### Node Implementation

```python
# nodes/inventory_agent.py
from datetime import datetime, timedelta
from ..state import TijaratState
from ..db import get_db

async def inventory_node(state: TijaratState) -> dict:
    seller_id = state["seller_id"]
    
    # Sales Agent se data already available hai state mein
    sales_data = state.get("sales_trends", {})
    
    db = get_db()
    
    # ── 1. Fetch Current Inventory ────────────────────
    inventory = await db.fetch_all(
        "SELECT * FROM inventory WHERE seller_id = :sid",
        {"sid": seller_id}
    )
    
    low_stock   = []
    dead_stock  = []
    reorder_req = []
    health_scores = []
    
    for item in inventory:
        sku = item["sku"]
        
        # ── 2. Velocity Calculation ───────────────────
        sales_last_30 = await db.fetch_val(
            """
            SELECT COALESCE(SUM(quantity), 0) FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE oi.sku = :sku 
              AND o.seller_id = :sid
              AND o.created_at >= :since
              AND o.status != 'returned'
            """,
            {"sku": sku, "sid": seller_id, "since": datetime.now() - timedelta(days=30)}
        )
        
        avg_daily_sales = sales_last_30 / 30
        
        # ── 3. ROP Calculation ─────────────────────────
        lead_time     = item.get("lead_time_days", 7)   # seller ne set kiya
        max_lead_time = item.get("max_lead_time_days", 10)
        safety_stock  = avg_daily_sales * (max_lead_time - lead_time)
        
        rop = (avg_daily_sales * lead_time) + safety_stock
        
        # ── 4. Dead Stock Detection ────────────────────
        last_sale_date = await db.fetch_val(
            """
            SELECT MAX(o.created_at) FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE oi.sku = :sku AND o.seller_id = :sid
            """,
            {"sku": sku, "sid": seller_id}
        )
        
        days_since_last_sale = (
            (datetime.now() - last_sale_date).days if last_sale_date else 999
        )
        
        # ── 5. Status Classification ───────────────────
        current_stock = item["quantity"]
        
        if days_since_last_sale >= 45:
            dead_stock.append({
                "sku":              sku,
                "name":             item["product_name"],
                "quantity":         current_stock,
                "days_stagnant":    days_since_last_sale,
                "estimated_value":  current_stock * float(item.get("cost_price", 0)),
                "action_suggestion": suggest_dead_stock_action(item)
            })
        elif current_stock <= rop:
            low_stock.append({
                "sku":          sku,
                "name":         item["product_name"],
                "current_stock": current_stock,
                "rop":          round(rop, 1),
                "days_remaining": round(current_stock / avg_daily_sales, 1) if avg_daily_sales > 0 else 999,
                "reorder_qty":  calculate_reorder_qty(avg_daily_sales, lead_time),
            })
            reorder_req.append({
                "sku": sku, "qty": calculate_reorder_qty(avg_daily_sales, lead_time),
                "supplier_whatsapp": item.get("supplier_phone"),
                "estimated_cost": calculate_reorder_qty(avg_daily_sales, lead_time) * float(item.get("cost_price", 0))
            })
        
        # Health score per item
        health = 100
        if days_since_last_sale >= 45: health -= 50
        elif current_stock <= rop:     health -= 30
        elif current_stock <= rop * 2: health -= 10
        health_scores.append(health)
    
    overall_health = sum(health_scores) / len(health_scores) if health_scores else 0
    
    # ── 6. Multi-Platform Sync ─────────────────────────
    await sync_inventory_across_platforms(seller_id, inventory)
    
    return {
        "inventory_status":    {"total_skus": len(inventory), "synced_at": datetime.now().isoformat()},
        "low_stock_items":     low_stock,
        "dead_stock_items":    dead_stock,
        "reorder_required":    reorder_req,
        "inventory_health_score": round(overall_health, 1),
    }


def suggest_dead_stock_action(item: dict) -> str:
    """Dead stock ke liye AI-powered suggestion."""
    value = item.get("quantity", 0) * float(item.get("cost_price", 0))
    
    if value > 10000:
        return "Bundle deal banao ya Daraz flash sale mein daalo"
    elif value > 3000:
        return "10% discount do ya OLX pe list karo"
    else:
        return "Giveaway ya free-with-purchase offer karo"


def calculate_reorder_qty(avg_daily_sales: float, lead_time: int) -> int:
    """30 din ka stock + lead time cover karne ke liye."""
    return max(int(avg_daily_sales * (30 + lead_time)), 1)


async def sync_inventory_across_platforms(seller_id: str, inventory: list):
    """
    Shopify + Daraz inventory sync — overselling rokne ke liye.
    Jab bhi koi order aaye kisi bhi platform pe, dono update hote hain.
    """
    shopify_client = ShopifyClient(seller_id=seller_id)
    daraz_client   = DarazClient(seller_id=seller_id)
    
    for item in inventory:
        qty = item["quantity"]
        sku = item["sku"]
        
        # Shopify update
        if item.get("shopify_variant_id"):
            await shopify_client.update_inventory(
                variant_id=item["shopify_variant_id"],
                quantity=qty
            )
        
        # Daraz update
        if item.get("daraz_seller_sku"):
            await daraz_client.update_inventory(
                seller_sku=item["daraz_seller_sku"],
                quantity=qty
            )
```

### WhatsApp Reorder Message

```python
async def send_reorder_whatsapp(seller_id: str, reorder_items: list):
    """
    Seller ka supplier WhatsApp number saved hai.
    Ek click se reorder message draft ho jaata hai.
    """
    for item in reorder_items:
        if not item.get("supplier_whatsapp"):
            continue
        
        message = (
            f"Assalam o Alaikum! 🙏\n\n"
            f"Mujhe {item['sku']} ka stock chahiye:\n"
            f"Quantity: {item['qty']} units\n"
            f"Estimated cost: Rs {item['estimated_cost']:,.0f}\n\n"
            f"Kab deliver kar sakte hain?\n\n"
            f"— Bheja via Tejarat.AI"
        )
        
        # WhatsApp deep link (seller manually send karega — privacy)
        whatsapp_url = f"https://wa.me/{item['supplier_whatsapp']}?text={quote(message)}"
        
        await send_seller_notification(
            seller_id=seller_id,
            type="reorder_prompt",
            data={"item": item["sku"], "whatsapp_url": whatsapp_url}
        )
```

---

## 6. Agent C — Local Logistics Agent (RTO + ROI + COD)

### Sub-Module 1: RTO Prediction

**Database Table:**

```sql
-- Pakistan COD History Table
CREATE TABLE rto_history (
    id              BIGSERIAL PRIMARY KEY,
    phone_number    VARCHAR(20)  NOT NULL,
    city            VARCHAR(100) NOT NULL,
    order_placed    BOOLEAN DEFAULT TRUE,
    order_delivered BOOLEAN DEFAULT FALSE,
    order_returned  BOOLEAN DEFAULT FALSE,
    return_reason   VARCHAR(100),           -- "not_home" | "refused" | "fake" | "address_wrong"
    courier         VARCHAR(50),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    seller_id       UUID                    -- NULL = shared community data (opt-in)
);

-- Index for fast lookup
CREATE INDEX idx_rto_phone ON rto_history(phone_number);
CREATE INDEX idx_rto_city  ON rto_history(city, courier);

-- City-Courier Return Rate Materialized View
CREATE MATERIALIZED VIEW city_courier_rto_rate AS
SELECT 
    city,
    courier,
    COUNT(*) as total_orders,
    SUM(CASE WHEN order_returned THEN 1 ELSE 0 END) as returned,
    ROUND(
        SUM(CASE WHEN order_returned THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2
    ) as return_rate_pct
FROM rto_history
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY city, courier;

-- Refresh weekly
CREATE UNIQUE INDEX ON city_courier_rto_rate (city, courier);
```

**RTO Scoring Logic:**

```python
# nodes/logistics/rto_predictor.py

RTO_SIGNALS = {
    # Phone signals
    "phone_previous_return":    +25,   # pehle return kiya
    "phone_repeated_fake":      +35,   # 3+ times fake order
    "phone_no_history":         +5,    # naya number, no data
    "phone_verified_buyer":     -15,   # pehle successfully delivered
    
    # Address signals  
    "address_incomplete":       +15,   # "near mosque, Karachi"
    "address_validated":        -10,   # full address with GPS match
    "address_rural_remote":     +10,   # remote area, harder delivery
    
    # Order signals
    "order_time_odd_hours":     +10,   # 1am–5am order
    "order_high_value_cod":     +15,   # Rs 5000+ COD
    "order_multiple_same_day":  +20,   # same phone, 3+ orders today
    "order_price_mismatch":     +12,   # product price vs city avg income gap
    "first_order_high_value":   +8,    # naya customer, mehanga item
    
    # City/Courier signals (from materialized view)
    "city_high_rto_courier":    +15,   # city mein is courier ki return rate > 35%
    "city_low_rto_courier":     -10,   # city mein is courier ki return rate < 15%
}

BASE_SCORE = 20  # Har order ka base risk score

async def calculate_rto_score(
    phone: str, city: str, courier: str,
    order_value: float, order_time: datetime,
    order_count_today: int, is_new_customer: bool
) -> tuple[float, dict]:
    """
    Returns: (score 0-100, signal breakdown dict)
    """
    score = BASE_SCORE
    signals_fired = {}
    
    # ── Phone History ─────────────────────────────────
    phone_history = await db.fetch_one(
        """
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN order_returned THEN 1 ELSE 0 END) as returns,
            SUM(CASE WHEN order_delivered THEN 1 ELSE 0 END) as deliveries
        FROM rto_history 
        WHERE phone_number = :phone
        """,
        {"phone": phone}
    )
    
    if phone_history["total"] == 0:
        score += RTO_SIGNALS["phone_no_history"]
        signals_fired["phone_no_history"] = True
    elif phone_history["returns"] >= 3:
        score += RTO_SIGNALS["phone_repeated_fake"]
        signals_fired["phone_repeated_fake"] = True
    elif phone_history["returns"] > 0:
        score += RTO_SIGNALS["phone_previous_return"]
        signals_fired["phone_previous_return"] = True
    elif phone_history["deliveries"] >= 2:
        score += RTO_SIGNALS["phone_verified_buyer"]
        signals_fired["phone_verified_buyer"] = True
    
    # ── Address Quality ───────────────────────────────
    address_score = await validate_pakistan_address(city)
    if address_score < 0.5:
        score += RTO_SIGNALS["address_incomplete"]
        signals_fired["address_incomplete"] = True
    
    # ── Order Pattern ────────────────────────────────
    order_hour = order_time.hour
    if order_hour < 5 or order_hour >= 1:  # 1am–5am
        score += RTO_SIGNALS["order_time_odd_hours"]
        signals_fired["order_time_odd_hours"] = True
    
    if order_value >= 5000 and payment_method == "cod":
        score += RTO_SIGNALS["order_high_value_cod"]
        signals_fired["order_high_value_cod"] = True
    
    if order_count_today >= 3:
        score += RTO_SIGNALS["order_multiple_same_day"]
        signals_fired["order_multiple_same_day"] = True
    
    # ── City-Courier Matrix ───────────────────────────
    city_rto = await db.fetch_val(
        "SELECT return_rate_pct FROM city_courier_rto_rate WHERE city = :c AND courier = :co",
        {"c": city, "co": courier}
    )
    
    if city_rto and city_rto > 35:
        score += RTO_SIGNALS["city_high_rto_courier"]
        signals_fired["city_high_rto_courier"] = True
    elif city_rto and city_rto < 15:
        score += RTO_SIGNALS["city_low_rto_courier"]
        signals_fired["city_low_rto_courier"] = True
    
    # Clamp to 0-100
    final_score = max(0, min(100, score))
    
    return final_score, signals_fired


async def logistics_node(state: TijaratState) -> dict:
    order_value = state.get("order_value", 0)
    phone       = state.get("customer_phone", "")
    city        = state.get("customer_city", "")
    items       = state.get("order_items", [])
    payment     = state.get("payment_method", "cod")
    
    # ── Best Courier Recommendation ───────────────────
    recommended_courier = await get_best_courier(city)
    
    rto_score, rto_signals = (0, {})
    
    if payment == "cod":
        # ── RTO Prediction ────────────────────────────
        rto_score, rto_signals = await calculate_rto_score(
            phone=phone, city=city,
            courier=recommended_courier,
            order_value=order_value,
            order_time=datetime.now(),
            order_count_today=await count_orders_today(phone),
            is_new_customer=await is_new_customer(phone)
        )
    
    # ── RTO Risk Level ────────────────────────────────
    if rto_score < 31:
        risk_level = "low"
    elif rto_score < 61:
        risk_level = "medium"
    else:
        risk_level = "high"
    
    # ── COD Confirmation (medium risk) ────────────────
    cod_confirmed = None
    if risk_level == "medium" and payment == "cod":
        cod_confirmed = await send_cod_confirmation_whatsapp(
            phone=phone, order_id=state["order_id"],
            order_value=order_value
        )
    
    # ── ROI Calculation ───────────────────────────────
    true_roi = await calculate_true_roi(
        seller_id=state["seller_id"],
        order_value=order_value,
        order_items=items,
        courier=recommended_courier,
        city=city,
        rto_score=rto_score,
        payment_method=payment
    )
    
    return {
        "rto_score":          rto_score,
        "rto_risk_level":     risk_level,
        "rto_signals":        rto_signals,
        "true_roi":           true_roi,
        "cod_confirmed":      cod_confirmed,
        "recommended_courier": recommended_courier,
    }
```

### Sub-Module 2: ROI Calculator

```python
# nodes/logistics/roi_calculator.py

async def calculate_true_roi(
    seller_id: str, order_value: float, order_items: list,
    courier: str, city: str, rto_score: float, payment_method: str
) -> float:
    """
    True ROI = (Delivered Sales - COGS - Ad Spend - Shipping - RTO Penalty)
               ÷ Total Investment × 100
    """
    db = get_db()
    
    # ── COGS (Cost of Goods Sold) ──────────────────────
    cogs = 0.0
    for item in order_items:
        cost = await db.fetch_val(
            "SELECT cost_price FROM inventory WHERE sku = :sku AND seller_id = :sid",
            {"sku": item.get("sku"), "sid": seller_id}
        )
        cogs += float(cost or 0) * item.get("quantity", 1)
    
    # ── Platform Commission ────────────────────────────
    platform     = "shopify"  # from state in real impl
    commission   = await get_platform_commission(seller_id, platform, order_items)
    
    # ── Shipping Cost ──────────────────────────────────
    total_weight = sum(i.get("weight_grams", 500) for i in order_items)
    shipping     = await get_courier_rate(courier, city, total_weight)
    
    # ── RTO Penalty (expected cost of return) ─────────
    # Agar RTO score 60 hai, matlab 60% chance return ka
    rto_probability = rto_score / 100
    return_shipping  = shipping  # return pe bhi courier charge
    rto_penalty      = rto_probability * (return_shipping + cogs * 0.1)  # 10% handling
    
    # ── Ad Spend Attribution ───────────────────────────
    seller_config  = await db.fetch_one(
        "SELECT avg_ad_cost_per_order FROM seller_config WHERE id = :sid",
        {"sid": seller_id}
    )
    ad_spend = float(seller_config.get("avg_ad_cost_per_order", 0) if seller_config else 0)
    
    # ── Overhead per Order ────────────────────────────
    overhead = await calculate_overhead_per_order(seller_id)
    
    # ── Packaging ─────────────────────────────────────
    packaging = await db.fetch_val(
        "SELECT packaging_cost_per_order FROM seller_config WHERE id = :sid",
        {"sid": seller_id}
    ) or 50.0  # default Rs 50
    
    # ── True ROI Formula ──────────────────────────────
    delivered_sales  = order_value * (1 - rto_probability)
    total_cost       = cogs + commission + shipping + rto_penalty + ad_spend + overhead + packaging
    total_investment = cogs + overhead + packaging  # what seller put in
    
    if total_investment == 0:
        return 0.0
    
    net_profit = delivered_sales - total_cost
    true_roi   = (net_profit / total_investment) * 100
    
    return round(true_roi, 2)
```

### Sub-Module 3: COD Confirmation (WhatsApp)

```python
# nodes/logistics/cod_confirmation.py
import asyncio

async def send_cod_confirmation_whatsapp(
    phone: str, order_id: str, order_value: float
) -> bool:
    """
    Medium-risk COD orders pe buyer ko WhatsApp message bhejo.
    Confirm kare toh proceed, warna HIGH RISK mark.
    30 minute wait — phir timeout.
    """
    whatsapp = WhatsAppBusinessAPI()
    
    await whatsapp.send_template_message(
        to=phone,
        template="cod_confirmation",
        params={
            "order_id":    order_id,
            "amount":      f"Rs {order_value:,.0f}",
            "confirm_url": f"https://tejarat.ai/confirm/{order_id}",
        },
        text=(
            f"Assalam o Alaikum! 👋\n\n"
            f"Aapka order #{order_id} confirm karne ke liye\n"
            f"COD Amount: Rs {order_value:,.0f}\n\n"
            f"Kya aap yeh order receive karein ge?\n"
            f"Reply: *HAAN* ya *NAHI*\n\n"
            f"(30 minute mein reply karein)"
        )
    )
    
    # 30 minute wait — Redis se confirmation check karo
    for _ in range(36):  # 36 × 50sec = 30 min
        await asyncio.sleep(50)
        
        confirmed = await redis_client.get(f"cod_confirm:{order_id}")
        if confirmed is not None:
            result = confirmed.decode() == "HAAN"
            
            # DB mein record karo — RTO model improve hoga
            await db.execute(
                "UPDATE orders SET cod_confirmed = :c WHERE order_id = :oid",
                {"c": result, "oid": order_id}
            )
            return result
    
    # Timeout — confirmed nahi kiya = HIGH RISK treat karo
    return False


async def handle_whatsapp_webhook(payload: dict):
    """
    WhatsApp se buyer ka reply aaye — Redis mein store karo.
    Logistics agent utha lega.
    """
    message = payload.get("entry", [{}])[0].get("changes", [{}])[0].get("value", {})
    
    if message.get("messages"):
        msg       = message["messages"][0]
        from_num  = msg["from"]
        text      = msg.get("text", {}).get("body", "").strip().upper()
        
        # Order ID Redis se phone se dhundo
        order_id = await redis_client.get(f"pending_confirm:{from_num}")
        
        if order_id and text in ["HAAN", "NAHI", "YES", "NO", "ہاں", "نہیں"]:
            confirmed = text in ["HAAN", "YES", "ہاں"]
            await redis_client.setex(
                f"cod_confirm:{order_id.decode()}",
                3600,
                "HAAN" if confirmed else "NAHI"
            )
```

### Best Courier Selection

```python
async def get_best_courier(city: str) -> str:
    """
    City ke hisaab se best courier select karo — lowest RTO rate wala.
    """
    rates = await db.fetch_all(
        """
        SELECT courier, return_rate_pct, avg_delivery_days
        FROM city_courier_rto_rate
        WHERE city = :city
        ORDER BY return_rate_pct ASC, avg_delivery_days ASC
        LIMIT 1
        """,
        {"city": city}
    )
    
    if rates:
        return rates[0]["courier"]
    
    # Fallback — Pakistan-wide defaults
    CITY_DEFAULTS = {
        "Karachi":   "tcs",
        "Lahore":    "leopards",
        "Islamabad": "tcs",
        "Peshawar":  "trax",
        "Quetta":    "postex",
    }
    return CITY_DEFAULTS.get(city, "leopards")
```

---

## 7. Agent D — Business Manager (Supervisor Node)

```python
# nodes/supervisor.py

async def supervisor_node(state: TijaratState) -> dict:
    """
    Teeno agents ki reports combine karo aur final decision lo.
    Business Health Score calculate karo.
    Priority actions generate karo.
    """
    # ── Business Health Score (0–100) ──────────────────
    bhs = calculate_business_health_score(state)
    
    # ── Priority Actions (exactly 3) ───────────────────
    actions = generate_priority_actions(state)[:3]
    
    # ── Final Urdu Report (Gemini) ─────────────────────
    report = await generate_urdu_report(state, bhs, actions)
    
    # ── WhatsApp Message ───────────────────────────────
    wa_msg = format_whatsapp_message(state, bhs, actions)
    
    return {
        "business_health_score": bhs,
        "priority_actions":      actions,
        "final_report_urdu":     report,
        "whatsapp_message":      wa_msg,
    }


def calculate_business_health_score(state: TijaratState) -> float:
    weights = {
        "sales_momentum":    0.25,
        "rto_control":       0.25,
        "margin_health":     0.20,
        "inventory_health":  0.15,
        "cash_flow":         0.15,
    }
    
    # Sales momentum (0-100)
    trend = state.get("sales_trends", {}).get("weekly_trend", 0)
    sales_score = min(100, max(0, 50 + trend))  # 0% trend = 50 score
    
    # RTO control (lower RTO = higher score)
    rto_score  = state.get("rto_score", 50)
    rto_health = max(0, 100 - rto_score)
    
    # Margin health
    roi = state.get("true_roi", 0)
    margin_health = min(100, max(0, roi * 2))  # 50% ROI = 100 score
    
    # Inventory health
    inv_health = state.get("inventory_health_score", 70)
    
    # Cash flow (TODO: integrate COD predictor output)
    cash_score = 70  # placeholder
    
    bhs = (
        sales_score  * weights["sales_momentum"] +
        rto_health   * weights["rto_control"] +
        margin_health * weights["margin_health"] +
        inv_health   * weights["inventory_health"] +
        cash_score   * weights["cash_flow"]
    )
    
    return round(bhs, 1)


def generate_priority_actions(state: TijaratState) -> list[str]:
    actions = []
    
    # RTO action
    rto = state.get("rto_score", 0)
    city = state.get("customer_city", "")
    if rto >= 61:
        actions.append(f"⚠️ {city} ke orders mein RTO zyada — advance payment ya confirmation lein")
    
    # Inventory action
    low_stock = state.get("low_stock_items", [])
    if low_stock:
        item = low_stock[0]
        actions.append(
            f"📦 '{item['name']}' — {item['days_remaining']:.0f} din mein khatam. "
            f"{item['reorder_qty']} units order karein"
        )
    
    # Dead stock action
    dead = state.get("dead_stock_items", [])
    if dead:
        total_value = sum(d["estimated_value"] for d in dead)
        actions.append(
            f"💸 Rs {total_value:,.0f} dead stock mein phansa — "
            f"{dead[0]['action_suggestion']}"
        )
    
    # Sales action
    anomalies = state.get("anomalies_detected", [])
    if anomalies:
        actions.append(f"📊 {anomalies[0]}")
    
    # ROI action
    roi = state.get("true_roi", 0)
    if roi < 10:
        actions.append("💰 Margin bahut kam hai — COGS ya shipping review karein")
    
    return actions
```

---

## 8. Platform Integrations

### Shopify Setup Guide

**Step 1: Shopify App Create karo (Custom App)**

```
Shopify Admin → Settings → Apps and sales channels → Develop apps
→ Create app → Tejarat AI
→ Scopes set karo:
  read_orders, read_products, write_inventory, read_customers,
  read_analytics, write_products
→ Access token generate karo
```

**Step 2: OAuth 2.0 Flow (Public App ke liye)**

```python
# gateway/src/shopify/oauth.controller.ts (NestJS)

@Get('/shopify/install')
async install(@Query('shop') shop: string, @Res() res: Response) {
  // CSRF protection — state parameter generate karo
  const state = crypto.randomBytes(16).toString('hex');
  
  // Redis mein store karo (10 min expiry)
  await this.redis.setex(`oauth_state:${state}`, 600, shop);
  
  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  authUrl.searchParams.set('client_id',    process.env.SHOPIFY_API_KEY);
  authUrl.searchParams.set('scope',        SHOPIFY_SCOPES);
  authUrl.searchParams.set('redirect_uri', `${APP_URL}/shopify/callback`);
  authUrl.searchParams.set('state',        state);  // CSRF token
  
  res.redirect(authUrl.toString());
}

@Get('/shopify/callback')
async callback(
  @Query('code')  code:  string,
  @Query('shop')  shop:  string,
  @Query('state') state: string,  // MUST validate
  @Res() res: Response
) {
  // ── CSRF State Validation ────────────────────────
  const savedShop = await this.redis.get(`oauth_state:${state}`);
  
  if (!savedShop || savedShop !== shop) {
    throw new ForbiddenException('Invalid state — CSRF attack possible');
  }
  
  await this.redis.del(`oauth_state:${state}`);
  
  // ── Exchange code for token ──────────────────────
  const { data } = await axios.post(`https://${shop}/admin/oauth/access_token`, {
    client_id:     process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code,
  });
  
  // ── Encrypt and store ────────────────────────────
  await this.tokenVault.store(sellerId, 'shopify', {
    shop_domain:  shop,
    access_token: data.access_token,  // AES-256 encrypted storage mein
  });
  
  // ── Register webhooks ────────────────────────────
  await this.shopifyService.registerWebhooks(shop, data.access_token);
  
  res.redirect(`${DASHBOARD_URL}/connected?platform=shopify`);
}
```

**Step 3: Webhook Handler**

```python
# gateway/src/webhooks/shopify.webhook.ts

@Post('/webhooks/shopify/orders/create')
async handleNewOrder(
  @Headers('x-shopify-hmac-sha256') hmac: string,
  @Headers('x-shopify-shop-domain') shop: string,
  @Body() rawBody: Buffer,
) {
  // ── Webhook signature verify ─────────────────────
  const computed = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(rawBody)
    .digest('base64');
  
  if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hmac))) {
    throw new UnauthorizedException('Invalid webhook signature');
  }
  
  const order = JSON.parse(rawBody.toString());
  const seller = await this.sellerService.findByShop(shop);
  
  // ── Trigger LangGraph workflow ───────────────────
  await this.aiCoreClient.triggerWorkflow({
    trigger_type:     'new_order',
    seller_id:        seller.id,
    order_id:         order.id.toString(),
    order_platform:   'shopify',
    customer_phone:   order.billing_address?.phone,
    customer_city:    order.shipping_address?.city,
    order_value:      parseFloat(order.total_price),
    order_items:      order.line_items,
    payment_method:   order.payment_gateway === 'cash_on_delivery' ? 'cod' : 'prepaid',
  });
}
```

### Daraz Integration

```python
# Daraz Partner Program ke liye apply karo — https://open.daraz.pk
# App Category: "Business Management Tools"
# Required: Business registration, NTN number

# Webhook setup (Daraz push model)
DARAZ_WEBHOOK_TOPICS = [
    "order.statusChange",       # Order status update
    "order.create",             # New order
    "product.stockChange",      # Inventory change
]

# Daraz API wrapper — rate limit aware
class DarazAPIManager:
    DAILY_LIMIT = 1000  # Basic plan
    
    async def call(self, endpoint: str, params: dict) -> dict:
        # Check daily quota
        used = await redis.get(f"daraz_calls:{date.today()}") or 0
        if int(used) >= self.DAILY_LIMIT - 50:  # 50 buffer
            raise DarazQuotaExceeded("Daily limit almost reached — using cache")
        
        # Increment counter
        await redis.incr(f"daraz_calls:{date.today()}")
        await redis.expire(f"daraz_calls:{date.today()}", 86400)
        
        # Make call
        return await self._make_signed_call(endpoint, params)
```

### WooCommerce Integration

```python
# WooCommerce: woocommerce/woocommerce-rest-api ka use karo
# Consumer Key + Secret generate karo: WooCommerce → Settings → REST API

class WooCommerceClient:
    def __init__(self, seller_id: str):
        creds = get_decrypted_token(seller_id, "woocommerce")
        from woocommerce import API
        self.wcapi = API(
            url=creds["store_url"],
            consumer_key=creds["consumer_key"],
            consumer_secret=creds["consumer_secret"],
            version="wc/v3",
            timeout=30,
        )
    
    async def get_orders(self, seller_id: str, days_back: int = 180) -> list:
        from datetime import datetime, timedelta
        after = (datetime.now() - timedelta(days=days_back)).isoformat()
        
        orders = []
        page = 1
        while True:
            response = self.wcapi.get(
                "orders",
                params={"after": after, "per_page": 100, "page": page}
            )
            batch = response.json()
            if not batch:
                break
            orders.extend(self._normalize(batch))
            page += 1
        
        return orders
```

---

## 9. Logistics Provider Integrations

### TCS (The Courier Service)

```python
# integrations/couriers/tcs.py
# TCS API v3: https://api.tcscourier.com/production/v3/

class TCSClient:
    BASE_URL = "https://api.tcscourier.com/production/v3"
    
    def __init__(self):
        self.api_key = get_env("TCS_API_KEY")
        self.headers = {"Authorization": f"Bearer {self.api_key}"}
    
    async def get_shipping_rate(self, origin_city: str, dest_city: str, weight_kg: float) -> float:
        """Per shipment rate nikaalo."""
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/rates",
                headers=self.headers,
                json={"from": origin_city, "to": dest_city, "weight": weight_kg, "service": "overnight"}
            )
            return r.json().get("total_charges", 0)
    
    async def create_shipment(self, order: dict) -> dict:
        """Shipment book karo — tracking number milega."""
        payload = {
            "sender_name":     order["seller_name"],
            "sender_phone":    order["seller_phone"],
            "sender_city":     order["seller_city"],
            "receiver_name":   order["customer_name"],
            "receiver_phone":  order["customer_phone"],
            "receiver_city":   order["customer_city"],
            "receiver_address": order["customer_address"],
            "cod_amount":      order["cod_amount"] if order["payment_method"] == "cod" else 0,
            "declared_value":  order["order_value"],
            "weight":          order["total_weight_kg"],
            "pieces":          len(order["items"]),
            "description":     ", ".join(i["name"] for i in order["items"]),
        }
        
        async with httpx.AsyncClient() as client:
            r = await client.post(f"{self.BASE_URL}/shipments", headers=self.headers, json=payload)
            data = r.json()
            return {
                "tracking_number": data.get("tracking_number"),
                "label_url":       data.get("label_url"),
                "estimated_delivery": data.get("estimated_delivery_date"),
            }
    
    async def track_shipment(self, tracking_number: str) -> dict:
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.BASE_URL}/track/{tracking_number}", headers=self.headers)
            data = r.json()
            return {
                "status":        self._normalize_status(data.get("status")),
                "location":      data.get("current_location"),
                "last_update":   data.get("last_update"),
                "attempt_count": data.get("delivery_attempts", 0),
            }
    
    def _normalize_status(self, tcs_status: str) -> str:
        STATUS_MAP = {
            "Shipment Created":       "created",
            "In Transit":             "in_transit",
            "Out for Delivery":       "out_for_delivery",
            "Delivered":              "delivered",
            "Delivery Attempted":     "attempted",
            "Return to Shipper":      "returned",
        }
        return STATUS_MAP.get(tcs_status, "unknown")
```

### Leopards Courier

```python
# integrations/couriers/leopards.py
# Leopards API v2: https://merchantapi.leopardscourier.com/api/

class LeopardsClient:
    BASE_URL = "https://merchantapi.leopardscourier.com/api"
    
    def __init__(self):
        self.api_key    = get_env("LEOPARDS_API_KEY")
        self.api_passwd = get_env("LEOPARDS_API_PASSWORD")
    
    def _get_params(self) -> dict:
        return {"api_key": self.api_key, "api_password": self.api_passwd}
    
    async def get_shipping_rate(self, dest_city: str, weight: float) -> float:
        params = {**self._get_params(), "destination_city_id": await self._get_city_id(dest_city), "weight": weight}
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.BASE_URL}/getShippingRates/format/json", params=params)
            return float(r.json().get("unit_price", 0))
    
    async def book_packet(self, order: dict) -> dict:
        params = {
            **self._get_params(),
            "booked_packet_consignee":        order["customer_name"],
            "booked_packet_consignee_address": order["customer_address"],
            "booked_packet_consignee_city":    await self._get_city_id(order["customer_city"]),
            "booked_packet_consignee_phone":   order["customer_phone"],
            "booked_packet_order_id":          order["order_id"],
            "booked_packet_weight":            order["weight_kg"],
            "booked_packet_vol_weight_w":      10,
            "booked_packet_vol_weight_h":      10,
            "booked_packet_vol_weight_d":      10,
            "booked_packet_collect_amount":    order["cod_amount"],
            "booked_packet_order_type_cod":    1 if order["payment_method"] == "cod" else 0,
        }
        
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{self.BASE_URL}/bookPacket/format/json", params=params)
            data = r.json()
            if data.get("status") == 1:
                return {"tracking_number": data["track_number"], "slip_url": data.get("slip_link")}
            raise Exception(f"Leopards booking failed: {data.get('error')}")
```

### PostEx

```python
# integrations/couriers/postex.py
# PostEx REST API: https://api.postex.pk

class PostExClient:
    BASE_URL = "https://api.postex.pk/services/integration/api"
    
    def __init__(self):
        self.token = get_env("POSTEX_TOKEN")
        self.headers = {
            "token": self.token,
            "Content-Type": "application/json"
        }
    
    async def create_order(self, order: dict) -> dict:
        payload = {
            "orderRefNumber": order["order_id"],
            "orderType":      "Normal",
            "paymentType":    "COD" if order["payment_method"] == "cod" else "Prepaid",
            "orderAmount":    str(order["cod_amount"]),
            "customerName":   order["customer_name"],
            "customerPhone":  order["customer_phone"],
            "deliveryAddress": order["customer_address"],
            "cityName":       order["customer_city"],
            "itemName":       ", ".join(i["name"] for i in order["items"]),
        }
        
        async with httpx.AsyncClient() as client:
            r = await client.post(f"{self.BASE_URL}/order/create", headers=self.headers, json=payload)
            data = r.json()
            if data.get("statusCode") == "200":
                return {
                    "tracking_number": data["dist"]["trackingNumber"],
                    "status": "booked"
                }
            raise Exception(f"PostEx error: {data.get('statusMessage')}")
```

### Trax

```python
# integrations/couriers/trax.py
# Trax API: https://traxlogistics.com.pk — Webhook-based model

class TraxClient:
    BASE_URL = "https://sonic.pk/api"  # Trax/Sonic
    
    def __init__(self):
        self.api_key  = get_env("TRAX_API_KEY")
        self.username = get_env("TRAX_USERNAME")
    
    async def create_shipment(self, order: dict) -> dict:
        payload = {
            "service_type_id": 2,  # COD=2, Prepaid=1
            "order_id":        order["order_id"],
            "consignment": {
                "name":    order["customer_name"],
                "phone":   order["customer_phone"],
                "address": order["customer_address"],
                "city":    order["customer_city"],
            },
            "cod_amount": order["cod_amount"],
            "items":      [{"description": i["name"], "qty": i["quantity"]} for i in order["items"]],
        }
        
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/orders",
                auth=(self.username, self.api_key),
                json=payload
            )
            return {"tracking_number": r.json().get("tracking_number")}
```

### BlueEx

```python
# integrations/couriers/blueex.py
# BlueEx: SOAP-based API — XML wrapper needed

class BlueExClient:
    """
    BlueEx uses legacy SOAP API.
    Python 'zeep' library se handle karo.
    """
    WSDL_URL = "https://blueex.com.pk/WebService/BlueExService.svc?wsdl"
    
    def __init__(self):
        from zeep import Client
        self.client   = Client(self.WSDL_URL)
        self.username = get_env("BLUEEX_USERNAME")
        self.password = get_env("BLUEEX_PASSWORD")
    
    async def create_shipment(self, order: dict) -> dict:
        # Sync zeep call ko async mein wrap karo
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: self.client.service.CreateShipment(
                UserName=self.username,
                Password=self.password,
                OrderRef=order["order_id"],
                ConsigneeName=order["customer_name"],
                ConsigneePhone=order["customer_phone"],
                ConsigneeAddress=order["customer_address"],
                ConsigneeCity=order["customer_city"],
                CODAmount=str(order["cod_amount"]),
                Weight=str(order["weight_kg"]),
            )
        )
        return {"tracking_number": result.get("TrackingNumber")}
```

### Unified Courier Router

```python
# integrations/couriers/router.py

COURIER_CLIENTS = {
    "tcs":      TCSClient,
    "leopards": LeopardsClient,
    "postex":   PostExClient,
    "trax":     TraxClient,
    "blueex":   BlueExClient,
}

async def book_with_recommended_courier(order: dict, seller_id: str) -> dict:
    """
    Best courier select karo aur book karo.
    Failure pe fallback courier try karo.
    """
    primary   = await get_best_courier(order["customer_city"])
    fallbacks = [c for c in COURIER_CLIENTS.keys() if c != primary]
    
    for courier_name in [primary] + fallbacks[:2]:
        try:
            client = COURIER_CLIENTS[courier_name]()
            result = await client.create_shipment(order)
            
            # DB mein record karo
            await db.execute(
                "INSERT INTO shipments (order_id, courier, tracking_number, seller_id) VALUES (:oid, :c, :tn, :sid)",
                {"oid": order["order_id"], "c": courier_name, "tn": result["tracking_number"], "sid": seller_id}
            )
            
            return {**result, "courier": courier_name}
        
        except Exception as e:
            logger.error(f"Courier {courier_name} booking failed: {e}")
            continue
    
    raise Exception("All couriers failed — manual booking required")
```

---

## 10. Security Framework

### 10.1 OAuth 2.0 State Validation (CSRF Protection)

Ooper Section 8 mein implement kiya gaya hai. Key points:

```python
# CSRF protection checklist:
# ✅ State parameter generate karo (crypto.randomBytes)
# ✅ Redis mein store karo (10 min expiry)
# ✅ Callback mein verify karo (timing-safe comparison)
# ✅ State use hone ke baad delete karo (replay attack prevention)
# ✅ shop parameter bhi state ke saath store karo (shop mismatch detect karo)
```

### 10.2 Token Vault (AES-256 Fernet)

```python
# security/vault.py
from cryptography.fernet import Fernet
import os, base64
from hashlib import sha256

class TokenVault:
    """
    Platform tokens ko AES-256 (Fernet) se encrypt karke store karo.
    Plain text mein KABHI NAHI.
    """
    def __init__(self):
        # Master key environment variable se (Kubernetes Secret / AWS Secrets Manager)
        master_key = os.environ["VAULT_MASTER_KEY"].encode()
        # Fernet needs 32-byte URL-safe base64 key
        derived    = base64.urlsafe_b64encode(sha256(master_key).digest())
        self.fernet = Fernet(derived)
    
    async def store(self, seller_id: str, platform: str, credentials: dict):
        """Encrypt karke PostgreSQL mein store karo."""
        import json
        
        plaintext  = json.dumps(credentials).encode()
        ciphertext = self.fernet.encrypt(plaintext)
        
        await db.execute(
            """
            INSERT INTO platform_tokens (seller_id, platform, encrypted_token, created_at)
            VALUES (:sid, :platform, :token, NOW())
            ON CONFLICT (seller_id, platform) DO UPDATE SET
                encrypted_token = :token, updated_at = NOW()
            """,
            {"sid": seller_id, "platform": platform, "token": ciphertext.decode()}
        )
    
    async def retrieve(self, seller_id: str, platform: str) -> dict:
        """Decrypt karke return karo."""
        import json
        
        row = await db.fetch_one(
            "SELECT encrypted_token FROM platform_tokens WHERE seller_id = :sid AND platform = :p",
            {"sid": seller_id, "p": platform}
        )
        
        if not row:
            raise CredentialsNotFound(f"No {platform} credentials for seller {seller_id}")
        
        plaintext = self.fernet.decrypt(row["encrypted_token"].encode())
        return json.loads(plaintext)
    
    async def rotate_key(self, new_master_key: str):
        """
        Key rotation — sab tokens re-encrypt karo naye key se.
        Quarterly rotation recommended.
        """
        all_tokens = await db.fetch_all("SELECT seller_id, platform, encrypted_token FROM platform_tokens")
        
        new_fernet = Fernet(base64.urlsafe_b64encode(sha256(new_master_key.encode()).digest()))
        
        for row in all_tokens:
            # Decrypt old
            plaintext = self.fernet.decrypt(row["encrypted_token"].encode())
            # Re-encrypt with new key
            new_cipher = new_fernet.encrypt(plaintext)
            await db.execute(
                "UPDATE platform_tokens SET encrypted_token = :t WHERE seller_id = :sid AND platform = :p",
                {"t": new_cipher.decode(), "sid": row["seller_id"], "p": row["platform"]}
            )
        
        self.fernet = new_fernet

# Singleton
token_vault = TokenVault()

def get_decrypted_token(seller_id: str, platform: str) -> dict:
    import asyncio
    return asyncio.run(token_vault.retrieve(seller_id, platform))
```

### 10.3 JWT with Short Expiry + Rotation

```python
# security/jwt_handler.py
import jwt
from cryptography.hazmat.primitives import serialization
from datetime import datetime, timedelta
import uuid

# RS256 — private key sign karta hai, public key verify karta hai
# Key pair generate karo: openssl genrsa -out private.pem 2048

class JWTHandler:
    ACCESS_EXPIRY  = timedelta(minutes=15)   # Short expiry
    REFRESH_EXPIRY = timedelta(days=7)
    
    def __init__(self):
        with open(os.environ["JWT_PRIVATE_KEY_PATH"], "rb") as f:
            self.private_key = serialization.load_pem_private_key(f.read(), password=None)
        with open(os.environ["JWT_PUBLIC_KEY_PATH"], "rb") as f:
            self.public_key = serialization.load_pem_public_key(f.read())
    
    def create_access_token(self, seller_id: str) -> str:
        return jwt.encode({
            "sub":  seller_id,
            "type": "access",
            "jti":  str(uuid.uuid4()),  # JWT ID — revocation ke liye
            "iat":  datetime.utcnow(),
            "exp":  datetime.utcnow() + self.ACCESS_EXPIRY,
        }, self.private_key, algorithm="RS256")
    
    def create_refresh_token(self, seller_id: str) -> str:
        token = jwt.encode({
            "sub":  seller_id,
            "type": "refresh",
            "jti":  str(uuid.uuid4()),
            "iat":  datetime.utcnow(),
            "exp":  datetime.utcnow() + self.REFRESH_EXPIRY,
        }, self.private_key, algorithm="RS256")
        
        # DB mein store karo revocation ke liye
        asyncio.create_task(store_refresh_token(seller_id, token))
        return token
    
    def verify_token(self, token: str, token_type: str = "access") -> dict:
        try:
            payload = jwt.decode(token, self.public_key, algorithms=["RS256"])
            
            if payload.get("type") != token_type:
                raise jwt.InvalidTokenError("Wrong token type")
            
            # Revocation check
            if asyncio.run(is_token_revoked(payload["jti"])):
                raise jwt.InvalidTokenError("Token revoked")
            
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    
    def rotate_refresh_token(self, old_refresh_token: str) -> tuple[str, str]:
        """Old refresh token invalidate karo, naya issue karo."""
        payload = self.verify_token(old_refresh_token, "refresh")
        
        # Old token revoke karo
        asyncio.run(revoke_token(payload["jti"]))
        
        # New tokens issue karo
        new_access  = self.create_access_token(payload["sub"])
        new_refresh = self.create_refresh_token(payload["sub"])
        
        return new_access, new_refresh
```

### 10.4 Redis Rate Limiting

```python
# security/rate_limiter.py

async def check_rate_limit(
    user_id: str,
    endpoint: str,
    max_requests: int,
    window_seconds: int
) -> bool:
    """
    Sliding window rate limiter using Redis.
    Returns True if allowed, False if rate limited.
    """
    key    = f"rate_limit:{user_id}:{endpoint}"
    now    = time.time()
    window = now - window_seconds
    
    pipe = redis_client.pipeline()
    
    # Remove old requests outside window
    pipe.zremrangebyscore(key, 0, window)
    
    # Count current window requests
    pipe.zcard(key)
    
    # Add current request
    pipe.zadd(key, {str(uuid.uuid4()): now})
    
    # Set expiry
    pipe.expire(key, window_seconds + 1)
    
    _, current_count, *_ = await pipe.execute()
    
    if current_count >= max_requests:
        # Log for abuse detection
        logger.warning(f"Rate limit exceeded: {user_id} on {endpoint}")
        return False
    
    return True


# Middleware (FastAPI)
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitMiddleware(BaseHTTPMiddleware):
    LIMITS = {
        "/api/v1/orders":     (100, 60),   # 100 req/min
        "/api/v1/analytics":  (30,  60),   # 30 req/min
        "/api/v1/ai/":        (20,  60),   # 20 AI calls/min
        "default":            (200, 60),   # Default
    }
    
    async def dispatch(self, request: Request, call_next):
        user_id  = request.state.seller_id if hasattr(request.state, "seller_id") else request.client.host
        endpoint = request.url.path
        
        # Match limit
        limit, window = next(
            (v for k, v in self.LIMITS.items() if endpoint.startswith(k)),
            self.LIMITS["default"]
        )
        
        if not await check_rate_limit(user_id, endpoint, limit, window):
            raise HTTPException(status_code=429, detail={
                "error":       "rate_limit_exceeded",
                "retry_after": window,
                "message":     f"Zyada requests — {window} second mein try karein"
            })
        
        return await call_next(request)
```

### 10.5 Password Hashing (bcrypt via passlib)

```python
# security/passwords.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

---

## 11. Docker Compose Infrastructure

```yaml
# docker-compose.yml

version: '3.9'

networks:
  tijarat_net:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  minio_data:

services:

  # ── 1. API Gateway (NestJS) ────────────────────────────
  tijarat-gateway:
    build:
      context: ./services/gateway
      dockerfile: Dockerfile
    image: tijarat-gateway:latest
    container_name: tijarat-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://tijarat:${DB_PASSWORD}@tijarat-db:5432/tijarat
      - REDIS_URL=redis://tijarat-cache:6379
      - JWT_PRIVATE_KEY_PATH=/run/secrets/jwt_private
      - SHOPIFY_API_KEY=${SHOPIFY_API_KEY}
      - SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}
      - DARAZ_APP_KEY=${DARAZ_APP_KEY}
      - DARAZ_APP_SECRET=${DARAZ_APP_SECRET}
      - VAULT_MASTER_KEY=${VAULT_MASTER_KEY}
      - AI_CORE_URL=http://tijarat-ai-core:8000
      - APP_URL=${APP_URL}
    depends_on:
      tijarat-db:    { condition: service_healthy }
      tijarat-cache: { condition: service_healthy }
    secrets:
      - jwt_private
      - jwt_public
    networks:
      - tijarat_net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # ── 2. AI Core (FastAPI + LangGraph) ──────────────────
  tijarat-ai-core:
    build:
      context: ./services/ai_core
      dockerfile: Dockerfile
    image: tijarat-ai-core:latest
    container_name: tijarat-ai-core
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://tijarat:${DB_PASSWORD}@tijarat-db:5432/tijarat
      - REDIS_URL=redis://tijarat-cache:6379
      - GOOGLE_API_KEY=${GEMINI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - VAULT_MASTER_KEY=${VAULT_MASTER_KEY}
      - TCS_API_KEY=${TCS_API_KEY}
      - LEOPARDS_API_KEY=${LEOPARDS_API_KEY}
      - LEOPARDS_API_PASSWORD=${LEOPARDS_API_PASSWORD}
      - POSTEX_TOKEN=${POSTEX_TOKEN}
      - TRAX_API_KEY=${TRAX_API_KEY}
      - BLUEEX_USERNAME=${BLUEEX_USERNAME}
      - BLUEEX_PASSWORD=${BLUEEX_PASSWORD}
      - WHATSAPP_TOKEN=${WHATSAPP_TOKEN}
      - WHATSAPP_PHONE_ID=${WHATSAPP_PHONE_ID}
      - CELERY_BROKER=redis://tijarat-cache:6379/1
      - MINIO_URL=http://tijarat-minio:9000
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    depends_on:
      tijarat-db:    { condition: service_healthy }
      tijarat-cache: { condition: service_healthy }
    networks:
      - tijarat_net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # ── 3. Database (PostgreSQL + TimescaleDB) ─────────────
  tijarat-db:
    image: timescale/timescaledb:latest-pg15
    container_name: tijarat-db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=tijarat
      - POSTGRES_USER=tijarat
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - tijarat_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tijarat -d tijarat"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ── 4. Cache (Redis 7) ──────────────────────────────────
  tijarat-cache:
    image: redis:7-alpine
    container_name: tijarat-cache
    ports:
      - "6379:6379"
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
      --save 60 1000
      --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - tijarat_net
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ── 5. Background Worker (Celery) ──────────────────────
  tijarat-worker:
    build:
      context: ./services/ai_core
      dockerfile: Dockerfile
    image: tijarat-ai-core:latest
    container_name: tijarat-worker
    command: >
      celery -A core.celery_app worker
      --loglevel=info
      --concurrency=4
      --queues=default,analytics,reports,notifications
    environment:
      - DATABASE_URL=postgresql+asyncpg://tijarat:${DB_PASSWORD}@tijarat-db:5432/tijarat
      - REDIS_URL=redis://tijarat-cache:6379
      - CELERY_BROKER=redis://tijarat-cache:6379/1
      - CELERY_RESULT_BACKEND=redis://tijarat-cache:6379/2
    depends_on:
      - tijarat-db
      - tijarat-cache
    networks:
      - tijarat_net
    restart: unless-stopped

  # ── 6. Celery Beat (Scheduler) ─────────────────────────
  tijarat-scheduler:
    build:
      context: ./services/ai_core
      dockerfile: Dockerfile
    image: tijarat-ai-core:latest
    container_name: tijarat-scheduler
    command: >
      celery -A core.celery_app beat
      --loglevel=info
      --scheduler django_celery_beat.schedulers:DatabaseScheduler
    environment:
      - DATABASE_URL=postgresql+asyncpg://tijarat:${DB_PASSWORD}@tijarat-db:5432/tijarat
      - CELERY_BROKER=redis://tijarat-cache:6379/1
    depends_on:
      - tijarat-db
      - tijarat-cache
    networks:
      - tijarat_net
    restart: unless-stopped

  # ── 7. Dashboard (Next.js) ──────────────────────────────
  tijarat-dashboard:
    build:
      context: ./services/dashboard
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=${APP_URL}/api
        - NEXT_PUBLIC_WS_URL=${WS_URL}
    image: tijarat-dashboard:latest
    container_name: tijarat-dashboard
    ports:
      - "80:3000"
    environment:
      - NEXTAUTH_URL=${APP_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - API_URL=http://tijarat-gateway:3000
    depends_on:
      - tijarat-gateway
    networks:
      - tijarat_net
    restart: unless-stopped

  # ── 8. File Storage (MinIO) ─────────────────────────────
  tijarat-minio:
    image: minio/minio:latest
    container_name: tijarat-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    networks:
      - tijarat_net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3
    restart: unless-stopped

  # ── 9. Nginx Reverse Proxy ──────────────────────────────
  tijarat-proxy:
    image: nginx:alpine
    container_name: tijarat-proxy
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - tijarat-gateway
      - tijarat-dashboard
    networks:
      - tijarat_net
    restart: unless-stopped

# Docker Secrets (production mein use karo)
secrets:
  jwt_private:
    file: ./secrets/jwt_private.pem
  jwt_public:
    file: ./secrets/jwt_public.pem
```

### Scheduled Jobs (Celery Beat)

```python
# core/celery_schedule.py

CELERYBEAT_SCHEDULE = {
    # Daily analysis — raat 2 baje (jab traffic low ho)
    "daily-sales-analysis": {
        "task":     "tasks.run_daily_analysis",
        "schedule": crontab(hour=2, minute=0),
        "options":  {"queue": "analytics"},
    },
    
    # Inventory reorder check — har 6 ghante
    "inventory-reorder-check": {
        "task":     "tasks.check_reorder_points",
        "schedule": crontab(minute=0, hour="*/6"),
        "options":  {"queue": "default"},
    },
    
    # Shipment status sync — har 30 minute
    "shipment-status-sync": {
        "task":     "tasks.sync_shipment_statuses",
        "schedule": crontab(minute="*/30"),
        "options":  {"queue": "default"},
    },
    
    # WhatsApp daily digest — raat 9 baje
    "whatsapp-daily-digest": {
        "task":     "tasks.send_daily_whatsapp_digest",
        "schedule": crontab(hour=21, minute=0),
        "options":  {"queue": "notifications"},
    },
    
    # COD confirmation timeout check — har 5 minute
    "cod-confirmation-timeout": {
        "task":     "tasks.handle_cod_timeouts",
        "schedule": crontab(minute="*/5"),
        "options":  {"queue": "default"},
    },
    
    # Materialized view refresh — weekly Sunday 3am
    "refresh-rto-matrix": {
        "task":     "tasks.refresh_rto_materialized_view",
        "schedule": crontab(hour=3, minute=0, day_of_week=0),
        "options":  {"queue": "analytics"},
    },
    
    # RTO model retrain — weekly Monday 4am
    "rto-model-retrain": {
        "task":     "tasks.retrain_rto_model",
        "schedule": crontab(hour=4, minute=0, day_of_week=1),
        "options":  {"queue": "analytics"},
    },
    
    # Monthly PDF reports — 1st of month, 8am
    "monthly-pdf-reports": {
        "task":     "tasks.generate_monthly_reports",
        "schedule": crontab(hour=8, minute=0, day_of_month=1),
        "options":  {"queue": "reports"},
    },
}
```

---

## 12. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml

name: Tejarat AI — CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY:    ghcr.io
  IMAGE_NAME:  ${{ github.repository }}

jobs:

  # ── 1. Code Quality ─────────────────────────────────────
  lint-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: timescale/timescaledb:latest-pg15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: tijarat_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
    
    steps:
      - uses: actions/checkout@v4
      
      # Python backend
      - name: Setup Python
        uses: actions/setup-python@v4
        with: { python-version: '3.11' }
      
      - name: Install Python dependencies
        run: |
          cd services/ai_core
          pip install -r requirements.txt
          pip install pytest pytest-asyncio httpx
      
      - name: Run Python linter (ruff)
        run: |
          pip install ruff
          ruff check services/ai_core/
      
      - name: Run Python tests
        run: |
          cd services/ai_core
          pytest tests/ -v --asyncio-mode=auto
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:testpass@localhost:5432/tijarat_test
          REDIS_URL:    redis://localhost:6379
          TESTING:      "true"
      
      # Node.js gateway
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with: { node-version: '20' }
      
      - name: Install Node dependencies
        run: |
          cd services/gateway
          npm ci
      
      - name: Run ESLint
        run: |
          cd services/gateway
          npm run lint
      
      - name: Run Jest tests
        run: |
          cd services/gateway
          npm test
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/tijarat_test
          REDIS_URL:    redis://localhost:6379
      
      # Security scan
      - name: Run Bandit (Python security)
        run: |
          pip install bandit
          bandit -r services/ai_core/ -ll
      
      - name: Run npm audit
        run: |
          cd services/gateway
          npm audit --audit-level=high

  # ── 2. Build Docker Images ──────────────────────────────
  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    
    strategy:
      matrix:
        service: [gateway, ai_core, dashboard]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push ${{ matrix.service }}
        uses: docker/build-push-action@v5
        with:
          context:   ./services/${{ matrix.service }}
          push:      true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-${{ matrix.service }}:${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-${{ matrix.service }}:latest
          cache-from: type=gha
          cache-to:   type=gha,mode=max

  # ── 3. Database Migrations ──────────────────────────────
  migrate:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Alembic migrations
        run: |
          pip install alembic asyncpg
          cd services/ai_core
          alembic upgrade head
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}

  # ── 4. Deploy to Production ─────────────────────────────
  deploy:
    needs: [build, migrate]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host:     ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key:      ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/tijarat
            
            # Pull latest images
            docker pull ghcr.io/${{ github.repository }}-gateway:latest
            docker pull ghcr.io/${{ github.repository }}-ai_core:latest
            docker pull ghcr.io/${{ github.repository }}-dashboard:latest
            
            # Rolling update — zero downtime
            docker compose up -d --no-deps --scale tijarat-gateway=2 tijarat-gateway
            sleep 15
            docker compose up -d --no-deps tijarat-ai-core
            docker compose up -d --no-deps tijarat-worker
            docker compose up -d --no-deps tijarat-dashboard
            
            # Health check
            sleep 30
            curl -f http://localhost:3000/health || (docker compose logs tijarat-gateway && exit 1)
            
            # Clean old images
            docker image prune -f
      
      - name: Notify Slack (deployment success)
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Tejarat AI deployed to production — SHA: ${{ github.sha }}"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
        if: always()

  # ── 5. Staging Deploy ───────────────────────────────────
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Deploy to staging
        uses: appleboy/ssh-action@v1
        with:
          host:     ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key:      ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/tijarat-staging
            docker compose pull
            docker compose up -d
```

### Alembic Migration Setup

```python
# services/ai_core/alembic/env.py

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from core.models import Base
import asyncio

def run_migrations_online():
    engine = create_async_engine(os.environ["DATABASE_URL"])
    
    async def do_run():
        async with engine.connect() as conn:
            await conn.run_sync(
                context.configure,
                connection=conn,
                target_metadata=Base.metadata,
                compare_type=True,
            )
            async with context.begin_transaction():
                await context.run_migrations()
    
    asyncio.run(do_run())

run_migrations_online()
```

---

## 13. Database Schema Design

```sql
-- init-scripts/init.sql
-- TimescaleDB extension enable karo
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Sellers ────────────────────────────────────────────
CREATE TABLE sellers (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(200) NOT NULL,
    phone         VARCHAR(20) UNIQUE NOT NULL,
    email         VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    plan          VARCHAR(20) DEFAULT 'free',   -- free | pro | enterprise
    language_pref VARCHAR(10) DEFAULT 'roman_urdu',  -- roman_urdu | nastaleeq | english
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Platform Tokens (Encrypted) ────────────────────────
CREATE TABLE platform_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    platform        VARCHAR(20) NOT NULL,   -- shopify | daraz | woocommerce
    encrypted_token TEXT NOT NULL,           -- AES-256 Fernet encrypted JSON
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, platform)
);

-- ── Seller Config ───────────────────────────────────────
CREATE TABLE seller_config (
    seller_id              UUID PRIMARY KEY REFERENCES sellers(id),
    packaging_cost_per_order  DECIMAL(10,2) DEFAULT 50.00,
    avg_ad_cost_per_order     DECIMAL(10,2) DEFAULT 0.00,
    monthly_rent              DECIMAL(10,2) DEFAULT 0.00,
    team_cost_daily           DECIMAL(10,2) DEFAULT 0.00,
    electricity_monthly       DECIMAL(10,2) DEFAULT 0.00,
    default_courier           VARCHAR(20) DEFAULT 'auto',
    whatsapp_notifications    BOOLEAN DEFAULT TRUE,
    share_rto_data            BOOLEAN DEFAULT FALSE,   -- opt-in for community RTO DB
    seller_city               VARCHAR(100),
    updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ── Orders ─────────────────────────────────────────────
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES sellers(id),
    platform_order_id VARCHAR(100) NOT NULL,
    platform        VARCHAR(20) NOT NULL,
    order_value     DECIMAL(12,2) NOT NULL,
    customer_phone  VARCHAR(20),
    customer_city   VARCHAR(100),
    customer_address TEXT,
    payment_method  VARCHAR(20),   -- cod | prepaid
    status          VARCHAR(30),
    cod_confirmed   BOOLEAN,
    rto_score       SMALLINT,
    true_roi        DECIMAL(8,2),
    courier_used    VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, platform, platform_order_id)
);
-- TimescaleDB hypertable (time-series queries ke liye)
SELECT create_hypertable('orders', 'created_at');

-- ── Order Items ─────────────────────────────────────────
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku         VARCHAR(100),
    product_name VARCHAR(300),
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2),
    cost_price  DECIMAL(10,2)
);

-- ── Inventory ───────────────────────────────────────────
CREATE TABLE inventory (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id           UUID NOT NULL REFERENCES sellers(id),
    sku                 VARCHAR(100) NOT NULL,
    product_name        VARCHAR(300) NOT NULL,
    quantity            INTEGER NOT NULL DEFAULT 0,
    cost_price          DECIMAL(10,2),
    selling_price       DECIMAL(10,2),
    lead_time_days      INTEGER DEFAULT 7,
    max_lead_time_days  INTEGER DEFAULT 10,
    reorder_point       DECIMAL(8,2),
    supplier_name       VARCHAR(200),
    supplier_phone      VARCHAR(20),
    shopify_variant_id  VARCHAR(100),
    daraz_seller_sku    VARCHAR(100),
    weight_grams        INTEGER DEFAULT 500,
    last_restocked_at   TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, sku)
);

-- ── RTO History (National COD Database) ─────────────────
CREATE TABLE rto_history (
    id              BIGSERIAL PRIMARY KEY,
    phone_number    VARCHAR(20) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    courier         VARCHAR(30),
    order_delivered BOOLEAN DEFAULT FALSE,
    order_returned  BOOLEAN DEFAULT FALSE,
    return_reason   VARCHAR(100),
    seller_id       UUID REFERENCES sellers(id),  -- NULL = community
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_rto_phone  ON rto_history(phone_number);
CREATE INDEX idx_rto_city   ON rto_history(city, courier);
CREATE INDEX idx_rto_seller ON rto_history(seller_id);
SELECT create_hypertable('rto_history', 'created_at');

-- ── Shipments ───────────────────────────────────────────
CREATE TABLE shipments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id         UUID NOT NULL REFERENCES orders(id),
    seller_id        UUID NOT NULL REFERENCES sellers(id),
    courier          VARCHAR(30) NOT NULL,
    tracking_number  VARCHAR(100) UNIQUE NOT NULL,
    status           VARCHAR(30) DEFAULT 'created',
    attempt_count    SMALLINT DEFAULT 0,
    shipped_at       TIMESTAMPTZ,
    delivered_at     TIMESTAMPTZ,
    returned_at      TIMESTAMPTZ,
    cod_amount       DECIMAL(10,2),
    cod_remitted     BOOLEAN DEFAULT FALSE,
    cod_remitted_at  TIMESTAMPTZ,
    expected_remittance_date TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);
SELECT create_hypertable('shipments', 'created_at');

-- ── Platform Tokens rotation log ────────────────────────
CREATE TABLE token_rotation_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id   UUID REFERENCES sellers(id),
    platform    VARCHAR(20),
    rotated_at  TIMESTAMPTZ DEFAULT NOW(),
    rotated_by  VARCHAR(50)  -- "scheduled" | "manual" | "security_alert"
);

-- ── Refresh Tokens ──────────────────────────────────────
CREATE TABLE refresh_tokens (
    jti         UUID PRIMARY KEY,
    seller_id   UUID NOT NULL REFERENCES sellers(id),
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_rt_seller ON refresh_tokens(seller_id);
```

---

## 14. WhatsApp Notification System

```python
# notifications/whatsapp.py

class WhatsAppBusinessAPI:
    BASE_URL = "https://graph.facebook.com/v18.0"
    
    def __init__(self):
        self.token    = os.environ["WHATSAPP_TOKEN"]
        self.phone_id = os.environ["WHATSAPP_PHONE_ID"]
    
    async def send_text(self, to: str, text: str):
        """Simple text message."""
        await self._call("messages", {
            "messaging_product": "whatsapp",
            "to":   to,
            "type": "text",
            "text": {"body": text}
        })
    
    async def send_daily_digest(self, seller: dict, state: TijaratState):
        """Raat 9 baje ka daily digest."""
        bhs     = state.get("business_health_score", 0)
        actions = state.get("priority_actions", [])
        
        # Health score emoji
        if bhs >= 70:   emoji = "✅"
        elif bhs >= 40: emoji = "⚠️"
        else:           emoji = "🔴"
        
        message = (
            f"*Tejarat AI — Aaj Ka Report* 📊\n"
            f"{'─' * 25}\n"
            f"{emoji} Business Health: *{bhs}/100*\n\n"
            f"📌 *Aaj Ki 3 Priority Actions:*\n"
        )
        
        for i, action in enumerate(actions[:3], 1):
            message += f"{i}. {action}\n"
        
        message += f"\n{state.get('sales_insights_urdu', '')}\n"
        message += f"\n💬 Detail ke liye: {os.environ['APP_URL']}/dashboard"
        
        await self.send_text(seller["phone"], message)
    
    async def send_rto_alert(self, seller_phone: str, order_id: str, rto_score: int, city: str):
        """High RTO order alert."""
        message = (
            f"⚠️ *HIGH RISK ORDER #{order_id}*\n\n"
            f"🎯 RTO Score: *{rto_score}/100*\n"
            f"📍 City: {city}\n\n"
            f"*Actions:*\n"
            f"• APPROVE — Ship karo\n"
            f"• ADVANCE — Rs200 advance maango\n"
            f"• REJECT — Order cancel karo\n\n"
            f"Reply: APPROVE / ADVANCE / REJECT\n"
            f"_(30 minute mein respond karein)_"
        )
        await self.send_text(seller_phone, message)
    
    async def send_reorder_alert(self, seller_phone: str, items: list):
        """Low stock reorder alert."""
        message = "📦 *Stock Alert — Reorder Needed*\n\n"
        for item in items[:5]:
            message += (
                f"• *{item['name']}*\n"
                f"  Stock: {item['current_stock']} units\n"
                f"  {item['days_remaining']:.0f} din mein khatam\n\n"
            )
        message += f"Dashboard: {os.environ['APP_URL']}/inventory"
        await self.send_text(seller_phone, message)
    
    async def _call(self, endpoint: str, payload: dict):
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/{self.phone_id}/{endpoint}",
                headers={"Authorization": f"Bearer {self.token}"},
                json=payload,
                timeout=10
            )
            r.raise_for_status()
            return r.json()
```

---

## 15. Missing Pieces — Added to Plan

Yeh cheezein original plan mein nahi thin — zaroori hain:

### 15.1 Seller Onboarding Flow ⭐ CRITICAL

Bina proper onboarding ke koi seller connect nahi kar payega.

```
Step 1: Account banao (phone + OTP)
Step 2: Business info (store name, city, category)
Step 3: Platform connect (Shopify / Daraz / WooCommerce — guided wizard)
Step 4: Courier connect (TCS / Leopards / PostEx — API keys guide)
Step 5: Cost profile setup (packaging, team, rent — defaults diye gaye hain)
Step 6: First analysis run (10 min — "Hum aapka data analyze kar rahe hain...")
Total time: 15-20 minutes max
```

### 15.2 Cold Start Solution

Naye seller ke paas historical data nahi hota. Kya karein?

```python
PAKISTAN_CATEGORY_RTO_BENCHMARKS = {
    "clothing":    {"avg_rto": 28, "avg_margin": 35},
    "electronics": {"avg_rto": 22, "avg_margin": 15},
    "cosmetics":   {"avg_rto": 25, "avg_margin": 45},
    "home_decor":  {"avg_rto": 30, "avg_margin": 40},
    "food":        {"avg_rto": 15, "avg_margin": 25},
    "default":     {"avg_rto": 27, "avg_margin": 30},
}

# Pehle 30 din: category average use karo
# Day 31+: seller ki apni data se model fine-tune hota hai
```

### 15.3 Pakistan Address Validation

```python
# Pakistan ke 200+ major cities, 5000+ areas
PAKISTAN_GEO_DB = {
    "Karachi": {
        "areas": ["Clifton", "DHA", "Gulshan", "Korangi", "SITE", ...],
        "postal_codes": ["75600", "75700", ...],
        "delivery_difficulty": "medium",
        "avg_rto": 31
    },
    "Lahore": {
        "areas": ["Gulberg", "DHA", "Model Town", "Johar Town", ...],
        "delivery_difficulty": "low",
        "avg_rto": 22
    },
    # ... 198 more cities
}

def validate_address_quality(address: str, city: str) -> float:
    """0.0 = very incomplete, 1.0 = complete address"""
    score = 0.0
    
    if city in PAKISTAN_GEO_DB:
        score += 0.3
    
    # Check for area/mohalla
    known_areas = PAKISTAN_GEO_DB.get(city, {}).get("areas", [])
    if any(area.lower() in address.lower() for area in known_areas):
        score += 0.3
    
    # Check for house/flat number
    if any(kw in address.lower() for kw in ["house", "flat", "h#", "f#", "plot", "#"]):
        score += 0.2
    
    # Check length (longer = more detail)
    if len(address) > 50:
        score += 0.2
    
    return min(1.0, score)
```

### 15.4 Daraz Official Partnership

```
Action Required:
1. Daraz Technology Partner Program: https://open.daraz.pk/partner
2. Apply as: "E-commerce Analytics & AI Tools"
3. Documents: Business registration, NTN, SECP certificate
4. Benefits: 10,000+ API calls/day, priority support, co-marketing
5. Timeline: 4-6 weeks approval

Interim solution:
- Seller portal scraping (fallback — ToS grey area)
- Cache aggressively (6 hours TTL)
- Batch requests to minimize calls
```

### 15.5 Model Context Protocol (MCP) Data Layer

```python
# MCP — standardized way for LLM to access tools/data

# tools/mcp_server.py
from mcp.server import Server
from mcp.server.models import InitializationOptions
import mcp.types as types

server = Server("tijarat-ai")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_seller_sales",
            description="Seller ka sales data nikaalo",
            inputSchema={"type": "object", "properties": {
                "seller_id": {"type": "string"},
                "days": {"type": "integer", "default": 30}
            }}
        ),
        types.Tool(
            name="get_rto_score",
            description="Phone number aur city ka RTO risk score",
            inputSchema={"type": "object", "properties": {
                "phone": {"type": "string"},
                "city":  {"type": "string"}
            }}
        ),
        types.Tool(
            name="get_inventory_status",
            description="Current stock levels aur reorder alerts",
            inputSchema={"type": "object", "properties": {
                "seller_id": {"type": "string"}
            }}
        ),
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "get_seller_sales":
        data = await get_sales_data(arguments["seller_id"], arguments.get("days", 30))
        return [types.TextContent(type="text", text=json.dumps(data))]
    
    elif name == "get_rto_score":
        score, signals = await calculate_rto_score(arguments["phone"], arguments["city"], ...)
        return [types.TextContent(type="text", text=json.dumps({"score": score, "signals": signals}))]
```

### 15.6 Observability & Monitoring

```python
# Prometheus metrics + Grafana dashboard

from prometheus_client import Counter, Histogram, Gauge, start_http_server

# Business metrics
rto_predictions = Counter("rto_predictions_total", "Total RTO predictions", ["risk_level"])
roi_calculations = Counter("roi_calculations_total", "Total ROI calculations")
orders_processed = Counter("orders_processed_total", "Total orders", ["platform", "payment_method"])
whatsapp_sent    = Counter("whatsapp_notifications_sent", "WhatsApp messages", ["type"])

# Performance metrics
agent_latency = Histogram("agent_execution_seconds", "Agent execution time", ["agent_name"])
api_latency   = Histogram("api_request_seconds", "API request time", ["endpoint"])

# Health metrics
active_sellers   = Gauge("active_sellers_total", "Active sellers count")
courier_api_up   = Gauge("courier_api_up", "Courier API health", ["courier"])
daraz_api_quota  = Gauge("daraz_api_calls_remaining", "Daraz API quota remaining")
```

### 15.7 Missing Critical Indexes

```sql
-- Performance ke liye zaroori indexes jo ooper miss thay

-- Orders: time-based queries
CREATE INDEX idx_orders_seller_time ON orders(seller_id, created_at DESC);
CREATE INDEX idx_orders_city       ON orders(seller_id, customer_city);
CREATE INDEX idx_orders_status     ON orders(seller_id, status);

-- Inventory: fast lookups
CREATE INDEX idx_inventory_seller ON inventory(seller_id);
CREATE INDEX idx_inventory_sku    ON inventory(seller_id, sku);

-- RTO: high-frequency lookups
CREATE INDEX idx_rto_phone_recent ON rto_history(phone_number, created_at DESC);

-- Shipments: remittance queries
CREATE INDEX idx_shipments_remittance ON shipments(seller_id, cod_remitted, delivered_at);

-- Refresh tokens: cleanup
CREATE INDEX idx_rt_expires ON refresh_tokens(expires_at) WHERE revoked = FALSE;
```

### 15.8 GDPR/PDPA Compliance

Pakistan Personal Data Protection Bill ke liye:

```python
# compliance/data_privacy.py

class DataPrivacyManager:
    
    async def export_seller_data(self, seller_id: str) -> dict:
        """Seller apna sara data export kar sake — right to data portability."""
        return {
            "profile":  await get_seller_profile(seller_id),
            "orders":   await get_all_orders(seller_id),
            "inventory": await get_inventory(seller_id),
            "configs":  await get_seller_config(seller_id),
        }
    
    async def delete_seller_data(self, seller_id: str):
        """Right to be forgotten — GDPR Article 17."""
        # Anonymize RTO data (aggregate still useful, personal info hata do)
        await db.execute(
            "UPDATE rto_history SET seller_id = NULL WHERE seller_id = :sid",
            {"sid": seller_id}
        )
        # Delete everything else
        await db.execute("DELETE FROM sellers WHERE id = :sid", {"sid": seller_id})
    
    async def get_consent_status(self, seller_id: str) -> dict:
        """Kya seller ne data sharing ke liye consent diya hai?"""
        config = await get_seller_config(seller_id)
        return {
            "analytics_sharing":  config.get("share_rto_data", False),
            "marketing_emails":   config.get("marketing_consent", False),
            "data_processing":    True,  # Service use = implicit consent
        }
```

---

## 16. Environment Variables Reference

```bash
# .env.example — production mein Docker Secrets ya AWS Secrets Manager use karo

# ── Core ─────────────────────────────────────────────────
APP_URL=https://tejarat.ai
NEXTAUTH_SECRET=your-32-char-secret

# ── Database ─────────────────────────────────────────────
DB_PASSWORD=strong-random-password-here

# ── Redis ────────────────────────────────────────────────
REDIS_PASSWORD=redis-strong-password

# ── Security ─────────────────────────────────────────────
VAULT_MASTER_KEY=your-vault-master-key-32-chars-min
JWT_PRIVATE_KEY_PATH=/run/secrets/jwt_private
JWT_PUBLIC_KEY_PATH=/run/secrets/jwt_public

# ── AI Models ────────────────────────────────────────────
GEMINI_API_KEY=your-google-gemini-key
OPENAI_API_KEY=your-openai-key  # Fallback

# ── E-Commerce Platforms ─────────────────────────────────
SHOPIFY_API_KEY=your-shopify-public-key
SHOPIFY_API_SECRET=your-shopify-secret
DARAZ_APP_KEY=your-daraz-app-key
DARAZ_APP_SECRET=your-daraz-app-secret

# ── Courier APIs ─────────────────────────────────────────
TCS_API_KEY=your-tcs-api-key
LEOPARDS_API_KEY=your-leopards-api-key
LEOPARDS_API_PASSWORD=your-leopards-password
POSTEX_TOKEN=your-postex-token
TRAX_API_KEY=your-trax-api-key
BLUEEX_USERNAME=your-blueex-username
BLUEEX_PASSWORD=your-blueex-password

# ── WhatsApp ─────────────────────────────────────────────
WHATSAPP_TOKEN=your-whatsapp-cloud-api-token
WHATSAPP_PHONE_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=random-verification-token

# ── File Storage ─────────────────────────────────────────
MINIO_ACCESS_KEY=minio-access-key
MINIO_SECRET_KEY=minio-secret-key

# ── Monitoring ───────────────────────────────────────────
SENTRY_DSN=your-sentry-dsn
SLACK_WEBHOOK=your-slack-webhook-for-alerts
```

---

## 17. API Endpoints Reference

```
Gateway (Port 3000):

AUTH
  POST   /auth/register          Seller registration
  POST   /auth/login             Login → JWT tokens
  POST   /auth/refresh           Refresh access token
  POST   /auth/logout            Revoke refresh token

OAUTH
  GET    /shopify/install        Start Shopify OAuth
  GET    /shopify/callback       Shopify OAuth callback
  GET    /daraz/install          Start Daraz OAuth
  GET    /daraz/callback         Daraz OAuth callback
  POST   /woocommerce/connect    WooCommerce API keys connect

WEBHOOKS
  POST   /webhooks/shopify/orders/create    New Shopify order
  POST   /webhooks/shopify/inventory/update Inventory update
  POST   /webhooks/daraz/order             Daraz order event
  POST   /webhooks/whatsapp               WhatsApp messages

─────────────────────────────────────────────────────────────

AI Core (Port 8000):

ANALYSIS
  POST   /api/v1/analysis/trigger          Manual analysis trigger
  GET    /api/v1/analysis/status/{job_id}  Analysis status
  GET    /api/v1/analysis/latest           Latest analysis results

ORDERS
  POST   /api/v1/orders/rto-score          Get RTO score for order
  POST   /api/v1/orders/roi                Calculate true ROI
  GET    /api/v1/orders/cod-status/{id}    COD confirmation status

INVENTORY
  GET    /api/v1/inventory/status          All inventory with health
  GET    /api/v1/inventory/low-stock       Items below ROP
  GET    /api/v1/inventory/dead-stock      45+ days no sale
  PUT    /api/v1/inventory/{sku}           Update stock quantity
  POST   /api/v1/inventory/reorder/{sku}   Trigger reorder WhatsApp

ANALYTICS
  GET    /api/v1/analytics/sales           Sales breakdown
  GET    /api/v1/analytics/rto-history     RTO trends
  GET    /api/v1/analytics/health-score    Business health score

REPORTS
  POST   /api/v1/reports/monthly           Generate monthly PDF
  GET    /api/v1/reports/list              List generated reports
  GET    /api/v1/reports/{id}/download     Download report

HUMAN APPROVAL
  POST   /api/v1/approvals/{order_id}      Submit approval decision
  GET    /api/v1/approvals/pending         List pending approvals
```

---

## 18. Phase 2 Preview

Yeh features Phase 1 stable hone ke baad:

| Feature | Why Phase 2 | Dependency |
|---------|-------------|------------|
| **Dynamic Pricing Agent** | Competitor scraping complex, Daraz ToS | Phase 1 sales data |
| **Smart Marketing AI** | Meta/Google API, Urdu copywriting model | Sales trend data |
| **Demand Forecasting** | 6+ months data needed for accuracy | Phase 1 history |
| **COD Cash Flow Predictor** | Courier remittance API access needed | Phase 1 logistics |
| **Multi-location Inventory** | Complex sync logic | Phase 1 inventory stable |
| **Voice Queries (Urdu)** | STT model training needed | Phase 1 NLG |
| **Instagram/TikTok Shop** | API integration effort | Phase 1 connectors |

---

## Quick Start

```bash
# 1. Repository clone karo
git clone https://github.com/yourorg/tijarat-ai.git
cd tijarat-ai

# 2. Environment setup
cp .env.example .env
# .env mein apni values bharo

# 3. JWT keys generate karo
mkdir secrets
openssl genrsa -out secrets/jwt_private.pem 2048
openssl rsa -in secrets/jwt_private.pem -pubout -out secrets/jwt_public.pem

# 4. Start karo
docker compose up -d

# 5. Database migrations
docker exec tijarat-ai-core alembic upgrade head

# 6. Health check
curl http://localhost:3000/health
curl http://localhost:8000/health

# 7. Dashboard
open http://localhost:80
```

---

*Tejarat.AI Phase 1 Blueprint — Version 1.0*  
*Pakistan's First Full-Stack E-Commerce AI Platform*  
*Shopify · Daraz · WooCommerce | TCS · Leopards · PostEx · Trax · BlueEx*
ENDOFFILE