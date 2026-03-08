import { Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-bg-base">
            {/* Left Brand Panel */}
            <div className="hidden lg:flex w-1/2 bg-[#050505] p-12 flex-col justify-between border-r border-border relative overflow-hidden bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                {/* Glow */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 -z-10" />

                <Link href="/" className="flex items-center gap-2.5 z-10 w-fit">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_rgba(0,229,160,0.5)]">
                        <Zap className="w-6 h-6 text-black fill-black" />
                    </div>
                    <span className="text-2xl font-heading font-black tracking-tighter text-white">TijaratAI</span>
                </Link>

                <div className="z-10 max-w-md">
                    <h1 className="text-4xl font-heading font-bold text-white mb-6 leading-tight">
                        Pakistan's First AI-Powered E-Commerce Intelligence
                    </h1>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-text-secondary text-sm">Reduce RTO rates by up to 40% with predictive AI scoring.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-text-secondary text-sm">Automate inventory syncing across Daraz, Shopify, and WooCommerce.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-text-secondary text-sm">Optimize your courier logic in real-time for maximum ROI.</p>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex items-center gap-4 text-xs font-mono text-text-muted uppercase tracking-wider">
                    <span>Secure Node Active</span>
                    <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                {/* Mobile logo */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="flex items-center gap-2.5 z-10 w-fit">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_rgba(0,229,160,0.5)]">
                            <Zap className="w-4 h-4 text-black fill-black" />
                        </div>
                        <span className="text-xl font-heading font-black tracking-tighter text-white">TijaratAI</span>
                    </Link>
                </div>

                <div className="w-full max-w-[420px] animate-fade-slide-up">
                    {children}
                </div>
            </div>
        </div>
    );
}
