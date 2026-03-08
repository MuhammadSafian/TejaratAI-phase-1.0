import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
    mockDashboardStats,
    mockSalesData,
    mockRecentOrders,
    mockInventoryProducts,
    mockLogsPerformance,
    mockRTOSignals
} from "@/lib/mock-data";

export function useDashboardData() {
    const [stats, setStats] = useState<any[]>([]);
    const [salesChart, setSalesChart] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, chartRes, ordersRes] = await Promise.all([
                api.get("/seller/{seller_id}/dashboard-stats").catch(() => ({ data: mockDashboardStats })),
                api.get("/seller/{seller_id}/sales-chart").catch(() => ({ data: mockSalesData })),
                api.get("/seller/{seller_id}/recent-orders").catch(() => ({ data: mockRecentOrders }))
            ]);

            setStats(statsRes.data);
            setSalesChart(chartRes.data);
            setRecentOrders(ordersRes.data);
        } catch (err: any) {
            console.error("Dashboard fetch error:", err);
            setStats(mockDashboardStats);
            setSalesChart(mockSalesData);
            setRecentOrders(mockRecentOrders);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { stats, salesChart, recentOrders, loading, error, refetch: fetchData };
}

export function useInventory() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await api.get("/seller/{seller_id}/inventory").catch(() => ({ data: mockInventoryProducts }));
            setProducts(res.data);
        } catch (err: any) {
            console.error("Inventory fetch error:", err);
            setProducts(mockInventoryProducts);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return { products, loading, error, refetch: fetchInventory };
}

export function useLogistics() {
    const [performance, setPerformance] = useState<any[]>([]);
    const [signals, setSignals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/seller/{seller_id}/logistics").catch(() => ({
                data: { performance: mockLogsPerformance, signals: mockRTOSignals }
            }));
            setPerformance(res.data.performance || mockLogsPerformance);
            setSignals(res.data.signals || mockRTOSignals);
        } catch (err: any) {
            console.error("Logistics fetch error:", err);
            setPerformance(mockLogsPerformance);
            setSignals(mockRTOSignals);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { performance, signals, loading, error, refetch: fetchData };
}
