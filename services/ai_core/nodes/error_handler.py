async def error_handler_node(state: dict) -> dict:
    """Graceful degradation — per-error-type recovery."""
    errors = state.get("error_log", [])
    recovery_actions = []

    for error in errors:
        if "daraz_api" in error:
            state["sales_trends"] = state.get("sales_trends") or {"status": "unavailable — cached"}
            recovery_actions.append("Daraz data: cached version used")

        elif "logistics_api" in error or "courier" in error:
            city = state.get("customer_city", "unknown")
            from integrations.address_validator import PAKISTAN_GEO_DB
            avg = PAKISTAN_GEO_DB.get(city, {}).get("avg_rto", 27)
            state["rto_score"] = avg
            recovery_actions.append(f"RTO: city average ({avg}) used for {city}")

        elif "gemini_api" in error:
            state["sales_insights_urdu"] = "AI insights temporarily unavailable."
            recovery_actions.append("AI insights: template fallback used")

        else:
            recovery_actions.append(f"Unknown error handled: {error[:50]}")

    state["final_report_urdu"] = (
        "⚠️ Kuch services temporarily unavailable thin.\n"
        f"Recovery: {', '.join(recovery_actions)}\n"
        "Data partial ho sakta hai."
    )

    return state
