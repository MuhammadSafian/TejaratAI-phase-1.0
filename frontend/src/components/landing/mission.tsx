import { Shield, Zap, Globe, HeartHandshake } from "lucide-react";

export function Mission() {
    return (
        <section className="py-32 bg-bg-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-10 text-text-primary tracking-tighter leading-[0.95] uppercase">
                            The Intelligence Layer <br />
                            <span className="text-primary italic">for Pakistan E-Commerce</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {[
                                {
                                    title: "Hyper-Local RTO",
                                    desc: "Predicting Cash on Delivery risks using local signals (area, phone history, address quality) specific to PK cities.",
                                    icon: Shield
                                },
                                {
                                    title: "12-Factor Profit",
                                    desc: "Factor in everything from COGS and Shipping to RTO losses. Know your exact P&L down to the last rupee.",
                                    icon: Zap
                                },
                                {
                                    title: "Automated Urdu Ops",
                                    desc: "Our AI speaks the language your customers trust. Automated Urdu WhatsApp alerts for order verification.",
                                    icon: Globe
                                },
                                {
                                    title: "Unified Command",
                                    desc: "Forget 10 dashboard logins. Manage sales, stock, and multiple courier APIs from one neural interface.",
                                    icon: HeartHandshake
                                }
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                                        <item.icon className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-heading font-bold mb-3 text-text-primary uppercase tracking-wide">{item.title}</h3>
                                    <p className="text-text-secondary text-sm font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="rounded-[40px] border border-primary/10 bg-bg-surface p-8 shadow-2xl relative">
                            <div className="absolute -top-6 -left-6 bg-primary text-black px-6 py-3 rounded-2xl font-heading font-black text-xs uppercase tracking-widest shadow-primary-glow">
                                Core Objective
                            </div>
                            <div className="space-y-6 text-text-primary">
                                <p className="text-xl md:text-3xl font-heading font-bold leading-tight italic">
                                    "Our goal is to reduce the average Pakistani seller's RTO losses by 40% using deterministic AI modeling."
                                </p>
                                <div className="pt-6 border-t border-border flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-bg-elevated border border-primary/30" />
                                    <div>
                                        <div className="text-sm font-bold uppercase tracking-widest">TijaratAI Protocol</div>
                                        <div className="text-[10px] text-primary font-bold uppercase">Mission Control • 2026</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
