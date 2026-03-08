import { Crown, TrendingUp, Zap, ArrowUpRight, Gauge } from "lucide-react";

const rankings = [
    { name: "PostEx", rto: "8.2%", speed: "24h", score: 98, status: "Peak" },
    { name: "TCS", rto: "12.5%", speed: "48h", score: 85, status: "Stable" },
    { name: "Leopards", rto: "14.1%", speed: "72h", score: 72, status: "Delay" },
    { name: "M&P", rto: "15.8%", speed: "96h", score: 64, status: "Risk" }
];

export function RankingPreview() {
    return (
        <section className="py-32 bg-transparent relative">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-[48px] font-heading font-extrabold mb-6 text-text-primary tracking-tighter uppercase leading-tight">
                            Live Performance <br />
                            <span className="text-primary italic">Leaderboard</span>
                        </h2>
                        <p className="text-text-secondary text-base font-medium max-w-xl mx-auto">
                            TijaratAI ranks every courier in Pakistan based on millions of real-world delivery data points. Stay ahead of the RTO curve.
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-border bg-bg-surface overflow-hidden shadow-2xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 md:grid-cols-5 p-6 bg-bg-elevated/50 border-b border-border text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em]">
                            <div className="col-span-1 md:col-span-2">Partner Node</div>
                            <div className="text-center">RTO Rate</div>
                            <div className="text-center hidden md:block">ETA</div>
                            <div className="text-right">Global Score</div>
                        </div>

                        {/* Ranking Rows */}
                        <div className="divide-y divide-border">
                            {rankings.map((courier, i) => (
                                <div
                                    key={i}
                                    className={`grid grid-cols-4 md:grid-cols-5 p-6 md:p-8 items-center group hover:bg-primary/5 transition-colors ${i === 0 ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${i === 0 ? 'bg-primary text-black' : 'bg-bg-elevated border border-border text-text-secondary'
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm md:text-lg font-heading font-bold text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                                                {courier.name}
                                                {i === 0 && <Crown className="w-4 h-4 text-warning" />}
                                            </div>
                                            <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{courier.status} Protocol</div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-sm md:text-lg font-mono font-bold text-text-primary">{courier.rto}</div>
                                        <div className="text-[9px] text-success font-bold flex items-center justify-center gap-0.5">
                                            <TrendingUp className="w-2.5 h-2.5" /> 2.1% Improved
                                        </div>
                                    </div>

                                    <div className="text-center hidden md:block">
                                        <div className="text-sm md:text-lg font-mono font-bold text-text-secondary">{courier.speed}</div>
                                        <div className="text-[9px] text-text-muted font-bold uppercase">Avg Delivery</div>
                                    </div>

                                    <div className="text-right flex items-center justify-end gap-3">
                                        <div className="hidden sm:block w-24 h-2 bg-bg-elevated rounded-full overflow-hidden border border-border">
                                            <div
                                                className="h-full bg-primary shadow-primary-glow transition-all duration-1000"
                                                style={{ width: `${courier.score}%` }}
                                            />
                                        </div>
                                        <div className="text-sm md:text-xl font-mono font-black text-primary">{courier.score}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Link */}
                        <div className="p-6 bg-bg-elevated/30 border-t border-border flex justify-center">
                            <button className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest hover:gap-3 transition-all">
                                View Full Intelligence Directory <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Floating Info */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-3">
                            <Gauge className="w-5 h-5 text-primary" />
                            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Real-time Data API</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">AI Ranked Hourly</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
