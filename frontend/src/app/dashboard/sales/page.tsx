"use client";

import { useDashboardData } from "@/hooks/use-data";
import {
    TrendingUp,
    ArrowUpRight,
    Zap,
    ShoppingCart,
    Users,
    DollarSign,
    Loader2,
    BarChart3,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalesChart } from "@/components/dashboard/sales-chart";

export default function SalesPage() {
    const { stats, salesChart, loading } = useDashboardData();

    if (loading && stats.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-[#94a3b8]">Syncing Sales Intelligence...</p>
            </div>
        );
    }

    const revenueStat = stats.find(s => s.label === "Today's Sales") || { value: "PKR 0", trend: "0%" };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[32px] font-heading font-bold tracking-tight mb-2 text-text-primary">Sales Analytics</h1>
                    <div className="text-text-secondary text-sm flex items-center gap-2">
                        Real-time revenue tracking and margin analysis
                        <Badge variant="success" className="text-[10px] h-5 uppercase font-bold italic border-primary/30 text-primary">Live Node</Badge>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5 uppercase text-[10px] font-black tracking-widest">
                        Download Report
                    </Button>
                    <Button className="gap-2 bg-primary text-background hover:bg-primary/90 uppercase text-[10px] font-black tracking-widest">
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[11px] font-medium uppercase tracking-widest text-text-secondary">Gross Revenue (Today)</CardDescription>
                        <CardTitle className="text-[32px] font-mono font-bold text-text-primary">{revenueStat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-primary">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-xs font-bold">{revenueStat.trend} vs yesterday</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShoppingCart className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Net Profit Margin</CardDescription>
                        <CardTitle className="text-3xl font-black text-white">18.5%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-primary">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-bold">+1.2% point lift</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-[#0a0a0a] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Customer LTV</CardDescription>
                        <CardTitle className="text-3xl font-black text-white">PKR 8.2k</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-primary/60">
                            <Zap className="w-4 h-4" />
                            <span className="text-xs font-bold">AI Optimized</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart data={salesChart} />
                </div>

                <div className="space-y-6">
                    <Card className="border-primary/30 bg-primary/[0.03] shadow-[0_0_30px_-15px_rgba(16,185,129,0.4)] overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 border-b border-white/5 bg-primary/5 py-4">
                            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                                <Zap className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                            <CardTitle className="text-white text-xs font-black uppercase tracking-widest italic">Sales Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-2">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Conversion Optimization</span>
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed font-bold">
                                    Lahore region is seeing <span className="text-primary italic">15% higher conversion</span> on mobile. Scaling ads...
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-2">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Basket Analysis</span>
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed font-bold">
                                    AOV is boosted by <span className="text-primary">PKR 450</span> when "Fast Shipping" is highlighted.
                                </p>
                            </div>
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 py-2 h-auto group bg-white/[0.01]">
                                Full Strategy <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-bg-surface overflow-hidden">
                        <CardHeader className="py-4">
                            <CardTitle className="text-text-primary text-xs font-heading font-bold uppercase tracking-widest">Revenue Forecast</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-text-secondary font-bold">Projected Week-End</span>
                                <span className="text-sm font-mono font-bold text-text-primary">PKR 1.2M</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest text-center">On track for 15% WoW growth</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
