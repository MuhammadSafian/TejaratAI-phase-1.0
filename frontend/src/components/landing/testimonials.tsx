import { Star, Quote, Zap } from "lucide-react";

const testimonials = [
    {
        name: "Ahmed Raza",
        role: "TechGear Store · Lahore",
        content: "TijaratAI completely changed how I manage my store. The RTO predictor alone saved me over PKR 200,000 last month by flagging risky COD orders before I shipped them.",
        stars: 5
    },
    {
        name: "Sana Malik",
        role: "GlowUp Beauty · Karachi",
        content: "The WhatsApp alerts in Urdu are a game changer. I get instant notifications when stock is low or an order is placed. It feels like having a full-time business manager.",
        stars: 5
    },
    {
        name: "Bilal Khan",
        role: "FastTech Electronics · Islamabad",
        content: "The 12-factor ROI calculator showed me I was actually losing money on some products I thought were profitable. TijaratAI pays for itself in the first week.",
        stars: 5
    },
    {
        name: "Fatima Zahra",
        role: "HomeDecor Hub · Faisalabad",
        content: "Managing three stores on Daraz and Shopify used to be a nightmare. Now TijaratAI syncs everything automatically. My team spends 70% less time on operations.",
        stars: 5
    },
    {
        name: "Usman Tariq",
        role: "SportZone PK · Multan",
        content: "Courier routing feature is brilliant. It automatically picks the best courier for each city based on RTO history. My delivery success rate went from 78% to 91% in 3 weeks.",
        stars: 5
    },
    {
        name: "Aisha Nawaz",
        role: "KidsWorld Store · Rawalpindi",
        content: "I was skeptical about AI tools but TijaratAI is different. It gives advice in Urdu and actually understands how Pakistani e-commerce works. Highly recommended.",
        stars: 5
    }
];

export function Testimonials() {
    return (
        <section className="py-32 bg-bg-base/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,160,0.03),transparent)] -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Zap className="w-3 h-3" />
                        <span>What Sellers Say</span>
                    </div>
                    <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-6 text-text-primary tracking-tighter leading-tight uppercase">Trusted by 1,000+ Pakistani sellers</h2>
                    <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed">
                        From Lahore to Karachi, TijaratAI is helping e-commerce businesses scale smarter.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className={`p-8 rounded-[32px] border border-border bg-bg-surface hover:border-primary/30 transition-all duration-500 shadow-glow-subtle flex flex-col animate-fade-slide-up stagger-${(i % 4) + 1}`}
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.stars)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                                ))}
                            </div>

                            <div className="relative mb-6">
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 -z-1" />
                                <p className="text-text-primary text-base font-medium leading-relaxed relative z-10">
                                    "{t.content}"
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-border flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-bg-elevated border border-primary/20 flex items-center justify-center font-heading font-black text-primary text-xs">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-heading font-bold text-text-primary uppercase tracking-wide">{t.name}</div>
                                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
