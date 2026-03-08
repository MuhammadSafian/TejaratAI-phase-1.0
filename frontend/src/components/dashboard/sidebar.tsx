"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BarChart3,
    Truck,
    Package,
    Settings,
    LogOut,
    Zap
} from "lucide-react";

const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Sales", icon: BarChart3, href: "/dashboard/sales" },
    { label: "Logistics", icon: Truck, href: "/dashboard/logistics" },
    { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#0A0F0C] border-r border-border w-64 pb-4 animate-fade-slide-up shadow-[4px_0_24px_rgba(0,229,160,0.02)]">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_-3px_rgba(0,229,160,0.4)] transition-transform group-hover:scale-105">
                        <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className="text-2xl font-heading font-black tracking-tighter text-white">TijaratAI</span>
                </Link>
            </div>
            <div className="flex-1 px-4 space-y-1.5">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            pathname === route.href
                                ? "text-primary bg-[rgba(0,229,160,0.08)] shadow-[inset_2px_0_0_0_rgba(0,229,160,1)]"
                                : "text-text-secondary hover:bg-white/[0.03] hover:text-white"
                        )}
                    >
                        <route.icon className={cn("w-4 h-4", pathname === route.href ? "text-primary" : "text-[#94a3b8]")} />
                        {route.label}
                    </Link>
                ))}
            </div>
            <div className="px-4 mt-auto">
                <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-white/[0.03] hover:text-destructive transition-all">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
