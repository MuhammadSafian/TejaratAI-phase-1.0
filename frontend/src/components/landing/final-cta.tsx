import { ArrowRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
    return (
        <section className="py-32 bg-bg-base relative overflow-hidden text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] -z-10 animate-pulse" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-[72px] font-heading font-black mb-8 text-text-primary tracking-tighter leading-[0.95] uppercase animate-fade-slide-up">
                        Ready to scale your <br />
                        <span className="text-primary italic">e-commerce with AI?</span>
                    </h2>

                    <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-slide-up stagger-1">
                        Join 1,000+ Pakistani sellers who are already using TijaratAI to grow faster, reduce RTO, and maximize profit.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-slide-up stagger-2">
                        <Button size="lg" className="h-16 px-12 text-sm font-heading font-bold uppercase tracking-[0.2em] rounded-full shadow-primary-glow animate-pulse-glow group" asChild>
                            <Link href="/auth/sign-up">
                                Get Started Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="ghost" className="h-16 px-12 text-sm font-heading font-bold uppercase tracking-widest text-primary border border-primary/20 hover:bg-primary/5 rounded-full transition-all" asChild>
                            <Link href="#demo">Book a Demo</Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-slide-up stagger-3">
                        {[
                            "Free 14-day trial",
                            "No credit card required",
                            "Cancel anytime"
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                                <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                                <span>{badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
