from nodes.supervisor import calculate_business_health_score, generate_priority_actions

def test_bhs_calculation():
    state = {
        "sales_trends": {"weekly_trend": 10.5},
        "rto_score": 25.0,
        "true_roi": 15.5,
        "inventory_health_score": 85.0,
    }
    bhs = calculate_business_health_score(state)
    assert 0 <= bhs <= 100
    assert isinstance(bhs, float)

def test_bhs_zero_defaults():
    state = {}
    bhs = calculate_business_health_score(state)
    assert 0 <= bhs <= 100

def test_priority_actions_high_rto():
    state = {
        "rto_score": 75.0,
        "customer_city": "Quetta",
        "true_roi": 5.0,
    }
    actions = generate_priority_actions(state)
    assert len(actions) >= 1
    assert any("RTO" in a for a in actions)

def test_priority_actions_low_margin():
    state = {
        "rto_score": 10.0,
        "true_roi": 5.0,
    }
    actions = generate_priority_actions(state)
    assert any("Margin" in a for a in actions)

def test_priority_actions_all_good():
    state = {
        "rto_score": 10.0,
        "true_roi": 50.0,
    }
    actions = generate_priority_actions(state)
    assert any("behtar" in a for a in actions)
