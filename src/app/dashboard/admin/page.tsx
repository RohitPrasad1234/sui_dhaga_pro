import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { Users, Scissors, Package, DollarSign, TrendingUp, UserCheck } from "lucide-react";

export default async function AdminDashboard() {
    const session = await auth();
    if (session?.user.role !== 'admin') return <p>Access Denied</p>;

    await dbConnect();

    // Stats from MongoDB
    const userCount = await User.countDocuments({ role: 'user', is_active: true });
    const tailorCount = await User.countDocuments({ role: 'tailor', is_active: true });
    const orderCount = await Order.countDocuments({});

    // Calculate revenue using aggregation
    const revenueResult = await Order.aggregate([
        { $match: { payment_status: 'PAID' } },
        { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    const stats = [
        { name: 'Users', value: userCount, icon: Users, color: 'text-primary' },
        { name: 'Tailors', value: tailorCount, icon: Scissors, color: 'text-secondary' },
        { name: 'Total Orders', value: orderCount, icon: Package, color: 'text-blue-500' },
        { name: 'Revenue', value: `₹${Number(revenue).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-success' },
    ];

    // Recent users
    const recentUsersDb = await User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(10);
        
    const recentUsers = recentUsersDb.map(u => ({
        ...u.toObject(),
        created_at: u.createdAt
    }));
    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Marketplace Overview</h2>
                <p className="text-muted text-sm">Real-time statistics for Sui Dhaga marketplace.</p>
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="card flex items-center justify-between border-accent/5">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">{stat.name}</p>
                            <h4 className="text-3xl font-playfair font-bold text-primary">{stat.value}</h4>
                        </div>
                        <div className={`px-4 py-4 rounded-2xl bg-texture shadow-inner ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-10">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-playfair font-bold flex items-center gap-2">
                            <UserCheck size={20} className="text-primary" />
                            Recent Account Registrations
                        </h3>
                        <button className="text-xs font-bold text-primary hover:underline">Manage Users</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-accent/10">
                                <tr>
                                    <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Name</th>
                                    <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Role</th>
                                    <th className="py-4 font-bold text-muted uppercase tracking-widest text-[10px]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent/5">
                                {recentUsers.map((user: any) => (
                                    <tr key={user.id}>
                                        <td className="py-4">
                                            <p className="font-bold">{user.name}</p>
                                            <p className="text-[10px] text-muted">{user.email}</p>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                    user.role === 'tailor' ? 'bg-secondary/10 text-secondary' :
                                                        'bg-primary/10 text-primary'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-xs text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card border-accent/5 bg-primary text-white flex flex-col justify-center items-center text-center">
                    <TrendingUp size={48} className="mb-6 text-secondary" />
                    <h4 className="text-2xl font-playfair font-bold mb-4">Growth Alert</h4>
                    <p className="text-sm font-light text-white/70 mb-8 leading-relaxed">
                        Registrations have increased by 25% this week. You might want to feature more tailors on the homepage.
                    </p>
                    <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all">
                        Launch Campaign
                    </button>
                </div>
            </div>
        </div>
    );
}
