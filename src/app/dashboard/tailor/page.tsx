import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Post from "@/models/Post";
import { auth } from "@/auth";
import { Package, TrendingUp, Scissors, Heart, Calendar } from "lucide-react";

export default async function TailorDashboard() {
    const session = await auth();
    if (!session) return null;

    await dbConnect();
    const tailorId = session.user.id;

    // Aggregate stats from MongoDB
    const totalOrders = await Order.countDocuments({ tailor_id: tailorId });
    const pendingOrders = await Order.countDocuments({ tailor_id: tailorId, status: 'PENDING' });
    const stitchingOrders = await Order.countDocuments({ tailor_id: tailorId, status: 'STITCHING' });
    const totalPosts = await Post.countDocuments({ tailor_id: tailorId });

    const stats = [
        { name: 'Total Orders', value: totalOrders, icon: Package, color: 'text-primary' },
        { name: 'Pending', value: pendingOrders, icon: Calendar, color: 'text-accent' },
        { name: 'In Progress', value: stitchingOrders, icon: Scissors, color: 'text-blue-500' },
        { name: 'Portfolio Items', value: totalPosts, icon: Heart, color: 'text-error' },
    ];

    // Recent orders with client info
    const recentOrdersDb = await Order.find({ tailor_id: tailorId })
        .populate('client_id', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

    const recentOrders = recentOrdersDb.map(o => {
        const order = o.toObject();
        return {
            ...order,
            id: order._id.toString(),
            client_name: (order.client_id as any)?.name,
            client_email: (order.client_id as any)?.email,
        };
    });

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Welcome Back, {session.user?.name?.split(' ')[0] || 'Artisan'}!</h2>
                <p className="text-muted text-sm">Managing your artisan craftsmanship at Sui Dhaga.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="card p-6 flex items-center justify-between border-accent/5">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">{stat.name}</p>
                            <h4 className="text-3xl font-playfair font-bold text-primary">{stat.value}</h4>
                        </div>
                        <div className={`p-4 rounded-2xl bg-texture shadow-inner ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-playfair font-bold flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" />
                        Recent Orders
                    </h3>
                    <button className="text-xs font-bold text-primary hover:underline">View All Orders</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-accent/10">
                            <tr>
                                <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Client</th>
                                <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Service</th>
                                <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Status</th>
                                <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/5">
                            {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="py-4">
                                        <p className="font-bold">{order.client_name}</p>
                                        <p className="text-xs text-muted">{order.client_email}</p>
                                    </td>
                                    <td className="py-4 font-medium">{order.service_type}</td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'STITCHING' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'READY_FOR_DELIVERY' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold text-[10px] hover:bg-primary hover:text-white transition-all">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-muted">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
