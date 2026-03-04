from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings
from core import db
from datetime import datetime, timedelta
from collections import defaultdict
from tenacity import retry, stop_after_attempt, wait_exponential


async def sales_node(state: dict) -> dict:
    seller_id = state["seller_id"]
    errors = []

    # ── 1. Data Pull from DB ────────────────────────────
    raw_orders = await db.fetch_all(
        """SELECT o.platform_order_id, o.created_at, o.order_value AS total_price,
                  o.customer_city AS city, o.status AS financial_status, o.payment_method
           FROM orders o
           WHERE o.seller_id = $1 AND o.created_at >= $2
           ORDER BY o.created_at DESC""",
        seller_id, datetime.utcnow() - timedelta(days=180),
    )

    if not raw_orders:
        return {
            "sales_trends": {"status": "no_data"},
            "top_products": [],
            "anomalies_detected": [],
            "sales_insights_urdu": "Abhi tak koi data available nahi hai.",
            "error_log": state.get("error_log", []),
        }

    # ── 2. Analysis ──────────────────────────────────────
    analysis = analyze_sales_data(raw_orders)
    anomalies = detect_anomalies(analysis)

    # ── 3. Gemini Urdu Insight ───────────────────────────
    insight_text = "AI insights generation pending — Gemini key set karein."
    if settings.GOOGLE_API_KEY:
        try:
            gemini = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.3)
            prompt = f"""Aap ek Pakistan e-commerce business advisor hain.
Neeche ek seller ka sales data hai. Urdu mein ek friendly, actionable insight likhein.

Data:
- Best selling city: {analysis.get('top_city', 'N/A')}
- Best day: {analysis.get('best_day', 'N/A')}
- Weekly trend: {analysis.get('weekly_trend', 0)}%
- Total orders (6m): {analysis.get('total_orders_6m', 0)}

Format: 2-3 sentences max, Roman Urdu."""
            response = await gemini.ainvoke(prompt)
            insight_text = response.content
        except Exception as e:
            errors.append(f"gemini_api: {e}")
            insight_text = _template_insight(analysis)

    return {
        "sales_trends": analysis,
        "top_products": analysis.get("top_products", [])[:5],
        "anomalies_detected": anomalies,
        "sales_insights_urdu": insight_text,
        "customer_city": analysis.get("top_city"),
        "error_log": errors if errors else state.get("error_log", []),
    }


def analyze_sales_data(orders: list) -> dict:
    city_sales = defaultdict(float)
    day_sales = defaultdict(float)
    week_now = 0.0
    week_prev = 0.0
    now = datetime.utcnow()
    total_revenue = 0.0
    returned = 0

    for o in orders:
        val = float(o["total_price"] or 0)
        total_revenue += val
        city = o.get("city") or "Unknown"
        city_sales[city] += val

        created = o["created_at"]
        if created:
            day_name = created.strftime("%A")
            day_sales[day_name] += val
            days_ago = (now - created).days
            if days_ago <= 7:
                week_now += val
            elif days_ago <= 14:
                week_prev += val

        if o.get("financial_status") == "returned":
            returned += 1

    trend = ((week_now - week_prev) / week_prev * 100) if week_prev > 0 else 0

    top_city = max(city_sales, key=city_sales.get) if city_sales else "Unknown"
    best_day = max(day_sales, key=day_sales.get) if day_sales else "Unknown"

    return {
        "city_breakdown": dict(city_sales),
        "time_breakdown": dict(day_sales),
        "top_city": top_city,
        "best_day": best_day,
        "weekly_trend": round(trend, 1),
        "top_products": [],
        "total_revenue_6m": total_revenue,
        "total_orders_6m": len(orders),
        "return_rate": round(returned / max(len(orders), 1) * 100, 1),
    }


def detect_anomalies(analysis: dict) -> list:
    anomalies = []
    trend = analysis.get("weekly_trend", 0)
    if trend < -20:
        anomalies.append(f"Sales mein {abs(trend):.0f}% girawat — investigate karein")
    if trend > 30:
        anomalies.append(f"Sales mein {trend:.0f}% izafa — demand badh rahi hai!")
    if analysis.get("return_rate", 0) > 25:
        anomalies.append(f"Return rate {analysis['return_rate']}% — bahut zyada hai")
    return anomalies


def _template_insight(analysis: dict) -> str:
    return (
        f"Aapki best city {analysis.get('top_city', '?')} hai. "
        f"Is hafte sales trend {analysis.get('weekly_trend', 0):+.0f}% hai. "
        f"Total {analysis.get('total_orders_6m', 0)} orders 6 months mein."
    )
