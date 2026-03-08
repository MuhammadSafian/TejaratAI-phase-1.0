"use client";

import { useEffect } from "react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders";
import { useDashboardData } from "@/hooks/use-data";

import {
    mockPriorityActions,
    mockBHSBreakdown,
    mockAgentStatus
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bot,
    ChevronRight,
    Zap,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { stats, salesChart, recentOrders, loading, refetch } = useDashboardData();

    // Development Helper: Set a dummy seller_id if not present
    useEffect(() => {
        if (!localStorage.getItem("seller_id")) {
            localStorage.setItem("seller_id", "00000000-0000-0000-0000-000000000000");
        }
    }, []);

    if (loading && stats.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-[#94a3b8]">Initializing Neural Link...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[32px] font-heading font-bold tracking-tight mb-2 text-text-primary">Welcome Back, Safian</h1>
                    <p className="text-text-secondary text-sm">TejaratAI 4-Agent Core is active. Your business health is stable.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="gap-2 border-white/10 text-white hover:bg-white/5"
                    >
                        < Zap className="w-4 h-4 text-primary" /> Run Analysis
                    </Button>
                    <Button className="gap-2 bg-primary text-background hover:bg-primary/90">
                        <ShieldCheck className="w-4 h-4" /> Security Vault
                    </Button>
                </div>
            </div>

            <StatCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sales Chart - span 2 */}
                <div className="lg:col-span-2">
                    <SalesChart data={salesChart} />
                </div>

                {/* BHS Breakdown - span 1 */}
                <Card className="flex flex-col border-white/5 bg-[#0a0a0a]">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-white">Health Breakdown</CardTitle>
                        <CardDescription className="text-[#94a3b8]">Weighted factors affecting BHS</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        {mockBHSBreakdown.map((item, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-medium text-[#94a3b8]">
                                    <span>{item.factor}</span>
                                    <span className="opacity-70">{(item.weight * 100).toFixed(0)}% weight</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                                                item.score > 80 ? "bg-primary" : item.score > 60 ? "bg-primary/70" : "bg-primary/40"
                                            )}
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold w-7 text-right text-white">{item.score}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Priority Actions - span 1 */}
                <Card className="flex flex-col border-primary/30 bg-primary/[0.03] shadow-[0_0_30px_-15px_rgba(16,185,129,0.4)] overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-2 border-b border-white/5 bg-primary/5 py-4">
                        <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                            <Bot className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                        <CardTitle className="text-white text-xs font-black uppercase tracking-widest italic">Supervisor Logic</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 pt-4">
                        {mockPriorityActions.map((action) => (
                            <div key={action.id} className="p-3 rounded-xl bg-black border border-white/5 hover:border-primary/50 transition-all cursor-pointer group shadow-sm">
                                <div className="flex gap-3">
                                    <Zap className={cn(
                                        "w-3.5 h-3.5 shrink-0 mt-1",
                                        action.type === 'critical' ? "text-primary animate-pulse" : "text-primary/60"
                                    )} />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[13px] font-bold leading-tight text-white group-hover:text-primary transition-colors">{action.text}</p>
                                        {action.type === 'critical' && (
                                            <p className="text-sm font-urdu leading-loose text-text-secondary pr-2" dir="rtl">
                                                اس آرڈر کو فوری طور پر چیک کریں، رٹرن کا خطرہ ہے۔
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-primary transition-colors py-2 h-auto group bg-white/[0.02]">
                            Optimize All Nodes <ChevronRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RecentOrdersTable orders={recentOrders} />
                </div>

                {/* Agent Status Card */}
                <Card className="border-white/5 bg-[#0a0a0a] overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.01] py-4">
                        <CardTitle className="text-white text-xs font-black uppercase tracking-widest">4-Agent Core Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4 px-4 pb-4">
                        {mockAgentStatus.map((agent, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        agent.status === "Running" ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-primary/20"
                                    )} />
                                    <span className="text-xs font-black text-white group-hover:text-primary transition-colors uppercase tracking-tighter">{agent.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-primary italic">{agent.status}</p>
                                    <p className="text-[8px] font-bold text-[#94a3b8] group-hover:text-white/50">{agent.lastRun}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>


        </div>
    );
}

