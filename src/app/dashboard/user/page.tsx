import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { auth } from "@/auth";
import Link from "next/link";
import { 
    Package, Truck, Check, Clock, Scissors, ShoppingBag, 
    ShieldCheck, PhoneCall, Download, FileText, ChevronRight, 
    User as LucideUser, CreditCard 
} from "lucide-react";

const OrderTimeline = ({ status }: { status: string }) => {
    const steps = [
        { name: 'Ordered', icon: Clock, targetStatus: 'PENDING' },
        { name: 'Tailoring', icon: Scissors, targetStatus: 'STITCHING' },
        { name: 'Ready', icon: ShoppingBag, targetStatus: 'READY_FOR_DELIVERY' },
        { name: 'Dispatched', icon: Truck, targetStatus: 'OUT_FOR_DELIVERY' },
        { name: 'Delivered', icon: Check, targetStatus: 'DELIVERED' },
    ];

    const statusMap: Record<string, number> = {
        'PENDING': 0,
        'ACCEPTED': 0,
        'STITCHING': 1,
        'READY_FOR_DELIVERY': 2,
        'OUT_FOR_DELIVERY': 3,
        'DELIVERED': 4
    };

    const currentStep = statusMap[status] || 0;

    return (
        <div className="flex items-center justify-between w-full max-w-md py-4">
            {steps.map((step, idx) => (
                <div key={step.name} className="flex flex-col items-center gap-2 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${idx <= currentStep ? 'bg-primary text-white shadow-xl' : 'bg-gray-100 text-muted/30'}`}>
                        <step.icon size={14} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${idx <= currentStep ? 'text-primary' : 'text-muted/40'}`}>{step.name}</span>
                    {idx < steps.length - 1 && (
                        <div className={`absolute left-full top-4 w-16 h-[2px] -translate-x-1/2 -z-10 ${idx < currentStep ? 'bg-primary' : 'bg-gray-100'}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default async function UserDashboard() {
    const session = await auth();
    if (!session?.user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-4xl font-playfair font-black text-primary">Access Reserved.</h2>
            <p className="text-muted italic">Identify yourself to access your exclusive tailoring journey.</p>
            <Link href="/login" className="btn-primary px-10 py-4 rounded-xl">Sign In Path</Link>
        </div>
    );

    await dbConnect();
    const userId = session.user.id;

    // Fetch orders with tailor info
    const orders = await Order.find({ client_id: userId })
        .populate('tailor_id', 'name email phone')
        .sort({ createdAt: -1 });

    const formattedOrders = orders.map(o => {
        const order = o.toObject();
        return {
            ...order,
            id: order._id.toString(),
            tailor_name: (order.tailor_id as any)?.name,
            tailor_email: (order.tailor_id as any)?.email,
            tailor_phone: (order.tailor_id as any)?.phone,
        };
    });

    const mockOrder = {
        id: 'DEMO',
        service_type: 'Heritage Bandhgala Coat',
        status: 'STITCHING',
        price: 8500,
        tailor_name: 'Master Anwar Qureshi',
        tailor_phone: '+91 98765 43210',
        created_at: new Date()
    };

    const displayOrders = formattedOrders.length > 0 ? formattedOrders : [mockOrder];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-accent/5">
                <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary py-1 border-b-2 border-primary/20">The Artisan Portal</span>
                    <h2 className="text-5xl font-playfair font-black text-primary leading-tight italic">My Tailoring Journey.</h2>
                    <p className="text-muted text-sm italic font-light">Track your handcrafted creations and manage your heritage collection.</p>
                </div>
                <div className="flex gap-4">
                    <div className="card px-6 py-4 bg-white border border-accent/5 shadow-sm text-center flex flex-col items-center justify-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Active Creations</span>
                        <span className="text-2xl font-playfair font-black text-primary">{displayOrders.filter((o: any) => o.status !== 'DELIVERED').length}</span>
                    </div>
                    <div className="card px-6 py-4 bg-primary text-white border-none shadow-xl text-center flex flex-col items-center justify-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Loyalty Points</span>
                        <span className="text-2xl font-playfair font-black">1.2k</span>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-playfair font-black flex items-center gap-3 italic">
                        <Package size={24} className="text-primary" />
                        In-Progress Crafts
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Refresh Cycle: Every 4 Minutes</p>
                </div>

                <div className="space-y-8">
                    {displayOrders.map((order: any) => (
                        <div key={order.id} className="card p-0 border border-accent/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group bg-white">
                            <div className="flex flex-col lg:row">
                                <div className="flex-1 p-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold tracking-widest rounded-full uppercase italic border border-secondary/20 shadow-inner">Order Captured</span>
                                        <p className="text-[10px] font-black text-muted/50 uppercase tracking-[0.2em]">Reference #{order.id.toString().slice(-6).toUpperCase()}</p>
                                    </div>
                                    <h4 className="text-3xl font-playfair font-black text-primary leading-tight">{order.service_type}</h4>
                                    
                                    <div className="flex flex-wrap items-center gap-8 py-4 px-6 bg-texture rounded-2xl border border-accent/5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><LucideUser size={14} /></div>
                                            {order.tailor_name || 'Unassigned'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Clock size={14} /></div>
                                            ETA: 4 Cycles
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CreditCard size={14} /></div>
                                            ₹{order.price || '0'}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto p-10 bg-texture lg:border-l border-t lg:border-t-0 border-accent/5 flex flex-col items-center justify-center gap-8">
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Delivery Progress Stage</p>
                                        <OrderTimeline status={order.status} />
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 w-full">
                                        <a href={`tel:${order.tailor_phone || '+910000000000'}`} className="flex-1 btn-primary py-4 px-6 text-xs flex items-center justify-center gap-3 rounded-2xl shadow-lg active:scale-95 transition-all">
                                            <PhoneCall size={18} />
                                            Master Call
                                        </a>
                                        <button className="flex-1 bg-white border border-accent/10 py-4 px-6 text-xs font-black uppercase tracking-widest text-primary flex items-center justify-center gap-3 rounded-2xl hover:bg-primary-5 transition-all active:scale-95">
                                            <FileText size={18} />
                                            Invoice
                                        </button>
                                        <button className="p-4 bg-secondary/5 border border-secondary/20 rounded-2xl text-secondary hover:bg-secondary hover:text-white transition-all active:scale-95">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-20 border-t border-accent/5">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-playfair font-black flex items-center gap-3 italic">
                        <FileText size={24} className="text-primary" />
                        Heritage Archive (Invoice History)
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="card p-8 bg-white border border-accent/5 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <span className="bg-primary/5 px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">Delivered Success</span>
                                <span className="text-xs font-bold text-muted">#INV-202{i}</span>
                            </div>
                            <h4 className="text-xl font-playfair font-bold text-primary">Custom Ethnic Sherwani</h4>
                            <div className="flex justify-between items-end border-t border-accent/5 pt-4">
                                <div>
                                    <p className="text-[10px] font-black text-muted/50 uppercase tracking-widest leading-none mb-2">Total Amount</p>
                                    <p className="text-2xl font-playfair font-black text-primary">₹12,450</p>
                                </div>
                                <button className="p-3 bg-secondary/10 rounded-xl text-secondary hover:bg-secondary hover:text-white transition-all">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
