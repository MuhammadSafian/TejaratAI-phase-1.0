from typing import TypedDict, Optional, List, Annotated
from langgraph.graph.message import add_messages
from datetime import datetime

class TijaratState(TypedDict):
    """Shared State — read/write for all agents."""
    # === Trigger Info ===
    trigger_type: str       # "new_order" | "daily_analysis" | "manual"
    trigger_time: datetime
    seller_id: str
    
    # === Order Data ===
    order_id: Optional[str]
    order_platform: Optional[str]   # "shopify" | "daraz" | "woocommerce"
    customer_phone: Optional[str]
    customer_city: Optional[str]
    order_value: Optional[float]
    order_items: Optional[List[dict]]
    payment_method: Optional[str]   # "cod" | "prepaid"
    
    # === Sales Agent Output ===
    sales_trends: Optional[dict]    
    top_products: Optional[List[str]]
    anomalies_detected: Optional[List[str]]
    sales_insights_urdu: Optional[str]
    
    # === Inventory Agent Output ===
    inventory_status: Optional[dict]
    low_stock_items: Optional[List[dict]]
    dead_stock_items: Optional[List[dict]]
    reorder_required: Optional[List[dict]]
    inventory_health_score: Optional[float]
    
    # === Logistics Agent Output ===
    rto_score: Optional[float]
    rto_risk_level: Optional[str]
    rto_signals: Optional[dict]
    true_roi: Optional[float]
    cod_confirmed: Optional[bool]
    recommended_courier: Optional[str]
    
    # === Business Manager Output ===
    business_health_score: Optional[float]
    priority_actions: Optional[List[str]]
    final_report_urdu: Optional[str]
    whatsapp_message: Optional[str]
    
    # === Control Flow ===
    requires_human_approval: bool
    human_decision: Optional[str]
    error_log: Optional[List[str]]
    
    # === Message History ===
    messages: Annotated[list, add_messages]
