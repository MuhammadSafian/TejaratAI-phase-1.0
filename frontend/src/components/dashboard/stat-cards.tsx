import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    Megaphone,
    Users,
    Activity,
    Percent,
    ArrowDownLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icons = {
    DollarSign,
    ShoppingBag,
    TrendingUp,
    Megaphone,
    Users,
    Activity,
    Percent,
    ArrowDownLeft
};

export function StatCards({ stats }: { stats: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
                const Icon = icons[stat.icon as keyof typeof icons] || DollarSign;
                const isPositive = stat.trend.startsWith("+");
                const isBHS = stat.isBHS;

                return (
                    <Card key={index} className={cn("overflow-hidden relative", isBHS && "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10")}>
                        {isBHS && (
                            <div className="absolute top-4 right-4 px-2 py-0.5 bg-primary/20 text-[10px] font-bold text-primary rounded-[6px] border border-primary/30 uppercase tracking-widest">
                                AI CORE
                            </div>
                        )}
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-[11px] font-medium text-text-secondary uppercase tracking-widest">
                                {stat.label}
                            </CardTitle>
                            {!isBHS && (
                                <div className="w-8 h-8 rounded-lg bg-primary-glow border border-primary/20 flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-primary" />
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mb-3">
                                <div className="text-[32px] font-mono font-bold tracking-tight text-text-primary">{stat.value}</div>
                                {isBHS && <span className="text-xs text-text-muted font-medium">/ 100</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                                    isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                                )}>
                                    {isPositive ? "▲" : "▼"} {stat.trend}
                                </div>
                                <span className="text-[12px] text-text-muted">vs last week</span>
                            </div>
                            {isBHS && (
                                <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${stat.value}%` }}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
