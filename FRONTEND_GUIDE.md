# 🎨 Tejarat AI — Frontend Architecture Guide

> Yeh document frontend design ke liye reference hai. Har agent, API, aur data shape detail mein explained hai.

---

## 🧠 AI System Overview

Tejarat AI mein **4 AI Agents** hain jo LangGraph ke through connected hain. Har agent ek specific kaam karta hai:

```
                    ┌─────────────┐
        ┌──────────▶│  Supervisor  │◀──────────┐
        │           │   (Router)   │           │
        │           └──────┬──────┘           │
        │                  │                   │
   ┌────┴────┐      ┌─────┴─────┐     ┌──────┴──────┐
   │  Sales  │      │ Inventory │     │  Logistics  │
   │  Agent  │      │   Agent   │     │    Agent    │
   └─────────┘      └───────────┘     └─────────────┘
        │                  │                   │
        └──────────┬───────┴───────────────────┘
                   ▼
           ┌──────────────┐
           │ Human Approval│ (WhatsApp interrupt)
           └──────┬───────┘
                  ▼
           ┌──────────────┐
           │    Output     │ (Final response)
           └──────────────┘
```

---

## 🤖 Agent #1: Supervisor (Router + Scorer)

### Kya karta hai?
- **Business Health Score (BHS)** calculate karta hai (0-100)
- **Priority actions** generate karta hai
- Decide karta hai konsa agent next call ho

### BHS Formula (5 weights)
| Factor | Weight | How it's calculated |
|--------|--------|--------------------|
| Sales Growth | 25% | Weekly sales trend % → 0-100 scale |
| RTO Rate | 25% | RTO score inverted (low RTO = high score) |
| Profit Margin | 25% | True ROI % → 0-100 scale |
| Inventory Health | 15% | (Total SKUs - Low Stock - Dead Stock) / Total |
| Cash Flow | 10% | COD confirmation bonus |

### Frontend Dashboard Card — BHS
```json
{
  "business_health_score": 78.5,
  "score_breakdown": {
    "sales_growth": 85,
    "rto_control": 72,
    "profit_margin": 68,
    "inventory_health": 90,
    "cash_flow": 80
  },
  "grade": "B+",
  "trend": "improving",
  "last_updated": "2026-03-04T14:00:00Z"
}
```

### Priority Actions (show in dashboard)
```json
{
  "priority_actions": [
    {
      "type": "warning",
      "icon": "🔴",
      "title": "High RTO Alert",
      "description": "RTO score 75 — Peer city se zyada returns aa rahe hain",
      "action": "COD confirmation enable karein"
    },
    {
      "type": "critical",
      "icon": "⚠️",
      "title": "Negative ROI",
      "description": "True ROI -5% — kuch products pe loss ho raha hai",
      "action": "COGS aur shipping cost review karein"
    },
    {
      "type": "info",
      "icon": "📦",
      "title": "Low Stock",
      "description": "3 items 5 din mein khatam ho jayenge",
      "items": ["Blue T-Shirt (12 left)", "Phone Case (5 left)"]
    }
  ]
}
```

---

## 📊 Agent #2: Sales Agent

### Kya karta hai?
- Last 30 din ka **sales data** analyze karta hai
- **City-wise** aur **time-wise** breakdown
- **Weekly trend** calculate karta hai (↑ or ↓)
- **Anomalies** detect karta hai (30%+ drop/spike)
- **Gemini AI** se Urdu insights generate karta hai

### API Endpoint
```
POST /api/v1/run-analysis
Body: { "seller_id": "uuid", "analysis_type": "daily" }
```

### Data Shape (for frontend charts)
```json
{
  "sales_trends": {
    "total_orders": 156,
    "total_revenue": 485000,
    "avg_order_value": 3109,
    "weekly_trend": 12.5,
    "trend_direction": "up"
  },
  "city_breakdown": [
    {"city": "Karachi", "orders": 45, "revenue": 142000, "percentage": 29},
    {"city": "Lahore", "orders": 38, "revenue": 118000, "percentage": 24},
    {"city": "Islamabad", "orders": 25, "revenue": 89000, "percentage": 18},
    {"city": "Faisalabad", "orders": 18, "revenue": 52000, "percentage": 11}
  ],
  "time_breakdown": {
    "peak_hour": 14,
    "peak_day": "Friday",
    "hourly_distribution": {"9": 5, "10": 8, "11": 12, "14": 18, "20": 15}
  },
  "anomalies_detected": [
    "📈 Lahore orders 35% increase vs last week",
    "📉 Karachi revenue 20% down — investigate"
  ],
  "ai_insight_urdu": "Aapki sales mein 12% improvement hai! Lahore aur Islamabad ache perform kar rahe hain. Karachi mein thori kami hai — promotional campaign chalayein."
}
```

