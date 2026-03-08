"use client";

import { mockAIInsights } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Zap, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle, ChevronRight, Activity, Search } from "lucide-react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { cn } from "@/lib/utils";

export default function AIInsightsPage() {
    const stats = [
        { label: "Optimization Score", value: "78/100", trend: "+5", icon: "TrendingUp" },
        { label: "Potential Revenue", value: "PKR 12,450", trend: "High", icon: "DollarSign" },
        { label: "Automated Actions", value: "128", trend: "+12", icon: "Zap" },
        { label: "Time Saved", value: "42 hrs", trend: "+4", icon: "Bot" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="mb-8">
                <h1 className="text-[32px] font-heading font-bold tracking-tight mb-2 flex items-center gap-3 text-text-primary uppercase">
                    <div className="w-12 h-12 rounded-xl bg-primary-glow border border-primary/20 flex items-center justify-center shadow-primary-glow">
                        <Bot className="w-7 h-7 text-primary" />
                    </div>
                    Neural Command
                </h1>
                <p className="text-text-secondary text-sm">Live multi-agent intelligence stream and performance metrics.</p>
            </div>

            <StatCards stats={stats} />

            {/* Agent Decision Chain - Visualization of LangGraph Backend */}
            <Card className="border-primary/20 bg-primary/[0.02] overflow-hidden shadow-primary-glow/5">
                <CardHeader className="border-b border-border bg-primary/5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary animate-pulse" />
                            <CardTitle className="text-text-primary text-[12px] font-heading font-bold uppercase tracking-widest">Active Reasoning Chain</CardTitle>
                        </div>
                        <Badge variant="success" className="px-3 font-bold uppercase tracking-widest text-[10px]">
                            Processing Order #8921
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="py-8 px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />

                        {[
                            { name: "Supervisor", icon: Bot, task: "Routing Request", status: "Done" },
                            { name: "Sales Agent", icon: TrendingUp, task: "Analyzing Trends", status: "Done" },
                            { name: "Inv Agent", icon: Search, task: "Stock Validation", status: "Processing" },
                            { name: "Logistics", icon: Zap, task: "RTO Prediction", status: "Queued" }
                        ].map((agent, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 relative z-10 w-full lg:w-auto">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                                    agent.status === "Done" ? "bg-primary border-primary shadow-primary-glow" :
                                        agent.status === "Processing" ? "bg-bg-base border-primary animate-pulse shadow-primary-glow" :
                                            "bg-bg-base border-border"
                                )}>
                                    <agent.icon className={cn(
                                        "w-6 h-6",
                                        agent.status === "Done" ? "text-black" : "text-primary"
                                    )} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest font-heading">{agent.name}</p>
                                    <p className="text-[10px] font-medium text-text-secondary uppercase">{agent.task}</p>
                                </div>
                                {i < 3 && <ArrowRight className="lg:hidden text-primary/30" />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAIInsights.map((insight) => (
                    <Card key={insight.id} className="flex flex-col border-border bg-bg-surface hover:border-primary/30 transition-all group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border bg-bg-base/20">
                            <Badge variant={insight.impact === "High" ? "success" : "neutral"} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                                {insight.impact} Reach
                            </Badge>
                            <Zap className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </CardHeader>
                        <CardContent className="flex-1 pt-5">
                            <CardTitle className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors font-heading mb-2">{insight.title}</CardTitle>
                            <p className="text-[12px] font-medium text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                                {insight.description}
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest border-border hover:border-primary/50 text-text-secondary hover:text-primary group/btn bg-bg-base/40 rounded-[8px] font-heading">
                                Deploy Optimization
                                <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-border bg-bg-surface overflow-hidden">
                    <CardHeader className="border-b border-border bg-bg-base/50 py-4">
                        <CardTitle className="flex items-center gap-2 text-text-primary text-[12px] font-heading font-bold tracking-widest uppercase">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            4-Agent Cluster Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6 px-6">
                        {[
                            { name: "Sales Optimizer", mode: "Deep Trend", color: "text-primary", icon: TrendingUp },
                            { name: "Ad Budget Vault", mode: "ROAS Guard", color: "text-primary", icon: Zap },
                            { name: "Inventory Predictor", mode: "Velocity Sync", color: "text-text-muted", icon: Search }
                        ].map((agent, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-base/30 hover:bg-bg-elevated hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
                                        <agent.icon className={cn("w-5 h-5", agent.color)} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-sm uppercase tracking-tight group-hover:text-primary transition-colors font-heading">{agent.name}</p>
                                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{agent.mode}</p>
                                    </div>
                                </div>
                                <Badge variant="success" className="font-bold uppercase text-[9px] tracking-widest py-1">Live</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-border bg-bg-surface overflow-hidden">
                    <CardHeader className="border-b border-border bg-bg-base/50 py-4">
                        <CardTitle className="text-text-primary text-[12px] font-heading font-bold tracking-widest uppercase">Neural Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 px-8">
                        <div className="relative pl-6 pb-2 border-l-2 border-primary/30 ml-3">
                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary shadow-primary-glow" />
                            <p className="text-[12px] font-bold text-text-primary uppercase tracking-tight font-heading">Budget Pivot Executed</p>
                            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest">FB Ads Cluster / 2h ago</p>
                        </div>
                        <div className="relative pl-6 pb-2 border-l-2 border-border ml-3">
                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-text-muted/20" />
                            <p className="text-[12px] font-bold text-text-secondary uppercase tracking-tight font-heading">Stock Warning Dispatched</p>
                            <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">Inventory Node / 5h ago</p>
                        </div>
                        <div className="relative pl-6 ml-3">
                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary/40" />
                            <p className="text-[12px] font-bold text-text-primary uppercase tracking-tight font-heading">RTO Model Re-calibrated</p>
                            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-widest">Logistics Unit / 1d ago</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
