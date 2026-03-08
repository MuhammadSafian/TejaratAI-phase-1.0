"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesChart({ data }: { data: any[] }) {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border bg-bg-surface overflow-hidden">
            <CardHeader className="border-b border-border bg-bg-base/50">
                <CardTitle className="text-sm font-heading font-bold uppercase tracking-widest text-text-primary">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] pt-8 px-2 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-heading)' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                            tickFormatter={(value) => `PKR ${value / 1000}K`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-elevated)',
                                borderColor: 'var(--border)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                fontFamily: 'var(--font-heading)'
                            }}
                            itemStyle={{ color: 'var(--primary)' }}
                            cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="var(--primary)"
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            strokeWidth={4}
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="var(--primary-glow)"
                            fillOpacity={0}
                            strokeWidth={2}
                            strokeDasharray="6 6"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