### Suggested Frontend Components
1. **Revenue Card** — Total revenue + trend arrow (↑12.5%)
2. **Orders Card** — Total orders + AOV
3. **City Pie Chart** — Distribution by city
4. **Hourly Bar Chart** — Orders per hour
5. **Weekly Trend Line** — Last 4 weeks comparison
6. **AI Insight Box** — Urdu text bubble (Gemini generated)
7. **Anomaly Alerts** — Red/green badges

---

## 📦 Agent #3: Inventory Agent

### Kya karta hai?
- **Current stock levels** check karta hai
- **Daily sales velocity** calculate karta hai (30-day avg)
- **Reorder Point (ROP)** formula: `(avg_daily × lead_time) + safety_stock`
- **Dead stock** detect karta hai (45+ din se unsold)
- **Inventory Health Score** (0-100)

### Data Shape
```json
{
  "inventory_status": {
    "total_skus": 45,
    "total_units": 2340,
    "total_value": 890000,
    "health_score": 72
  },
  "low_stock_items": [
    {
      "sku": "TSHIRT-BLUE-M",
      "name": "Blue T-Shirt Medium",
      "current_stock": 12,
      "daily_velocity": 2.4,
      "days_remaining": 5,
      "reorder_point": 24,
      "suggested_reorder_qty": 75,
      "status": "critical"
    },
    {
      "sku": "CASE-IPHONE15",
      "name": "iPhone 15 Case",
      "current_stock": 5,
      "daily_velocity": 1.2,
      "days_remaining": 4,
      "reorder_point": 15,
      "suggested_reorder_qty": 45,
      "status": "critical"
    }
  ],
  "dead_stock_items": [
    {
      "sku": "WATCH-GOLD-L",
      "name": "Gold Watch Large",
      "current_stock": 50,
      "days_unsold": 67,
      "original_value": 75000,
      "action_suggestion": "30% discount ya bundle deal mein daal dein"
    }
  ],
  "velocity_chart": [
    {"sku": "TSHIRT-BLUE-M", "name": "Blue T-Shirt", "daily_velocity": 2.4, "rank": 1},
    {"sku": "JEANS-BLACK-32", "name": "Black Jeans", "daily_velocity": 1.8, "rank": 2}
  ]
}
```

### Suggested Frontend Components
1. **Inventory Overview Cards** — Total SKUs, Units, Value, Health Score
2. **Low Stock Table** — Red highlight, days remaining, reorder button
3. **Dead Stock Table** — Orange highlight, action suggestions
4. **Velocity Ranking** — Top sellers bar chart
5. **Stock Level Gauge** — Per-item circular progress

---

## 🚚 Agent #4: Logistics Agent

### Kya karta hai?
- **RTO Risk Score** calculate karta hai (0-100, 14 signals)
- **True ROI** calculate karta hai (12 cost factors)
- **COD Confirmation** — risky orders ke liye WhatsApp verify
- **Best Courier** select karta hai (city-wise performance se)

### RTO Predictor — 14 Signals
| Signal | Score Impact | Description |
|--------|-------------|-------------|
| `phone_previous_return` | +25 | Phone number ne pehle return kiya |
| `phone_repeated_fake` | +35 | Multiple fake orders from this phone |
| `phone_no_history` | +5 | Naya number, no order history |
| `phone_verified_buyer` | -15 | Pehle successfully delivered |
| `address_incomplete` | +15 | Address quality score < 0.5 |
| `address_known_fraud_area` | +20 | Fraud-prone area |
| `cod_high_value` | +10 | COD > Rs.5000 |
| `cod_very_high` | +20 | COD > Rs.15000 |
| `time_late_night` | +8 | Order placed 12AM-5AM |
| `city_high_rto` | +12 | City avg RTO > 35% |
| `courier_poor_city_perf` | +10 | Courier historically bad in this city |
| `order_count_spike` | +15 | 3+ orders same phone same day |
| `new_customer` | +5 | First-time buyer |
| `prepaid_discount` | -20 | Prepaid (not COD) |

### Data Shape — RTO Check
```json
{
  "rto_score": 65,
  "risk_level": "high",
  "risk_color": "#FF4444",
  "signals": {
    "phone_previous_return": true,
    "address_incomplete": true,
    "cod_high_value": true,
    "city_high_rto": false
  },
  "recommendation": "COD confirmation WhatsApp pe bhejein",
  "action_required": true
}
```

