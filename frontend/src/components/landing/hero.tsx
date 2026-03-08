import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, TrendingUp, ShieldCheck } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 mesh-gradient-bg overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface/50 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-10 animate-fade-slide-up">
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI-Powered E-Commerce Management</span>
                </div>

                <h1 className="text-5xl md:text-[84px] font-heading font-extrabold tracking-tighter mb-8 leading-[0.95] text-text-primary animate-fade-slide-up stagger-1">
                    Grow your e-commerce <br />
                    <span className="text-primary italic">with AI intelligence</span>
                </h1>

                <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-slide-up stagger-2">
                    Connect your store, minimize RTO, optimize ad spend, and get real-time AI decisions — all built for Pakistan's e-commerce market.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-fade-slide-up stagger-3">
                    <Button size="lg" className="h-14 px-10 text-sm font-heading font-bold uppercase tracking-widest rounded-full shadow-primary-glow animate-pulse-glow group" asChild>
                        <Link href="/auth/sign-up">
                            Get Started Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="ghost" className="h-14 px-10 text-sm font-heading font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-full transition-all flex items-center gap-2" asChild>
                        <Link href="#demo">
                            <span className="text-lg">▶</span> Watch Demo
                        </Link>
                    </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-8 mb-24 animate-fade-slide-up stagger-4">
                    {[
                        "No credit card required",
                        "Free 14-day trial",
                        "Setup in 5 minutes"
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                            <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                            <span>{badge}</span>
                        </div>
                    ))}
                </div>

                {/* Dashboard Mockup - Floating Card */}
                <div className="relative max-w-5xl mx-auto mt-12 animate-in zoom-in-95 slide-in-from-bottom-10 duration-1000">
                    <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-20" />
                    <div className="rounded-2xl border border-primary/20 bg-bg-surface/90 backdrop-blur-3xl shadow-glow-active overflow-hidden relative group">
                        {/* Browser Bar */}
                        <div className="h-10 bg-bg-elevated/50 border-b border-border flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                            </div>
                            <div className="flex-1 max-w-sm mx-auto h-6 rounded-md bg-bg-base/50 border border-border flex items-center justify-center">
                                <span className="text-[10px] text-text-muted font-mono">app.tijaratai.com/dashboard</span>
                            </div>
                        </div>

                        {/* Mock Content */}
                        <div className="p-8 md:p-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {[
                                    { label: "BHS", value: "78.4", color: "text-primary" },
                                    { label: "DAILY SALES", value: "PKR 12,450", color: "text-text-primary" },
                                    { label: "ROI", value: "18.5%", color: "text-primary" },
                                    { label: "RTO RATE", value: "12.2%", color: "text-warning" }
                                ].map((kpi, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-bg-base/50 border border-border text-left">
                                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{kpi.label}</div>
                                        <div className={`text-lg font-mono font-bold ${kpi.color}`}>{kpi.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Mini Bar Chart Mockup */}
                            <div className="h-32 flex items-end gap-2 px-4 border-b border-border/50 pb-2">
                                {[40, 65, 45, 90, 55, 75, 60, 85, 40, 70, 50, 95].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-primary/20 rounded-t-sm border-t border-x border-primary/30 group-hover:bg-primary/40 transition-all duration-500"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-4">
                                <Zap className="w-5 h-5 text-primary animate-pulse" />
                                <span className="text-xs font-heading font-bold uppercase tracking-widest text-text-secondary">AI Neural Core Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Check } from "lucide-react";
