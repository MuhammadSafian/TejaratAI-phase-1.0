"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Bell,
    Shield,
    Globe,
    Database,
    Cloud,
    ChevronRight,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-[32px] font-heading font-bold tracking-tight mb-2 text-text-primary uppercase">System Configuration</h1>
                <p className="text-text-secondary text-sm">Global neural node settings and platform integration parameters.</p>
            </div>

            <div className="grid gap-8">
                <Card className="border-border bg-bg-surface overflow-hidden">
                    <CardHeader className="border-b border-border bg-bg-base/50">
                        <CardTitle className="flex items-center gap-2 text-text-primary text-sm font-heading font-bold uppercase tracking-widest">
                            <User className="w-4 h-4 text-primary" />
                            Identity & Shop Parameters
                        </CardTitle>
                        <CardDescription className="text-xs text-text-secondary">Secure vault encryption active for all identity nodes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase text-text-secondary tracking-widest pl-1 font-heading">Shop Designation</label>
                                <input className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-2.5 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-sans" defaultValue="Safian's Store" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase text-text-secondary tracking-widest pl-1 font-heading">Emergency Email</label>
                                <input className="w-full bg-bg-base border border-border rounded-[10px] px-4 py-2.5 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-sans" defaultValue="safian@example.com" />
                            </div>
                        </div>
                        <Button className="bg-primary text-black font-heading font-bold uppercase text-xs tracking-widest px-8 rounded-[10px] hover:shadow-primary-glow transition-all">
                            Save Parameters
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-border bg-bg-surface overflow-hidden">
                    <CardHeader className="border-b border-border bg-bg-base/50">
                        <CardTitle className="flex items-center gap-2 text-text-primary text-sm font-heading font-bold uppercase tracking-widest font-heading">
                            <Database className="w-4 h-4 text-primary" />
                            Platform Integration Cluster
                        </CardTitle>
                        <CardDescription className="text-xs text-text-secondary font-medium">Manage API bridges and neural webhook endpoints.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {[
                            { name: "Facebook Ads", sub: "Connected as Safian Advertising", icon: "f", color: "bg-[#1877F2]", status: "Active" },
                            { name: "Daraz Store", sub: "Connected: Safian Official", icon: "D", color: "bg-[#FF6000]", status: "Active" },
                            { name: "Google Ads", sub: "Neural link not established", icon: "G", color: "bg-white text-red-600 border border-white/10", status: "Disconnected" }
                        ].map((platform, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-[12px] border border-border bg-bg-base/30 hover:bg-bg-elevated hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg font-heading", platform.color)}>
                                        {platform.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-sm font-heading uppercase tracking-tight group-hover:text-primary transition-colors">{platform.name}</p>
                                        <p className="text-[11px] text-text-secondary font-medium uppercase tracking-widest">{platform.sub}</p>
                                    </div>
                                </div>
                                {platform.status === "Active" ? (
                                    <Badge variant="success" className="font-bold uppercase text-[9px] tracking-widest py-1">Live Bridge</Badge>
                                ) : (
                                    <Button variant="outline" className="h-8 text-[9px] font-bold uppercase tracking-widest border-border hover:border-primary/30 rounded-[8px]">Establish Link</Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-border bg-bg-surface overflow-hidden">
                    <CardHeader className="border-b border-border bg-bg-base/50">
                        <CardTitle className="flex items-center gap-2 text-text-primary text-sm font-heading font-bold uppercase tracking-widest font-heading">
                            <Shield className="w-4 h-4 text-primary" />
                            Neural Privacy Protocol
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="text-sm font-bold text-text-primary font-heading uppercase tracking-tight">Automatic Optimization</p>
                                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-widest">ALLOW AGENTS TO AUTO-ADJUST BUDGETS BASED ON ROAS TARGETS</p>
                            </div>
                            <div className="w-12 h-6 rounded-full bg-primary/20 border border-primary/30 relative cursor-pointer group-hover:bg-primary/30 transition-all">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary shadow-primary-glow" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="text-sm font-bold text-text-secondary font-heading uppercase tracking-tight">Distributed Training</p>
                                <p className="text-[11px] text-text-muted font-medium uppercase tracking-widest">CONTRIBUTE ANONYMIZED DATA TO GLOBAL NEURAL MODELS</p>
                            </div>
                            <div className="w-12 h-6 rounded-full bg-bg-base border border-border relative cursor-pointer transition-all">
                                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-text-muted/20" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-border bg-bg-surface hover:border-primary/30 transition-all cursor-pointer group">
                        <CardContent className="p-5 flex items-center justify-between font-bold text-text-primary text-[12px] uppercase tracking-widest font-heading">
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                                Alert Matrix
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-bg-surface hover:border-primary/30 transition-all cursor-pointer group">
                        <CardContent className="p-5 flex items-center justify-between font-bold text-text-primary text-[12px] uppercase tracking-widest font-heading">
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                                Regional Nexus
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