### True ROI Calculator — 12 Factors
| Cost Factor | Source |
|------------|--------|
| COGS (Cost of Goods) | `seller_config.avg_cogs_percent` |
| Platform Commission | Shopify 2%, Daraz 5-15% |
| Payment Gateway Fee | 2.5% (estimated) |
| Shipping Cost | Courier rate API |
| Packaging Cost | `seller_config.packaging_cost` |
| RTO Penalty | `rto_score × shipping_cost × 2` |
| Ad Spend per Order | `variable_expenses / orders` |
| Monthly Overhead | `variable_expenses / orders` |
| Return Processing | If RTO, additional cost |
| Discount/Coupon | Applied discount amount |
| Warehouse Cost | Per-unit storage cost |
| Insurance | Optional shipment insurance |

### Data Shape — ROI
```json
{
  "true_roi": 18.5,
  "roi_status": "profitable",
  "roi_color": "#44BB44",
  "breakdown": {
    "order_value": 3500,
    "cogs": -1050,
    "commission": -175,
    "gateway_fee": -87.5,
    "shipping": -250,
    "packaging": -30,
    "rto_penalty": -125,
    "ad_spend": -80,
    "overhead": -55,
    "net_profit": 647.5
  }
}
```

### Courier Selection
```json
{
  "recommended_courier": {
    "name": "TCS",
    "reason": "Best delivery rate in Lahore (94%)",
    "estimated_rate": 250,
    "estimated_days": 2
  },
  "alternatives": [
    {"name": "Leopards", "rate": 200, "city_performance": 89},
    {"name": "PostEx", "rate": 220, "city_performance": 85}
  ]
}
```

---

## 🔐 Authentication Flow

### OTP Login (Primary)
```
1. POST /api/v1/auth/send-otp { phone: "+923001234567" }
   → Response: { status: "otp_sent" }
   → WhatsApp message: "Your OTP: 123456"

2. POST /api/v1/auth/verify-otp { phone: "+923001234567", otp: "123456" }
   → Response: {
       status: "verified",
       seller_id: "uuid",
       jwt_token: "eyJ..."
     }
```

### Google OAuth Login
```
1. GET /api/auth/google/login
   → Redirect to Google consent screen

2. Google callback → /api/auth/google/callback?code=xxx
   → Creates/finds seller
   → Redirects to: /auth/callback?token=eyJ...&seller=uuid
```

### JWT Token Usage
```
All authenticated requests:
Header: Authorization: Bearer <jwt_token>
Token expires: 15 minutes
Refresh: 7 days
```

---

## 📱 Suggested Frontend Pages

### Page 1: Dashboard (Main)
```
┌──────────────────────────────────────────┐
│  BHS Score Gauge (78.5)   │  Revenue Card │
│  Grade: B+                │  Rs 485,000   │
├───────────────────────────┤───────────────┤
│  Priority Actions (3)     │  Orders: 156  │
│  • High RTO Alert         │  AOV: 3,109   │
│  • Negative ROI           │               │
│  • Low Stock (3 items)    │  Trend: ↑12%  │
├───────────────────────────┴───────────────┤
│  Sales Chart (7 day / 30 day toggle)      │
│  ████████████████████████                 │
├───────────────────────────────────────────┤
│  City Performance Map                     │
│  Karachi: 45 orders │ Lahore: 38 orders   │
└───────────────────────────────────────────┘
```

### Page 2: Orders
```
┌───────────────────────────────────────────┐
│  Filter: All / Shopify / Daraz / WooComm  │
├───────────────────────────────────────────┤
│  #12345 │ Karachi │ Rs 3500 │ COD │ ⚠️ 65 │
│  #12344 │ Lahore  │ Rs 2800 │ Pre │ ✅ 15 │
│  #12343 │ Isb     │ Rs 5200 │ COD │ 🔴 78 │
├───────────────────────────────────────────┤
│  Click order → RTO score + ROI breakdown  │
└───────────────────────────────────────────┘
```

### Page 3: Inventory
```
┌───────────────────────────────────────────┐
│  Total SKUs: 45 │ Health: 72% │ Value: 8.9L│
├───────────────────────────────────────────┤
│  🔴 LOW STOCK (3 items)                  │
│  Blue T-Shirt │ 12 left │ 5 days │ Reorder│
│  Phone Case   │ 5 left  │ 4 days │ Reorder│
├───────────────────────────────────────────┤
│  🟡 DEAD STOCK (1 item)                  │
│  Gold Watch │ 50 units │ 67 days unsold   │
│  Suggestion: 30% discount                │
├───────────────────────────────────────────┤
│  📊 Top Sellers Velocity Chart            │
└───────────────────────────────────────────┘
```

