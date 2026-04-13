import { auth } from "@/auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Package, Truck, CreditCard, User, Scissors, ChevronRight, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage() {
    const session = await auth();
    if (session?.user.role !== 'admin') return <p className="text-secondary p-8">Access Denied</p>;

    // Fetch all orders with customer and tailor names
    const [orders] = await pool.execute<RowDataPacket[]>(`
        SELECT 
            o.*, 
            c.name as customer_name_db, 
            t.name as tailor_name_db
        FROM orders o
        JOIN users c ON o.client_id = c.id
        LEFT JOIN users t ON o.tailor_id = t.id
        ORDER BY o.created_at DESC
    `);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex justify-between items-center gap-6 pb-6 border-b border-accent/10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/admin" className="text-[10px] font-bold text-muted hover-text-primary uppercase tracking-widest transition-all">Admin Hub</Link>
                        <ChevronRight size={10} className="text-muted" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Logistics HQ</span>
                    </div>
                    <h2 className="text-3xl font-playfair font-bold text-primary mb-1">Global Order Streams</h2>
                    <p className="text-muted text-sm tracking-wide">Integrated Fulfillment & Transaction Hub.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border border-accent/20 rounded-xl px-4 py-3 shadow-sm transition-all focus-within:border-blue-500/40">
                        <Search className="text-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Track Transaction..." 
                            style={{ width: '250px', border: 'none', outline: 'none', background: 'transparent' }}
                            className="text-sm text-text"
                        />
                    </div>
                </div>
            </div>

            {/* Logistics Mini-Grid */}
            <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Total Streams</p>
                        <h4 className="text-2xl font-bold font-playfair text-blue-500">{orders.length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-500">
                        <Package size={20} />
                    </div>
                </div>
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Paid & Settled</p>
                        <h4 className="text-2xl font-bold font-playfair text-success">{orders.filter(o => o.payment_status === 'PAID').length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-success/10 text-success">
                        <CheckCircle2 size={20} />
                    </div>
                </div>
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Awaiting Action</p>
                        <h4 className="text-2xl font-bold font-playfair text-yellow-600">{orders.filter(o => o.status === 'PENDING').length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Orders Stream Registry */}
            <div className="card overflow-hidden border-accent/5 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-primary/5 border-b border-accent/10">
                            <tr>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Transaction ID</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Artisans Involved</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Fulfillment Node</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Settlement</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/5">
                            {orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-primary/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-text uppercase tracking-tight">ORD-{order.id.toString().padStart(4, '0')}</p>
                                                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">{order.service_type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-1.5 text-text">
                                                <User size={10} className="text-primary" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{order.customer_name_db}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-muted">
                                                <Scissors size={10} className="text-secondary" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{order.tailor_name_db || "Unassigned"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border flex items-center gap-1.5 w-fit ${
                                            order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                            {order.status === 'DELIVERED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={14} className={order.payment_status === 'PAID' ? 'text-success' : 'text-error'} />
                                            <div>
                                                <p className="text-xs font-bold text-text">₹{Number(order.price).toLocaleString()}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-widest ${order.payment_status === 'PAID' ? 'text-success' : 'text-error'}`}>
                                                    {order.payment_status}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest">
                                            Edit Stream
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Empty State */}
            {orders.length === 0 && (
                <div className="card py-24 text-center border-accent/5">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <Truck className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-primary mb-2">Logistics Stream Empty</h3>
                    <p className="text-muted text-sm">No transaction strings have been initialized on the heritage network yet.</p>
                </div>
            )}
        </div>
    );
}
