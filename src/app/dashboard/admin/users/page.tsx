import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { UserCheck, Mail, Calendar, Hash, ShieldCheck, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
    const session = await auth();
    if (session?.user.role !== 'admin') return <p className="text-secondary p-8">Access Denied</p>;

    await dbConnect();
    // Fetch all users
    const dbUsers = await User.find().sort({ createdAt: -1 });

    const users = dbUsers.map(u => {
        const user = u.toObject();
        return {
            ...user,
            id: user._id.toString(),
            created_at: user.createdAt
        };
    });

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex justify-between items-center gap-6 pb-6 border-b border-accent/10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/admin" className="text-[10px] font-bold text-muted hover-text-primary uppercase tracking-widest transition-all">Admin Hub</Link>
                        <ChevronRight size={10} className="text-muted" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">User Registry</span>
                    </div>
                    <h2 className="text-3xl font-playfair font-bold text-primary mb-1">Citizen Identity Management</h2>
                    <p className="text-muted text-sm tracking-wide">Official Registry of Sui Dhaga Nodes.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border border-accent/20 rounded-xl px-4 py-3 shadow-sm transition-all focus-within:border-primary/40">
                        <Search className="text-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Find Identity..." 
                            style={{ width: '250px', border: 'none', outline: 'none', background: 'transparent' }}
                            className="text-sm text-text"
                        />
                    </div>
                </div>
            </div>

            {/* Statistics Mini-Grid */}
            <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Total Identities</p>
                        <h4 className="text-2xl font-bold font-playfair text-primary">{users.length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/5 text-primary">
                        <Hash size={20} />
                    </div>
                </div>
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Active Nodes</p>
                        <h4 className="text-2xl font-bold font-playfair text-primary">{users.filter(u => u.is_active).length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-success/10 text-success">
                        <UserCheck size={20} />
                    </div>
                </div>
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Admin Nodes</p>
                        <h4 className="text-2xl font-bold font-playfair text-primary">{users.filter(u => u.role === 'admin').length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-error/10 text-error">
                        <ShieldCheck size={20} />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden border-accent/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-primary/5 border-b border-accent/10">
                            <tr>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Registry Identity</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Permission Rank</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Physical Coordinate</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px]">Integration Date</th>
                                <th className="py-4 px-6 font-bold text-muted uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/5">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text">{user.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-muted">
                                                    <Mail size={10} />
                                                    <p className="text-[10px] tracking-wide">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border ${
                                            user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                                            user.role === 'tailor' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-xs text-muted italic">{user.location || "Undisclosed"}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-muted">
                                            <Calendar size={12} />
                                            <p className="text-[11px]">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                                            Manage Node
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
