"use client";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, ShieldCheck, Bot } from "lucide-react";

interface CounterProps {
    value: string;
    label: string;
    icon: any;
    suffix?: string;
    prefix?: string;
}

function Counter({ value, label, icon: Icon, suffix = "", prefix = "" }: CounterProps) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Simple numeric extraction for animation
    const target = parseInt(value.replace(/[^0-9]/g, ""));

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );

        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const duration = 1800;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
        <div ref={countRef} className="flex flex-col items-center p-8 rounded-2xl bg-bg-surface/30 border border-primary/5 hover:border-primary/20 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-4xl md:text-5xl font-mono font-black text-text-primary mb-2">
                {prefix}{count.toLocaleString()}{suffix}
            </div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{label}</div>
        </div>
    );
}

export function Stats() {
    return (
        <section className="py-24 bg-bg-base border-y border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Counter
                        value="300"
                        suffix="%"
                        label="Avg ROI Boost"
                        icon={TrendingUp}
                    />
                    <Counter
                        value="4500000"
                        prefix="PKR "
                        suffix="+"
                        label="Loss Prevention"
                        icon={ShieldCheck}
                    />
                    <Counter
                        value="1000"
                        suffix="+"
                        label="Stores Powered"
                        icon={Bot}
                    />
                </div>
            </div>
        </section>
    );
}
