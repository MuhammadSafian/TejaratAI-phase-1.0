export const mockDashboardStats = [
    { label: "Business Health Score", value: "78.4", trend: "+2.5%", icon: "Activity", isBHS: true },
    { label: "Today's Sales", value: "PKR 12,450", trend: "+12.5%", icon: "DollarSign" },
    { label: "True ROI", value: "18.5%", trend: "+1.2%", icon: "Percent" },
    { label: "RTO Rate", value: "12.2%", trend: "-1.1%", icon: "ArrowDownLeft" },
];

export const mockBHSBreakdown = [
    { factor: "Sales Momentum", score: 85, weight: 0.25 },
    { factor: "RTO Control", score: 72, weight: 0.25 },
    { factor: "Margin Health", score: 65, weight: 0.20 },
    { factor: "Inventory Health", score: 90, weight: 0.15 },
    { factor: "Cash Flow", score: 70, weight: 0.15 },
];

export const mockPriorityActions = [
    { id: 1, text: "⚠️ Karachi ke orders mein RTO zyada — advance payment ya confirmation lein", type: "warning" },
    { id: 2, text: "📦 'Smart Watch Z2' — 3 din mein khatam. 50 units order karein", type: "info" },
    { id: 3, text: "💰 Margin bahut kam hai — COGS ya shipping review karein", type: "critical" },
];

export const mockAgentStatus = [
    { name: "Sales Agent", status: "Idle", lastRun: "15 mins ago", color: "text-emerald-500" },
    { name: "Inventory Agent", status: "Running", lastRun: "Just now", color: "text-blue-500" },
    { name: "Logistics Agent", status: "Idle", lastRun: "1 hr ago", color: "text-emerald-500" },
    { name: "Supervisor", status: "Idle", lastRun: "1 hr ago", color: "text-emerald-500" },
];

export const mockROIFactors = [
    { name: "COGS (Cost of Goods)", amount: "PKR 1,200", percentage: "45%" },
    { name: "Shipping (Base)", amount: "PKR 250", percentage: "9%" },
    { name: "Ad Spend (Attributed)", amount: "PKR 350", percentage: "13%" },
    { name: "RTO Penalty (Weighted)", amount: "PKR 180", percentage: "7%" },
    { name: "Packaging & Handling", amount: "PKR 50", percentage: "2%" },
    { name: "Platform Commission", amount: "PKR 125", percentage: "5%" },
    { name: "Operation Overhead", amount: "PKR 90", percentage: "3%" },
    { name: "Payment Processing Fee", amount: "PKR 45", percentage: "1.5%" },
    { name: "Warehouse Storage", amount: "PKR 30", percentage: "1%" },
    { name: "Return Shipping Buffer", amount: "PKR 65", percentage: "2.5%" },
    { name: "Marketing Discounts", amount: "PKR 100", percentage: "4%" },
    { name: "Gateway Markup", amount: "PKR 20", percentage: "0.5%" },
];

export const mockRTOSignals = [
    { id: "phone_previous_return", label: "Previous Return History", weight: "+25", status: "High Risk" },
    { id: "address_incomplete", label: "Incomplete Address Validation", weight: "+15", status: "Warning" },
    { id: "order_time_odd_hours", label: "Odd Hours Order Pattern", weight: "+10", status: "Notice" },
    { id: "order_high_value_cod", label: "High Value COD Threshold", weight: "+15", status: "Warning" },
    { id: "city_high_rto_courier", label: "City-Courier Historical RTO", weight: "+15", status: "Critical" },
    { id: "phone_no_history", label: "New Phone Number (No History)", weight: "+5", status: "Neutral" },
    { id: "address_rural_remote", label: "Rural/Remote Area Delivery", weight: "+10", status: "Warning" },
    { id: "order_multiple_same_day", label: "Same-Day Multiple Attempts", weight: "+20", status: "Critical" },
    { id: "address_validated", label: "House/Street Exact Match", weight: "-10", status: "Verified" },
    { id: "phone_verified_buyer", label: "White-labeled Trusted Buyer", weight: "-15", status: "Safe" },
    { id: "order_price_mismatch", label: "Product-Income Parity Gap", weight: "+12", status: "Warning" },
    { id: "first_order_high_value", label: "First-Time High Value Order", weight: "+8", status: "Notice" },
    { id: "city_low_rto_courier", label: "City-Courier Success Route", weight: "-10", status: "Optimized" },
    { id: "repeated_fake_order", label: "Known Bot/Fake Pattern", weight: "+35", status: "Critical" },
];

