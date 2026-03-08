import { Twitter, Linkedin, Instagram, Youtube, Zap } from "lucide-react";
import Link from "next/link";

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
            { label: "Changelog", href: "#" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Contact Us", href: "#" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Refund Policy", href: "#" },
            { label: "Cookie Policy", href: "#" },
        ]
    }
];

export function Footer() {
    return (
        <footer className="pt-24 pb-12 bg-[#050807] border-t border-border/20 text-text-primary">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 mb-20">
                    {/* Brand Column */}
                    <div className="lg:w-1/3">
                        <Link href="/" className="text-3xl font-heading font-black tracking-tighter uppercase flex items-center gap-2 mb-6 group">
                            TijaratAI <span className="text-primary group-hover:scale-125 transition-transform duration-500">⚡</span>
                        </Link>
                        <p className="text-text-secondary text-base font-medium leading-relaxed mb-8 max-w-sm">
                            The AI intelligence layer for Pakistan's e-commerce market. Built to reduce RTO, optimize ad-spend, and grow your profit margins.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10">
                        {footerLinks.map((col, i) => (
                            <div key={i}>
                                <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-8">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <Link href={link.href} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-12 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        © 2026 TijaratAI. Built for Pakistan's E-Commerce. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Network Status: Nominal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
