import {
    BarChart3,
    Bot,
    Truck,
    Package,
    ShieldCheck,
    Smartphone,
    Layers,
    Target,
    Lock,
    Zap
} from "lucide-react";

const features = [
    {
        title: "4-Agent AI System",
        description: "Sales, Inventory, Logistics, and Supervisor agents powered by LangGraph. They collaborate autonomously to manage your entire business 24/7.",
        icon: Bot,
    },
    {
        title: "RTO Predictor",
        description: "14-signal scoring system that flags risky COD orders before dispatch. Reduces return-to-origin losses by up to 60% using behavioral AI.",
        icon: ShieldCheck,
    },
    {
        title: "12-Factor ROI Calculator",
        description: "Calculate your true profit by factoring in COGS, shipping, ad spend, platform fees, packaging, and overhead — not just gross revenue.",
        icon: BarChart3,
    },
    {
        title: "Smart Inventory",
        description: "AI-powered stock movement prediction and automated reorder point (ROP) tracking. Never go out of stock or overstock again.",
        icon: Package,
    },
    {
        title: "Courier Routing",
        description: "Intelligent routing through 5+ courier partners including TCS, Leopards, and PostEx based on real-time performance and city-level RTO data.",
        icon: Truck,
    },
    {
        title: "WhatsApp Alerts",
        description: "Instant Urdu notifications for orders, low stock alerts, and business health updates via WhatsApp API. Stay informed on the go.",
        icon: Smartphone,
    },
    {
        title: "Multi-Platform Sync",
        description: "Connect Daraz, Shopify, and WooCommerce stores simultaneously. All inventory, orders, and analytics synced in real-time.",
        icon: Layers,
    },
    {
        title: "Ad Spend Optimizer",
        description: "AI analyzes conversion data by city, device, and time window to tell you exactly where to scale and where to cut your ad budget.",
        icon: Target,
    },
    {
        title: "Security Vault",
        description: "All API keys and credentials are encrypted in a secure vault. Two-factor authentication and role-based access for team members.",
        icon: Lock,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-transparent relative">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Zap className="w-3 h-3" />
                        <span>Platform Features</span>
                    </div>
                    <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-6 text-text-primary tracking-tighter leading-tight uppercase">Unified AI Management Suite</h2>
                    <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed">
                        Everything you need to run your Pakistan-based e-commerce business efficiently,
                        all in one platform powered by advanced AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group p-8 rounded-[24px] border border-border bg-bg-surface hover:bg-bg-elevated hover:border-primary transition-all duration-500 shadow-glow-subtle animate-fade-slide-up stagger-${(index % 4) + 1}`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/5 group-hover:bg-primary transition-colors duration-500">
                                <feature.icon className="w-7 h-7 text-primary group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-4 text-text-primary uppercase tracking-wide group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-text-secondary leading-relaxed font-medium text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
