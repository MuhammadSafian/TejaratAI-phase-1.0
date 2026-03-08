import { ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        description: "Sign up in 30 seconds with your email or Google account. No credit card required to start your free 14-day trial."
    },
    {
        number: "02",
        title: "Connect Your Store & Couriers",
        description: "Link your Daraz, Shopify, or WooCommerce store. Then connect your courier partners — TCS, Leopards, PostEx, Trax, or BlueEx."
    },
    {
        number: "03",
        title: "Initialize the AI Neural Core",
        description: "Our 4-agent AI system activates: inventory velocity tracking, logistics ROI matrix, and real-time Urdu supervisor intelligence all go live."
    },
    {
        number: "04",
        title: "Watch Your Business Scale",
        description: "Get daily AI insights, RTO warnings before dispatch, smart restocking alerts, and profit analysis — all in one command center dashboard."
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-bg-base/50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24 animate-fade-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Zap className="w-3 h-3" />
                        <span>How It Works</span>
                    </div>
                    <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-6 text-text-primary tracking-tighter leading-tight uppercase">From setup to scale in under 10 minutes</h2>
                    <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed mb-10">
                        TijaratAI is built specifically for Pakistani e-commerce sellers. Connect once and let the AI do the heavy lifting.
                    </p>
                    <Button className="h-12 px-8 rounded-full font-heading font-bold uppercase text-[11px] tracking-widest bg-primary text-black hover:scale-105 transition-transform shadow-primary-glow" asChild>
                        <Link href="/auth/sign-up">Start Free Trial</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    {steps.map((step, i) => (
                        <div key={i} className={`flex flex-col items-center text-center group relative animate-fade-slide-up stagger-${i + 1}`}>
                            <div className="w-20 h-20 rounded-2xl bg-bg-surface border border-primary/10 flex items-center justify-center mb-8 shadow-glow-subtle group-hover:shadow-glow-active group-hover:border-primary transition-all duration-500 relative z-10 group-hover:-rotate-3">
                                <span className="text-3xl font-mono font-black text-primary">{step.number}</span>
                            </div>
                            <h3 className="text-lg font-heading font-bold mb-4 text-text-primary uppercase tracking-wide group-hover:text-primary transition-colors">{step.title}</h3>
                            <p className="text-text-secondary leading-relaxed font-medium text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
