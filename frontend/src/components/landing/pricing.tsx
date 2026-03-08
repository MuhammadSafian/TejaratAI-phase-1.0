"use client";
import { useState } from "react";
import { Check, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Starter",
        priceMonthly: 2999,
        priceYearly: 2499,
        description: "Perfect for new sellers just getting started with their first store.",
        features: [
            { text: "1 Store Connection", included: true },
            { text: "2 Courier Integrations", included: true },
            { text: "Basic RTO Predictor (5 signals)", included: true },
            { text: "Sales Analytics Dashboard", included: true },
            { text: "100 AI Supervisor messages/month", included: true },
            { text: "WhatsApp Alerts", included: false },
            { text: "Multi-Platform Sync", included: false },
            { text: "Advanced ROI Calculator", included: false },
        ],
        cta: "Choose Plan",
        popular: false
    },
    {
        name: "Growth",
        priceMonthly: 7499,
        priceYearly: 5999,
        description: "For growing businesses that need full AI power and multi-platform coverage.",
        features: [
            { text: "3 Store Connections", included: true },
            { text: "All 5 Courier Integrations", included: true },
            { text: "Full RTO Predictor (14 signals)", included: true },
            { text: "Advanced Sales + Margin Analytics", included: true },
            { text: "Unlimited AI Supervisor messages", included: true },
            { text: "WhatsApp Alerts (Urdu)", included: true },
            { text: "Multi-Platform Sync", included: true },
            { text: "12-Factor ROI Calculator", included: true },
        ],
        cta: "Get Started Free",
        popular: true
    },
    {
        name: "Enterprise",
        priceMonthly: 18999,
        priceYearly: 14999,
        description: "For large operations needing team access and custom integrations.",
        features: [
            { text: "Unlimited Store Connections", included: true },
            { text: "All Couriers + Custom APIs", included: true },
            { text: "Custom AI Agent Training", included: true },
            { text: "Team Access (up to 10 users)", included: true },
            { text: "Dedicated Account Manager", included: true },
            { text: "Priority 24/7 Support", included: true },
            { text: "Custom Dashboard Branding", included: true },
            { text: "SLA Guarantee", included: true },
        ],
        cta: "Choose Plan",
        popular: false
    }
];

export function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="py-32 bg-transparent relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Zap className="w-3 h-3" />
                        <span>Pricing Protocols</span>
                    </div>
                    <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-6 text-text-primary tracking-tighter leading-tight uppercase">Simple, transparent pricing</h2>
                    <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed mb-10">
                        No hidden fees. No per-order charges. Just flat monthly pricing.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", !isYearly ? "text-primary" : "text-text-muted")}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-7 rounded-full bg-bg-elevated border border-border relative pricing-toggle"
                        >
                            <div className={cn(
                                "absolute top-1 w-5 h-5 rounded-full bg-primary shadow-primary-glow transition-all duration-300",
                                isYearly ? "left-8" : "left-1"
                            )} />
                        </button>
                        <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2", isYearly ? "text-primary" : "text-text-muted")}>
                            Yearly
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[9px] text-primary border border-primary/20">SAVE 20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={cn(
                                "p-10 rounded-[32px] border bg-bg-surface flex flex-col transition-all duration-500 animate-fade-slide-up",
                                plan.popular ? "border-primary shadow-glow-active lg:scale-105 relative z-10" : "border-border shadow-glow-subtle stagger-" + (i + 1),
                                "hover:border-primary/50 group"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-black font-heading font-black text-[10px] uppercase tracking-[0.2em] shadow-primary-glow">
                                    MOST POPULAR ⚡
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-heading font-black text-text-primary uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{plan.name}</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-4xl font-mono font-black text-text-primary">
                                        PKR {isYearly ? plan.priceYearly.toLocaleString() : plan.priceMonthly.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">/ month</span>
                                </div>
                                <p className="text-text-secondary text-sm font-medium leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className={cn("flex items-center gap-3", !feature.included && "opacity-40")}>
                                        {feature.included ? (
                                            <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={3} />
                                        ) : (
                                            <X className="w-4 h-4 text-text-muted shrink-0" strokeWidth={3} />
                                        )}
                                        <span className="text-xs font-bold text-text-primary uppercase tracking-wide">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-heading font-bold uppercase text-[11px] tracking-widest transition-all",
                                    plan.popular ? "shadow-primary-glow" : "border-primary/20 text-primary hover:bg-primary/5"
                                )}
                                asChild
                            >
                                <Link href="/auth/sign-up">{plan.cta}</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
