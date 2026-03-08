"use client";

import { useInventory } from "@/hooks/use-data";
import {
    Plus,
    Search,
    Filter,
    Package,
    Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
    const { products, loading } = useInventory();

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-[#94a3b8]">Scanning Warehouse Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[32px] font-heading font-bold tracking-tight mb-2 text-text-primary">Inventory Control</h1>
                    <div className="text-text-secondary text-sm flex items-center gap-2">
                        Real-time stock synchronization active
                        <Badge variant="success" className="text-[10px] h-5 uppercase font-bold italic border-primary/30 text-primary">Multi-Platform Sync</Badge>
                    </div>
                </div>
                <Button className="gap-2 bg-primary text-black font-heading font-bold rounded-[10px]">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-border bg-bg-surface">
                    <CardContent className="pt-6">
                        <p className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-2">Total SKUs</p>
                        <p className="text-[28px] font-mono font-bold text-text-primary leading-none">{products.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-bg-surface">
                    <CardContent className="pt-6">
                        <p className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-2">Low Stock</p>
                        <p className="text-[28px] font-mono font-bold text-primary leading-none">{products.filter(p => p.status === "Low Stock").length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-bg-surface">
                    <CardContent className="pt-6">
                        <p className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-2">Out of Stock</p>
                        <p className="text-[28px] font-mono font-bold text-danger leading-none">{products.filter(p => p.status === "Out of Stock").length}</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-bg-surface">
                    <CardContent className="pt-6">
                        <p className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-2">Inventory Value</p>
                        <p className="text-[28px] font-mono font-bold text-text-primary leading-none">PKR 1.2M</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search SKU or Product Name..."
                        className="pl-10 bg-[#0a0a0a] border-white/10 focus:border-primary/50 transition-all rounded-xl"
                    />
                </div>
                <Button variant="outline" className="gap-2 border-white/10 rounded-xl">
                    <Filter className="w-4 h-4" /> Filter
                </Button>
            </div>

            <Card className="border-border bg-bg-surface overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50">
                                <tr className="text-[11px] font-bold uppercase tracking-widest text-text-secondary border-b border-border">
                                    <th className="px-6 py-4">Product Details</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Stock Level</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-bg-elevated transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-bg-base border border-border flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                                                </div>
                                                <p className="text-sm font-heading font-bold text-text-primary tracking-tight">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono font-bold text-text-secondary uppercase">{product.sku}</td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <p className="text-xs font-mono font-bold text-text-primary">{product.stock} Units</p>
                                                <div className="w-24 h-1.5 bg-bg-base rounded-full overflow-hidden border border-border">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-500",
                                                            product.status === "Low Stock" ? "bg-warning" : product.status === "Out of Stock" ? "bg-danger" : "bg-primary"
                                                        )}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono font-bold text-text-primary">PKR {product.price}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={product.status === "In Stock" ? "success" : product.status === "Low Stock" ? "warning" : "destructive"}
                                                className="text-[9px] font-bold uppercase tracking-tighter shadow-none"
                                            >
                                                {product.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary uppercase text-[10px] font-bold tracking-widest font-heading">Edit Node</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
