import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border bg-bg-base/80 backdrop-blur-[20px]">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-primary-glow/50 transition-transform group-hover:scale-105">
                        <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className="text-2xl font-heading font-black tracking-tighter text-text-primary uppercase">TijaratAI</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                    <Link href="#features" className="nav-link-hover">Features</Link>
                    <Link href="#how-it-works" className="nav-link-hover">How It Works</Link>
                    <Link href="#pricing" className="nav-link-hover">Pricing</Link>
                    <Link href="#faq" className="nav-link-hover">FAQ</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/auth/login" className="text-xs font-bold text-text-primary uppercase tracking-widest hover:text-primary transition-colors">
                        Sign In
                    </Link>
                    <Button variant="default" size="sm" className="rounded-full px-6 font-heading font-bold uppercase text-[10px] tracking-widest shadow-primary-glow/20 animate-pulse-glow" asChild>
                        <Link href="/auth/sign-up">Get Started Free</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
