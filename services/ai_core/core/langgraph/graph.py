from langgraph.graph import StateGraph, END, START
from .state import TijaratState
from nodes.sales_agent import sales_node
from nodes.inventory_agent import inventory_node
from nodes.logistics_agent import logistics_node
from nodes.supervisor import supervisor_node
from nodes.human_approval import human_approval_node
from nodes.output import output_node
from nodes.error_handler import error_handler_node

def build_graph(checkpointer=None) -> StateGraph:
    graph = StateGraph(TijaratState)
    
    # Register Nodes
    graph.add_node("sales_agent",    sales_node)
    graph.add_node("inventory_agent", inventory_node)
    graph.add_node("logistics_agent", logistics_node)
    graph.add_node("supervisor",      supervisor_node)
    graph.add_node("human_approval",  human_approval_node)
    graph.add_node("output",          output_node)
    graph.add_node("error_handler",   error_handler_node)
    
    # Edges
    graph.add_edge(START, "sales_agent")
    graph.add_edge("sales_agent", "inventory_agent")
    graph.add_edge("inventory_agent", "logistics_agent")
    
    graph.add_conditional_edges(
        "logistics_agent",
        route_after_logistics,
        {
            "needs_approval": "human_approval",
            "auto_proceed":   "supervisor",
            "error":          "error_handler",
        }
    )
    
    graph.add_conditional_edges(
        "human_approval",
        route_after_human,
        {
            "approved":  "supervisor",
            "rejected":  "output",
            "timeout":   "supervisor",
        }
    )
    
    graph.add_edge("supervisor", "output")
    graph.add_edge("error_handler", "output")
    graph.add_edge("output", END)
    
    compile_args = {"interrupt_before": ["human_approval"]}
    if checkpointer:
        compile_args["checkpointer"] = checkpointer
        
    return graph.compile(**compile_args)

def route_after_logistics(state: TijaratState) -> str:
    if state.get("error_log"):
        return "error"
    
    rto_score = state.get("rto_score", 0)
    payment   = state.get("payment_method", "prepaid")
    
    if rto_score >= 61 and payment == "cod":
        return "needs_approval"
    
    return "auto_proceed"

def route_after_human(state: TijaratState) -> str:
    decision = state.get("human_decision")
    if decision == "reject":
        return "rejected"
    if decision is None:
        return "timeout"
    return "approved"
