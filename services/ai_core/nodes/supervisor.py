from core.langgraph.state import TijaratState

async def supervisor_node(state: TijaratState) -> dict:
    """Combines reports and makes final decisions."""
    # ── Business Health Score (0–100) ──────────────────
    bhs = calculate_business_health_score(state)
    
    # ── Priority Actions (exactly 3) ───────────────────
    actions = generate_priority_actions(state)[:3]
    
    # ── Final Report Mock ─────────────────────
    report = "Mock Urdu Final Report"
    
    # ── WhatsApp Message Mock ───────────────────────────────
    wa_msg = "Mock WhatsApp Message"
    
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
    
    trend = state.get("sales_trends", {}).get("weekly_trend", 0)
    sales_score = min(100, max(0, 50 + trend))
    
    rto_score  = state.get("rto_score", 50)
    rto_health = max(0, 100 - rto_score)
    
    roi = state.get("true_roi", 0)
    margin_health = min(100, max(0, roi * 2))
    
    inv_health = state.get("inventory_health_score", 70)
    cash_score = 70
    
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
    
    rto = state.get("rto_score", 0)
    city = state.get("customer_city", "Unknown")
    if rto >= 61:
        actions.append(f"⚠️ {city} ke orders mein RTO zyada — advance payment ya confirmation lein")
    
    low_stock = state.get("low_stock_items", [])
    if low_stock:
        item = low_stock[0]
        actions.append(f"📦 '{item['name']}' — {item['days_remaining']} din mein khatam. {item['reorder_qty']} units order karein")
    
    roi = state.get("true_roi", 0)
    if roi < 10:
        actions.append("💰 Margin bahut kam hai — COGS ya shipping review karein")
        
    if not actions:
         actions.append("✅ Sab kuch behtar chal raha hai!")
    
    return actions
