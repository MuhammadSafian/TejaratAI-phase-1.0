"use client";

import { useLogistics } from "@/hooks/use-data";
import {
    Truck,
    Zap,
    MapPin,
    ShieldAlert,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LogisticsPage() {
    const { performance, signals, loading } = useLogistics();

    if (loading && performance.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-[#94a3b8]">Optimizing Supply Chains...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[32px] font-heading font-bold tracking-tight mb-2 text-text-primary">Logistics Command</h1>
                    <div className="text-text-secondary text-sm flex items-center gap-2">
                        RTO minimization and courier performance matrix
                        <Badge variant="success" className="text-[10px] h-5 uppercase font-bold italic border-primary/30 text-primary">Neural Hub</Badge>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 text-[12px] font-heading">
                        Courier Settings
                    </Button>
                    <Button className="gap-2 bg-primary text-black font-heading font-bold uppercase text-[12px]">
                        Auto-Dispatch: ON
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-border bg-bg-surface overflow-hidden">
                    <CardHeader className="py-4 border-b border-border">
                        <CardTitle className="text-text-primary text-[12px] font-heading font-bold uppercase tracking-widest">Courier Performance Index</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-bg-base/50">
                                    <tr className="text-[11px] font-bold uppercase tracking-widest text-text-secondary border-b border-border">
                                        <th className="px-6 py-4">Courier</th>
                                        <th className="px-6 py-4">Orders</th>
                                        <th className="px-6 py-4 text-center">RTO Rate</th>
                                        <th className="px-6 py-4 text-center">ROI</th>
                                        <th className="px-6 py-4 text-right pr-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {performance.map((item) => (
                                        <tr key={item.id} className="hover:bg-bg-elevated transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-bg-base border border-border flex items-center justify-center">
                                                        <Truck className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <span className="text-sm font-heading font-bold text-text-primary uppercase">{item.courier}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono font-bold text-text-primary">{item.orders}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "text-sm font-mono font-bold",
                                                    parseInt(item.rto) > 15 ? "text-danger" : "text-success"
                                                )}>{item.rto}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-mono font-bold text-primary">{item.roi}</td>
                                            <td className="px-6 py-4 text-right pr-6">
                                                <Badge variant={item.status === "Recommended" ? "success" : "warning"} className="text-[10px] font-bold uppercase tracking-tighter shadow-none">
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-primary/30 bg-primary/[0.03] shadow-[0_0_30px_-15px_rgba(16,185,129,0.4)] overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-2 border-b border-white/5 bg-primary/5 py-4">
                            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                                <ShieldAlert className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                            <CardTitle className="text-white text-xs font-black uppercase tracking-widest italic">AI RTO Signals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 px-4 pb-4">
                            {signals.map((signal: any) => (
                                <div key={signal.id} className="p-3 rounded-xl bg-black border border-white/5 hover:border-primary/50 transition-all cursor-pointer group shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3">
                                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60 group-hover:text-primary transition-colors" />
                                            <div>
                                                <p className="text-[11px] font-bold text-white leading-tight">{signal.label}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] mt-1 opacity-50 group-hover:opacity-100 transition-opacity">Neural Weight: {signal.weight}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase h-5">{signal.status}</Badge>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-primary transition-colors py-2 h-auto group bg-white/[0.02]">
                                Global RTO Database <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-[#0a0a0a] overflow-hidden">
                        <CardHeader className="py-4">
                            <CardTitle className="text-white text-xs font-black uppercase tracking-widest">Smart Dispatcher</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#94a3b8] font-bold">Auto-Routed Orders</span>
                                <span className="text-sm font-black text-white">85%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[85%] h-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest text-center">Saving PKR 12k/week in RTOs</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
