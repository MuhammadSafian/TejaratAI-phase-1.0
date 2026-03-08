import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecentOrdersTable({ orders }: { orders: any[] }) {
    return (
        <Card className="border-border bg-bg-surface overflow-hidden">
            <CardHeader className="border-b border-border bg-bg-base/50">
                <CardTitle className="text-sm font-heading font-bold uppercase tracking-widest text-text-primary">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-bg-base/30">
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-text-secondary h-12 px-6">Order ID</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-text-secondary h-12 px-6">Customer</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-text-secondary h-12 px-6">Date</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-text-secondary h-12 px-6">Amount</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-text-secondary h-12 px-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-border hover:bg-bg-elevated/50 transition-colors group">
                                <TableCell className="px-6 py-4 font-mono font-bold text-xs text-text-primary uppercase">{order.id}</TableCell>
                                <TableCell className="px-6 py-4 text-sm font-heading font-bold text-text-primary">{order.customer}</TableCell>
                                <TableCell className="px-6 py-4 text-xs font-medium text-text-secondary">{order.date}</TableCell>
                                <TableCell className="px-6 py-4 font-mono font-bold text-xs text-text-primary">{order.amount}</TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge variant={
                                        order.status === "Delivered" ? "success" :
                                            order.status === "Processing" ? "warning" :
                                                order.status === "Shipped" ? "outline" : "neutral"
                                    } className="text-[10px] font-bold uppercase tracking-widest py-1">
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
