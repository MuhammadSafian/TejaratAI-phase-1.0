import { Bot, User, Send, Zap } from "lucide-react";

export function AiDemo() {
    return (
        <section className="py-32 bg-bg-base relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            <Zap className="w-3 h-3" />
                            <span>Neural Interaction</span>
                        </div>
                        <h2 className="text-3xl md:text-[56px] font-heading font-extrabold mb-8 text-text-primary tracking-tighter leading-[1] uppercase">
                            Talk to your <br />
                            <span className="text-primary italic">Business Brain</span>
                        </h2>
                        <p className="text-text-secondary text-lg font-medium leading-relaxed mb-8 max-w-lg">
                            Stop digging through spreadsheets. Just ask TijaratAI. From RTO predictions to inventory alerts, get instant answers in English or Urdu.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Real-time RTO Risk Score for every order",
                                "Automated Ad-Spend optimization tips",
                                "Inventory reorder alerts (ROP) before stockouts",
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    </div>
                                    <span className="text-sm font-bold text-text-primary uppercase tracking-wide">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat UI Visual */}
                    <div className="lg:w-1/2 w-full">
                        <div className="rounded-3xl border border-primary/20 bg-bg-surface shadow-shadow-glow-active overflow-hidden relative">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-border bg-bg-elevated/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-heading font-bold text-text-primary">TijaratAI Assistant</div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Active Neural Link</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-text-muted" />
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="p-6 space-y-8 min-h-[400px]">
                                {/* User Message */}
                                <div className="flex justify-end items-start gap-4">
                                    <div className="max-w-[80%] p-4 rounded-2xl rounded-tr-none bg-primary text-black text-sm font-bold shadow-primary-glow/20">
                                        How is my PostEx performance today?
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-text-secondary" />
                                    </div>
                                </div>

                                {/* AI Response 1 */}
                                <div className="flex justify-start items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="max-w-[85%] p-5 rounded-2xl rounded-tl-none bg-bg-elevated border border-border shadow-sm">
                                        <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">[LOGISTICS_CORE_ANALYSIS]</div>
                                        <p className="text-sm text-text-primary leading-relaxed font-medium">
                                            PostEx has fulfilled 142 orders today. Current delivery success rate is <span className="text-primary font-bold">94.2%</span>.
                                            I've detected a cluster of delays in <span className="text-warning">Lahore Cantt</span> area.
                                        </p>
                                    </div>
                                </div>

                                {/* AI Response 2 (Urdu) */}
                                <div className="flex justify-start items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="max-w-[85%] p-5 rounded-3xl rounded-tl-none bg-primary/5 border border-primary/20 border-dashed">
                                        <p className="text-lg text-text-primary font-urdu leading-relaxed text-right" dir="rtl">
                                            آپ کے سٹاک میں <span className="text-primary">"Blue Kurta - L"</span> ختم ہونے والا ہے۔ میں نے ریمائنڈر سیٹ کر دیا ہے۔
                                        </p>
                                    </div>
                                </div>

                                {/* Typing Indicator */}
                                <div className="flex justify-start items-start gap-4 opacity-50">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex gap-1.5 p-3 rounded-2xl bg-bg-elevated">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-0" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-150" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-bg-base/50 border-t border-border flex items-center gap-4">
                                <div className="flex-1 h-12 rounded-xl bg-bg-surface border border-border px-4 flex items-center text-text-muted text-xs font-medium italic">
                                    Ask about your ROI, Courier performance, or Stock...
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-primary-glow">
                                    <Send className="w-5 h-5 text-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
