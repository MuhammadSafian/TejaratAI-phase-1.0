"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, MoreVertical } from "lucide-react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { cn } from "@/lib/utils";

const mockCustomers = [
    { id: 1, name: "Ahmed Khan", email: "ahmed.k@example.com", phone: "+92 300 1234567", orders: 12, spent: "PKR 24,500", status: "Active" },
    { id: 2, name: "Sara Ali", email: "sara.a@example.com", phone: "+92 321 7654321", orders: 8, spent: "PKR 18,200", status: "Active" },
    { id: 3, name: "Bilal Sheikh", email: "bilal.s@example.com", phone: "+92 333 9876543", orders: 5, spent: "PKR 11,500", status: "Inactive" },
    { id: 4, name: "Zoya Malik", email: "zoya.m@example.com", phone: "+92 345 1112223", orders: 15, spent: "PKR 32,800", status: "Active" },
    { id: 5, name: "Usman Qureshi", email: "usman.q@example.com", phone: "+92 312 4445556", orders: 3, spent: "PKR 7,400", status: "New" },
];

export default function CustomersPage() {
    const stats = [
        { label: "Total Customers", value: "1,248", trend: "+12.5%", icon: "Users" },
        { label: "Active Customers", value: "892", trend: "+8.4%", icon: "Users" },
        { label: "Customer LTV", value: "PKR 4,850", trend: "+3.2%", icon: "TrendingUp" },
        { label: "New This Month", value: "145", trend: "+15", icon: "Users" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-black tracking-tighter mb-2 text-white italic">RELATIONSHIP <span className="text-primary not-italic">MATRIX</span></h1>
                <p className="text-[#94a3b8] font-bold uppercase text-[10px] tracking-[0.2em] pl-1">Predictive Customer Lifecycle Management</p>
            </div>

            <StatCards stats={stats} />

            <Card className="border-white/5 bg-[#0a0a0a] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.01] py-4">
                    <CardTitle className="text-white text-xs font-black uppercase tracking-widest italic">User Database</CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8] group-hover:text-primary transition-colors" />
                            <input
                                type="search"
                                placeholder="Neural Search..."
                                className="pl-10 pr-4 py-2 rounded-lg bg-black border border-white/5 text-[11px] font-bold outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 w-[200px] transition-all"
                            />
                        </div>
                        <Button variant="outline" className="h-9 px-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-tighter hover:bg-primary/10">
                            Export Ledger
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent bg-white/[0.01]">
                                <TableHead className="text-[#94a3b8] uppercase text-[10px] font-black tracking-widest pl-6">Client / Identity</TableHead>
                                <TableHead className="text-[#94a3b8] uppercase text-[10px] font-black tracking-widest">Order Velocity</TableHead>
                                <TableHead className="text-[#94a3b8] uppercase text-[10px] font-black tracking-widest">Gross Yield</TableHead>
                                <TableHead className="text-[#94a3b8] uppercase text-[10px] font-black tracking-widest">AI Segment</TableHead>
                                <TableHead className="text-right text-[#94a3b8] uppercase text-[10px] font-black tracking-widest pr-6">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockCustomers.map((customer) => (
                                <TableRow key={customer.id} className="group border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-[10px]">
                                                {customer.name.substring(0, 1)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white group-hover:text-primary transition-colors text-sm">{customer.name}</span>
                                                <span className="text-[10px] font-bold text-[#94a3b8]/50 uppercase">{customer.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-white">{customer.orders} Units</TableCell>
                                    <TableCell className="text-xs font-black text-white italic">{customer.spent}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 border-transparent bg-white/5",
                                            parseInt(customer.spent.replace(/[^0-9]/g, '')) > 20000 ? "text-primary bg-primary/10" : "text-[#94a3b8]"
                                        )}>
                                            {parseInt(customer.spent.replace(/[^0-9]/g, '')) > 20000 ? "VIP Segment" : "Standard"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 border-transparent bg-white/5",
                                                customer.status === "Active" ? "text-emerald-500 bg-emerald-500/10" : "text-primary/60 bg-primary/5"
                                            )}>
                                                {customer.status}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#94a3b8] hover:text-primary">
                                                <MoreVertical className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
