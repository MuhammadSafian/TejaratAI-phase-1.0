"use client";
import { useState } from "react";
import { Plus, Minus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        q: "What platforms does TijaratAI support?",
        a: "TijaratAI currently integrates with Daraz, Shopify, and WooCommerce for store management. For logistics, we support TCS, Leopards Courier, PostEx, Trax, and BlueEx. We are actively adding more integrations including Rider and Call Courier."
    },
    {
        q: "How does the RTO Predictor work?",
        a: "Our RTO Predictor uses a 14-signal scoring system that analyzes factors like customer return history, address completeness, order time patterns, COD amount thresholds, and city-level delivery performance. Each signal is weighted by our AI model to generate a risk score before you dispatch the order."
    },
    {
        q: "Is my business data secure?",
        a: "Yes. All your API keys, credentials, and business data are stored in our encrypted Security Vault. We use AES-256 encryption at rest and TLS 1.3 in transit. We never share your data with third parties, and your store credentials are never visible in plain text — even to our team."
    },
    {
        q: "Can I use TijaratAI if I only sell on one platform?",
        a: "Absolutely. You can start with just one store and one courier. You can always add more connections later as your business grows. The Starter plan is designed exactly for single-store sellers."
    },
    {
        q: "Do you offer a free trial?",
        a: "Yes! All plans come with a 14-day free trial. No credit card is required to get started. You get full access to all features of the plan you choose during the trial period."
    },
    {
        q: "Is the AI available in Urdu?",
        a: "Yes. Our Supervisor Logic AI communicates in Urdu for WhatsApp alerts, business health updates, and order notifications. The dashboard itself is in English but we plan to release a full Urdu interface in 2026."
    },
    {
        q: "What happens if I exceed my plan limits?",
        a: "If you reach your store or message limits on the Starter plan, you will be prompted to upgrade. We never cut off access suddenly — you will always get a 7-day grace period with notifications before any limitations apply."
    },
    {
        q: "How is TijaratAI different from regular analytics tools?",
        a: "Regular tools just show you data. TijaratAI acts on it. Our 4-agent AI system makes real-time decisions — flagging risky orders, recommending courier switches, alerting on stock, and analyzing your true profit margins. It is a business intelligence layer, not just a dashboard."
    }
];

function FAQItem({ faq, isOpen, toggle }: { faq: typeof faqs[0], isOpen: boolean, toggle: () => void }) {
    return (
        <div className={cn("faq-item border-b border-border/50 transition-all", isOpen && "open")}>
            <button
                onClick={toggle}
                className="w-full py-8 flex items-center justify-between text-left group"
            >
                <span className={cn(
                    "text-sm md:text-lg font-heading font-bold uppercase tracking-wide transition-colors duration-300",
                    isOpen ? "text-primary" : "text-text-primary group-hover:text-primary/70"
                )}>
                    {faq.q}
                </span>
                <div className={cn(
                    "w-8 h-8 rounded-lg border border-border flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-primary border-primary text-black" : "bg-bg-elevated text-text-muted"
                )}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <div className="faq-content">
                <p className="pb-8 text-text-secondary text-sm md:text-base font-medium leading-relaxed max-w-4xl">
                    {faq.a}
                </p>
            </div>
        </div>
    );
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-32 bg-transparent relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3 animate-fade-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            <Zap className="w-3 h-3" />
                            <span>Common Queries</span>
                        </div>
                        <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-6 text-text-primary tracking-tighter leading-tight uppercase">Frequently Asked Questions</h2>
                        <p className="text-text-secondary text-base lg:text-lg font-medium leading-relaxed mb-10 max-w-sm">
                            Everything you need to know before getting started. Can't find what you're looking for? Contact our ops team.
                        </p>
                    </div>

                    <div className="lg:w-2/3 animate-fade-slide-up stagger-1">
                        <div className="border-t border-border/50">
                            {faqs.map((faq, i) => (
                                <FAQItem
                                    key={i}
                                    faq={faq}
                                    isOpen={openIndex === i}
                                    toggle={() => setOpenIndex(openIndex === i ? null : i)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