export const mockSalesData = [
    { month: "Jan", sales: 45000, profit: 12000, adSpend: 5000 },
    { month: "Feb", sales: 52000, profit: 15000, adSpend: 6000 },
    { month: "Mar", sales: 48000, profit: 11000, adSpend: 5500 },
    { month: "Apr", sales: 61000, profit: 19000, adSpend: 7000 },
    { month: "May", sales: 55000, profit: 14000, adSpend: 6200 },
    { month: "Jun", sales: 67000, profit: 22000, adSpend: 8000 },
    { month: "Jul", sales: 72000, profit: 25000, adSpend: 8500 },
];

export const mockWeeklySales = [
    { day: "Mon", orders: 12, revenue: 4500 },
    { day: "Tue", orders: 18, revenue: 6200 },
    { day: "Wed", orders: 15, revenue: 5100 },
    { day: "Thu", orders: 22, revenue: 7800 },
    { day: "Fri", orders: 30, revenue: 11000 },
    { day: "Sat", orders: 45, revenue: 15000 },
    { day: "Sun", orders: 38, revenue: 12500 },
];

export const mockLogsPerformance = [
    { id: 1, courier: "TCS", orders: 450, rto: "12%", roi: "18%", status: "Recommended" },
    { id: 2, courier: "Leopards", orders: 320, rto: "15%", roi: "15%", status: "Stable" },
    { id: 3, courier: "PostEx", orders: 180, rto: "8%", roi: "22%", status: "Best ROI" },
    { id: 4, courier: "Trax", orders: 150, rto: "18%", roi: "12%", status: "Review" },
];

export const mockInventoryProducts = [
    { id: 1, name: "Wireless Earbuds", sku: "EA-102", stock: 85, price: "2,450", rop: 30, velocity: 5.2, deadStock: false, status: "In Stock" },
    { id: 2, name: "Smart Watch Z2", sku: "SW-099", stock: 12, price: "2,400", rop: 25, velocity: 8.4, deadStock: false, status: "Low Stock" },
    { id: 3, name: "Cotton T-Shirt", sku: "TS-551", stock: 145, price: "400", rop: 40, velocity: 2.1, deadStock: false, status: "In Stock" },
    { id: 4, name: "Leather Wallet", sku: "LW-112", stock: 3, price: "950", rop: 15, velocity: 0.5, deadStock: true, status: "Dead Stock" },
    { id: 5, name: "Bluetooth Speaker", sku: "BS-004", stock: 0, price: "3,500", rop: 20, velocity: 1.2, deadStock: false, status: "Out of Stock" },
];

export const mockInventoryKPIs = {
    totalSKUs: "248",
    inStock: "198",
    lowStock: "35",
    outOfStock: "15"
};

export const mockAllOrders = [
    { id: "#ORD-7241", customer: "Ahmed Khan", city: "Karachi", amount: "PKR 2,450", rtoScore: 25, rtoRisk: "Low", status: "New", date: "Mar 6, 2026" },
    { id: "#ORD-7240", customer: "Sara Ali", city: "Lahore", amount: "PKR 4,800", rtoScore: 65, rtoRisk: "High", status: "Processing", date: "Mar 6, 2026" },
    { id: "#ORD-7239", customer: "Bilal Sheikh", city: "Islamabad", amount: "PKR 1,200", rtoScore: 15, rtoRisk: "Low", status: "Shipped", date: "Mar 6, 2026" },
    { id: "#ORD-7238", customer: "Zoya Malik", city: "Peshawar", amount: "PKR 9,300", rtoScore: 45, rtoRisk: "Medium", status: "Delivered", date: "Mar 5, 2026" },
    { id: "#ORD-7237", customer: "Usman Qureshi", city: "Multan", amount: "PKR 3,500", rtoScore: 82, rtoRisk: "High", status: "Shipped", date: "Mar 5, 2026" },
];

export const mockRecentOrders = mockAllOrders.slice(0, 5);

export const mockSalesKPIs = {
    totalRevenue: "PKR 145,200",
    itemsSold: "1,248",
    avgOrderValue: "PKR 116",
    totalCustomers: "892"
};

export const mockSalesByCategory = [
    { name: "Electronics", value: 42 },
    { name: "Fashion", value: 22 },
    { name: "Home", value: 15 },
    { name: "Sports", value: 12 },
    { name: "Accessories", value: 9 },
];

export const mockAIInsights = [
    { id: 1, title: "Optimize Ad Spend", description: "Decrease budget on 'Old Stock FB' as ROAS fell below 1.5x.", category: "Ads", impact: "High" },
    { id: 2, title: "Restock Warning", description: "Smart Watch Z2 likely to stock out in 3 days based on current velocity.", category: "Inventory", icon: "Package", impact: "High" },
    { id: 3, title: "Dynamic Pricing", description: "Increase price of 'Premium Socks' by 5% due to high conversion rates.", category: "Pricing", impact: "Medium" },
];
