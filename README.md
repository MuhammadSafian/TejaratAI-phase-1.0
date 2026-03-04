<div align="center">

# 🏪 Tejarat AI v1.0

### AI-Powered E-Commerce Intelligence for Pakistani Sellers

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com)
[![Python](https://img.shields.io/badge/Python-3.11-green)](https://python.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%20+%20TimescaleDB-blue)](https://timescale.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://docker.com)

*Real-time sales analytics, RTO prediction, inventory management, and smart courier routing — all in Urdu* 🇵🇰

</div>

---

## 📖 Overview

Tejarat AI is a **multi-agent AI system** built for Pakistani e-commerce sellers. It connects to Shopify, Daraz, and WooCommerce — automatically analyzes sales, predicts return-to-origin (RTO) risk, calculates true ROI per order, manages inventory reorder points, and selects the best courier.

### Key Features

| Feature | Detail |
|---------|--------|
| 🧠 **4-Agent AI System** | Sales, Inventory, Logistics, Supervisor — powered by LangGraph |
| 📊 **Business Health Score** | 0-100 score based on 5 weighted factors |
| 🔄 **RTO Predictor** | 14-signal scoring system to flag risky COD orders |
| 💰 **True ROI Calculator** | 12 cost factors including COGS, shipping, ad spend, overhead |
| 🚚 **5 Courier Integrations** | TCS, Leopards, PostEx, Trax, BlueEx with smart routing |
| 📦 **3 Platform Integrations** | Shopify, Daraz, WooCommerce with rate limiting + polling |
| 🔐 **Enterprise Security** | Fernet vault, RS256 JWT, OTP 2FA, Google OAuth, PostgreSQL RLS |
| 💬 **WhatsApp Notifications** | Alerts in Urdu via WhatsApp Business API |
| 🗺️ **Pakistan GEO DB** | 98+ cities with delivery difficulty and RTO estimates |

---

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Gateway    │────▶│   AI Core    │
│  (Next.js)   │     │  (NestJS)    │     │  (FastAPI)   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                     ┌──────┴──────┐        ┌─────┴─────┐
                     │   Nginx     │        │  Workers   │
                     │ (Reverse    │        │ (Celery +  │
                     │  Proxy)     │        │  Redis)    │
                     └─────────────┘        └─────┬─────┘
                                                  │
                                      ┌───────────┴────────────┐
                                      │  PostgreSQL + Redis    │
                                      │  (TimescaleDB)         │
                                      └────────────────────────┘
```

### Services (Docker Compose)

| Service | Port | Technology |
|---------|------|-----------|
| `tijarat-gateway` | 3000 | NestJS 10, TypeScript |
| `tijarat-ai-core` | 8000 | FastAPI, Python 3.11 |
| `tijarat-worker` | — | Celery 5.x |
| `tijarat-beat` | — | Celery Beat (scheduler) |
| `tijarat-postgres` | 5432 | TimescaleDB (PG 15) |
| `tijarat-redis` | 6379 | Redis 7 |
| `tijarat-minio` | 9000 | MinIO (object storage) |
| `tijarat-nginx` | 80/443 | Nginx (reverse proxy) |

---

## 📁 Project Structure

```
TejaratAI v1.0/
├── docker-compose.yml          # 8-service orchestration
├── .env.example                # All env variables
├── init-scripts/
│   └── init.sql                # 11 tables + RLS + indexes + mat views
├── nginx/
│   └── nginx.conf              # SSL, rate limiting, proxy
├── .github/workflows/
│   └── ci.yml                  # CI/CD with Bandit, npm audit, test DB
│
├── services/ai_core/           # Python AI Engine
│   ├── main.py                 # FastAPI app + routes
│   ├── core/
│   │   ├── db.py               # asyncpg connection pool
│   │   ├── config.py           # Pydantic settings
│   │   ├── tasks.py            # 8 Celery tasks
│   │   ├── celery_app.py       # Celery config
│   │   ├── celery_schedule.py  # Beat schedule (8 jobs)
│   │   └── langgraph/
│   │       ├── graph.py        # LangGraph StateGraph
│   │       └── state.py        # 32-field TijaratState
│   ├── nodes/                  # AI Agents
│   │   ├── supervisor.py       # BHS + priority actions
│   │   ├── sales_agent.py      # Sales analysis + Gemini
│   │   ├── inventory_agent.py  # ROP + dead stock
│   │   ├── logistics_agent.py  # RTO + ROI + courier
│   │   ├── human_approval.py   # WhatsApp interrupt
│   │   ├── output.py           # Response formatter
│   │   ├── error_handler.py    # Retry + fallback
│   │   └── logistics/
│   │       ├── rto_predictor.py    # 14-signal scoring
│   │       └── roi_calculator.py   # 12-factor cost calc
│   ├── integrations/
│   │   ├── shopify.py          # Shopify REST API
│   │   ├── daraz.py            # Daraz Open Platform
│   │   ├── woocommerce.py      # WooCommerce REST v3
│   │   ├── whatsapp.py         # WhatsApp Business API
│   │   ├── address_validator.py # 98+ cities GEO DB
│   │   └── couriers/
│   │       ├── __init__.py     # Smart courier router
│   │       ├── tcs.py
│   │       ├── leopards.py
│   │       ├── postex.py
│   │       ├── trax.py
│   │       └── blueex.py
│   ├── security/
│   │   ├── vault.py            # Fernet AES-256
│   │   ├── jwt_handler.py      # RS256 JWT
│   │   ├── passwords.py        # bcrypt
│   │   └── otp.py              # Redis OTP + WhatsApp
│   ├── routes/
│   │   └── auth_routes.py      # OTP + Google login APIs
│   └── tests/
│       ├── test_api.py
│       ├── test_supervisor.py
│       ├── test_couriers.py
│       └── test_integration.py # 16+ integration tests
│
└── services/gateway/           # NestJS API Gateway
    └── src/
        ├── app.module.ts
        ├── main.ts
        ├── auth/               # JWT + OTP + Google OAuth
        ├── platforms/          # Shopify/Daraz connect
        ├── webhooks/           # HMAC verification
        ├── vault/              # AES-256-GCM
        ├── users/
        └── middleware/         # Redis rate limiter
```

---

## 🚀 Quick Start

### Prerequisites
- Docker + Docker Compose
- Node.js 20+ (for Gateway development)
- Python 3.11+ (for AI Core development)

### 1. Clone & Configure
```bash
git clone <repo-url> && cd "TejaratAI v1.0"
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start All Services
```bash
docker compose up -d
```

### 3. Verify
```bash
# AI Core health
curl http://localhost:8000/health

# Gateway health
curl http://localhost:3000

# Check all 8 services
docker compose ps
```

### 4. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/api/v1/process-order` | Process new order |
| `POST` | `/api/v1/shipment-update` | Update shipment status |
| `POST` | `/api/v1/run-analysis` | Trigger daily analysis |
| `GET` | `/api/v1/seller/{id}/health-score` | Get BHS score |
| `GET` | `/api/v1/seller/{id}/rto-check` | Check RTO risk |
| `POST` | `/api/v1/auth/send-otp` | Send OTP via WhatsApp |
| `POST` | `/api/v1/auth/verify-otp` | Verify OTP + get JWT |
| `POST` | `/api/v1/auth/google-login` | Google OAuth login |

---

## 🗄️ Database Schema

**11 tables** with TimescaleDB hypertables, Row Level Security, and optimized indexes:

| Table | Purpose |
|-------|---------|
| `sellers` | Seller accounts |
| `orders` | Orders from all platforms |
| `order_items` | Individual line items |
| `inventory` | SKU-level stock tracking |
| `shipments` | Courier shipments + tracking |
| `rto_history` | Return-to-origin phone/city history |
| `platform_tokens` | Encrypted platform credentials |
| `seller_config` | Per-seller settings (COGS, margins) |
| `variable_expenses` | Monthly ad spend, overhead |
| `refresh_tokens` | JWT refresh token storage |

### Security
- **Row Level Security (RLS)** on 8 tables
- `tijarat_app` role with restricted access
- `SET app.current_seller_id` before every query

---

## ⚙️ Background Tasks (Celery Beat)

| Task | Schedule | What it does |
|------|----------|-------------|
| Daily Analysis | 2 AM | Runs full LangGraph flow for all sellers |
| Reorder Check | Every 6h | ROP calculation + WhatsApp low-stock alerts |
| Order Sync (×3) | Every 15 min | Polls Shopify/Daraz/WooCommerce for missed orders |
| Shipment Tracking | Every 30 min | Updates tracking status from courier APIs |
| Mat View Refresh | Hourly | Refreshes `city_courier_rto_rate` analytics |
| Monthly Reports | 1st of month | Revenue/orders/RTO summary via WhatsApp |
| Commission Sync | Weekly (Mon) | Daraz category commission rates refresh |

---

## 🧪 Testing

```bash
# Unit tests
cd services/ai_core
python -m pytest tests/ -v

# Integration tests (requires test DB)
TESTING=true python -m pytest tests/test_integration.py -v

# Gateway tests
cd services/gateway
npm test
```

---

## 🔐 Security Highlights

- **Token Vault**: Fernet AES-256 encryption with key rotation
- **JWT**: RS256 asymmetric signing (15 min access, 7 day refresh)
- **2FA**: OTP via WhatsApp (Redis-backed, rate limited)
- **OAuth**: Google login for seller onboarding
- **RLS**: PostgreSQL Row Level Security on all seller tables
- **Rate Limiting**: Redis-based middleware on Gateway
- **HMAC**: Webhook signature verification

---

## 📄 License

Proprietary — All rights reserved.

---

<div align="center">

**Built with ❤️ for Pakistani E-Commerce Sellers**

</div>
