"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ShoppingBag,
    Truck,
    Cpu,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    Zap,
    Globe,
    Layers
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
    { id: 1, title: "Identity", description: "Select your e-commerce nexus", icon: ShoppingBag },
    { id: 2, title: "Logistics", description: "Bridge your delivery protocols", icon: Truck },
    { id: 3, title: "AI Cluster", description: "Initialize neural command", icon: Cpu },
];

const STORES = [
    { id: 'daraz', name: 'Daraz', icon: 'D', color: 'bg-[#FF6000]' },
    { id: 'shopify', name: 'Shopify', icon: 'S', color: 'bg-[#95BF47]' },
    { id: 'woo', name: 'WooCommerce', icon: 'W', color: 'bg-[#96588A]' }
];

const COURIERS = [
    { id: 'tcs', name: 'TCS', color: 'bg-red-600' },
    { id: 'leopards', name: 'Leopards', color: 'bg-yellow-500 text-black' },
    { id: 'postex', name: 'PostEx', color: 'bg-blue-600' },
    { id: 'trax', name: 'Trax', color: 'bg-orange-600' },
    { id: 'blueex', name: 'BlueEx', color: 'bg-blue-800' }
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [selectedCourier, setSelectedCourier] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#080C0A] flex items-center justify-center p-6 selection:bg-primary/30 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                {/* Stepper */}
                <div className="flex justify-between relative px-20">
                    <div className="absolute top-5 left-20 right-20 h-[1px] bg-white/5 -z-10" />
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep >= step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-3">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                        isActive
                                            ? "border-primary bg-primary/10 shadow-primary-glow"
                                            : "border-white/5 bg-bg-surface text-white/20"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                    ) : (
                                        <Icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-white/20")} />
                                    )}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className={cn("text-[10px] font-heading font-black uppercase tracking-[0.2em] italic", isActive ? "text-primary text-glow-primary" : "text-white/20")}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Card className="border-border bg-bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden rounded-[32px]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                    <CardHeader className="text-center pt-12">
                        <CardTitle className="text-3xl font-heading font-black tracking-tighter text-text-primary italic">
                            {steps[currentStep - 1].title.toUpperCase()} <span className="text-primary not-italic">NEXUS</span>
                        </CardTitle>
                        <CardDescription className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-muted mt-2">
                            {steps[currentStep - 1].description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="min-h-[400px] flex flex-col items-center justify-center px-12 py-8">
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                                {STORES.map((store) => (
                                    <div
                                        key={store.id}
                                        onClick={() => setSelectedStore(store.id)}
                                        className={cn(
                                            "group p-8 rounded-[24px] border transition-all duration-500 cursor-pointer flex flex-col items-center gap-6 relative overflow-hidden",
                                            selectedStore === store.id
                                                ? "border-primary bg-primary/5 shadow-glow-active"
                                                : "border-border bg-bg-elevated/50 hover:border-primary/30 hover:bg-bg-elevated shadow-glow-subtle"
                                        )}
                                    >
                                        <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl transition-all duration-500 group-hover:scale-110", store.color)}>
                                            {store.icon}
                                        </div>
                                        <span className={cn("text-xs font-heading font-black uppercase tracking-[0.2em]", selectedStore === store.id ? "text-primary" : "text-text-secondary")}>
                                            {store.name}
                                        </span>
                                        {selectedStore === store.id && (
                                            <div className="absolute top-4 right-4 animate-pulse">
                                                <Zap className="w-4 h-4 text-primary fill-primary shadow-primary-glow" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                                {COURIERS.map((courier) => (
                                    <div
                                        key={courier.id}
                                        onClick={() => setSelectedCourier(courier.id)}
                                        className={cn(
                                            "group p-6 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col items-center gap-4 relative",
                                            selectedCourier === courier.id
                                                ? "border-primary bg-primary/5 shadow-glow-active"
                                                : "border-border bg-bg-elevated/50 hover:border-primary/30"
                                        )}
                                    >
                                        <div className={cn("w-full aspect-square rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-tighter text-white text-center px-2 shadow-lg transition-transform group-hover:scale-105", courier.color)}>
                                            {courier.name}
                                        </div>
                                        <span className={cn("text-[10px] font-heading font-bold uppercase tracking-widest", selectedCourier === courier.id ? "text-primary" : "text-text-muted")}>
                                            {courier.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-10 w-full max-w-lg">
                                <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                    <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-primary/30 flex items-center justify-center relative z-10 shadow-primary-glow">
                                        <Cpu className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-xl font-heading font-black text-text-primary uppercase tracking-tight">Neural Core Initialized</p>
                                        <p className="text-xs font-bold text-text-muted uppercase mt-2 tracking-widest">4-Agent Cluster standby for protocol execution</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 px-4">
                                    {[
                                        { label: "Inventory Velocity Tracking", sub: "Auto-synced nexus" },
                                        { label: "Logistics ROI Matrix", sub: "Predictive courier routing" },
                                        { label: "Supervisor Priority Stream", sub: "Real-time Urdu intelligence" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-bg-elevated/50 border border-border group hover:border-primary/30 transition-all duration-300">
                                            <div>
                                                <p className="text-xs font-heading font-black text-text-primary uppercase tracking-wider">{item.label}</p>
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mt-1">{item.sub}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t border-border p-8 bg-bg-elevated/20">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                            className="text-text-muted hover:text-primary font-heading font-bold uppercase text-[11px] tracking-widest h-14 px-8 rounded-2xl transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous Stage
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={(currentStep === 1 && !selectedStore) || (currentStep === 2 && !selectedCourier)}
                                className="bg-primary text-black font-heading font-black uppercase text-[11px] tracking-[0.2em] h-14 px-10 rounded-2xl hover:shadow-primary-glow disabled:opacity-20 disabled:hover:shadow-none transition-all pulse-glow"
                            >
                                Advance Protocol <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button asChild className="bg-primary text-black font-heading font-black uppercase text-[11px] tracking-[0.2em] h-14 px-10 rounded-2xl hover:shadow-primary-glow transition-all pulse-glow">
                                <Link href="/dashboard">
                                    Initialize Dashboard <Zap className="w-4 h-4 ml-2 fill-current" />
                                </Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