### Page 4: Logistics / Shipments
```
┌───────────────────────────────────────────┐
│  Active: 24 │ Delivered: 132 │ RTO: 18    │
├───────────────────────────────────────────┤
│  Track #TCS123 │ Lahore │ In Transit │ 2d │
│  Track #LEO456 │ ISB    │ Delivered  │ ✅ │
│  Track #POX789 │ Karachi│ Returned   │ 🔄 │
├───────────────────────────────────────────┤
│  Courier Performance Comparison           │
│  TCS: 94% │ Leopards: 89% │ PostEx: 85%  │
└───────────────────────────────────────────┘
```

### Page 5: Settings / Onboarding
```
┌───────────────────────────────────────────┐
│  Platform Connections                     │
│  ✅ Shopify Connected │ 🔗 Connect Daraz  │
├───────────────────────────────────────────┤
│  Business Settings                        │
│  COGS %: [30]  │ Packaging: [Rs 30]       │
│  Lead Time: [7 days]                      │
├───────────────────────────────────────────┤
│  Courier Preferences                      │
│  Primary: TCS │ Fallback: Leopards        │
├───────────────────────────────────────────┤
│  Notification Settings                    │
│  WhatsApp Alerts: [ON]                    │
│  Daily Report: [ON]                       │
└───────────────────────────────────────────┘
```

---

## 🎨 Design System Suggestions

### Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Primary | Deep Blue | `#1A56DB` |
| Success / Profit | Green | `#059669` |
| Warning / Medium RTO | Amber | `#D97706` |
| Danger / High RTO | Red | `#DC2626` |
| Background | Dark | `#0F172A` |
| Card BG | Slate | `#1E293B` |
| Text Primary | White | `#F8FAFC` |
| Text Secondary | Gray | `#94A3B8` |

### RTO Score Colors
| Score | Level | Color | Badge |
|-------|-------|-------|-------|
| 0-30 | Low | `#059669` (green) | ✅ Safe |
| 31-60 | Medium | `#D97706` (amber) | ⚠️ Review |
| 61-100 | High | `#DC2626` (red) | 🔴 Risky |

### BHS Grade Colors
| Score | Grade | Color |
|-------|-------|-------|
| 90-100 | A+ | `#059669` |
| 80-89 | A | `#10B981` |
| 70-79 | B+ | `#3B82F6` |
| 60-69 | B | `#6366F1` |
| 50-59 | C | `#D97706` |
| < 50 | D | `#DC2626` |

---

## 🔌 API Endpoints — Full Reference

### Authentication
| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/api/v1/auth/send-otp` | `{phone}` | `{status: "otp_sent"}` |
| `POST` | `/api/v1/auth/verify-otp` | `{phone, otp}` | `{seller_id, jwt_token}` |
| `POST` | `/api/v1/auth/google-login` | `{email, name, google_id}` | `{seller_id, jwt_token}` |

### Dashboard
| Method | Path | Response |
|--------|------|----------|
| `GET` | `/api/v1/seller/{id}/health-score` | BHS + breakdown |
| `POST` | `/api/v1/run-analysis` | Triggers full analysis |

### Orders
| Method | Path | Response |
|--------|------|----------|
| `POST` | `/api/v1/process-order` | Queue order for processing |
| `GET` | `/api/v1/seller/{id}/rto-check?phone=&city=&amount=` | RTO score + signals |

### Shipments
| Method | Path | Response |
|--------|------|----------|
| `POST` | `/api/v1/shipment-update` | Update tracking status |

### Platforms (Gateway)
| Method | Path | Response |
|--------|------|----------|
| `GET` | `/api/platforms/shopify/connect` | Start Shopify OAuth |
| `POST` | `/api/platforms/daraz/connect` | Connect Daraz credentials |

---

## 📋 Database Tables — Quick Reference for Frontend

### sellers
| Column | Type | Frontend Use |
|--------|------|-------------|
| id | UUID | Seller identifier |
| name | VARCHAR | Display name |
| email | VARCHAR | Login / profile |
| phone | VARCHAR | OTP / WhatsApp |

### orders
| Column | Type | Frontend Use |
|--------|------|-------------|
| platform | VARCHAR | Platform badge (Shopify/Daraz) |
| order_value | DECIMAL | Revenue display |
| customer_city | VARCHAR | City breakdown |
| payment_method | VARCHAR | COD/Prepaid badge |
| status | VARCHAR | Order status filter |

### inventory
| Column | Type | Frontend Use |
|--------|------|-------------|
| product_name | VARCHAR | Product display |
| quantity | INT | Stock level gauge |
| sku | VARCHAR | Product identifier |
| unit_cost | DECIMAL | COGS calculation |

### shipments
| Column | Type | Frontend Use |
|--------|------|-------------|
| tracking_number | VARCHAR | Track link |
| courier | VARCHAR | Courier badge |
| status | VARCHAR | Status timeline |
| delivered_at | TIMESTAMP | Delivery confirmation |
| returned_at | TIMESTAMP | RTO marker |
