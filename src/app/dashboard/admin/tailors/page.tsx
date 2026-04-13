import { auth } from "@/auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Scissors, Star, MapPin, Phone, Award, ChevronRight, Search, Zap } from "lucide-react";
import Link from "next/link";

export default async function AdminTailorsPage() {
    const session = await auth();
    if (session?.user.role !== 'admin') return <p className="text-secondary p-8">Access Denied</p>;

    // Fetch all tailors
    const [tailors] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, email, location, phone, bio, image, is_active, created_at FROM users WHERE role = "tailor" ORDER BY created_at DESC'
    );

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex justify-between items-center gap-6 pb-6 border-b border-accent/10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/admin" className="text-[10px] font-bold text-muted hover-text-primary uppercase tracking-widest transition-all">Admin Hub</Link>
                        <ChevronRight size={10} className="text-muted" />
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Artisan Collective</span>
                    </div>
                    <h2 className="text-3xl font-playfair font-bold text-primary mb-1">Master Artisan Registry</h2>
                    <p className="text-muted text-sm tracking-wide">Official Catalog of Verified Platform Talent.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border border-accent/20 rounded-xl px-4 py-3 shadow-sm transition-all focus-within:border-secondary/40">
                        <Search className="text-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Identify Artisan..." 
                            style={{ width: '250px', border: 'none', outline: 'none', background: 'transparent' }}
                            className="text-sm text-text"
                        />
                    </div>
                </div>
            </div>

            {/* Artisan Insights Mini-Grid */}
            <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Total Artisans</p>
                        <h4 className="text-2xl font-bold font-playfair text-secondary">{tailors.length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                        <Scissors size={20} />
                    </div>
                </div>
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Official Partners</p>
                        <h4 className="text-2xl font-bold font-playfair text-secondary">{tailors.filter(t => t.is_active).length}</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-green-50 text-green-600">
                        <Award size={20} />
                    </div>
                </div>
                <div className="card flex items-center justify-between border-accent/5">
                    <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Active Portfolio</p>
                        <h4 className="text-2xl font-bold font-playfair text-secondary">{tailors.length} Nodes</h4>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                        <Zap size={20} />
                    </div>
                </div>
            </div>

            {/* Tailors Registry Hub */}
            <div className="grid grid-cols-1 md-grid-cols-2 gap-8">
                {tailors.map((tailor: any) => (
                    <div key={tailor.id} className="card border-accent/5 flex flex-col justify-between">
                        <div>
                            {/* Status Chip */}
                            <div className="flex justify-end mb-4">
                                <span className="uppercase tracking-widest text-[9px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                                    Verified Artisan
                                </span>
                            </div>

                            <div className="flex items-start gap-5">
                                {/* Artisan Avatar */}
                                <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-accent/10 overflow-hidden shrink-0">
                                    <img 
                                        src={tailor.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"} 
                                        alt={tailor.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-primary tracking-tight mb-2">{tailor.name}</h3>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5 text-muted">
                                            <MapPin size={12} className="text-secondary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest truncate">{tailor.location || "Heritage Outpost"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted">
                                            <Phone size={12} className="text-secondary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{tailor.phone || "Comm-link Unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio / Portfolio Preview */}
                            <div className="mt-6 pt-6 border-t border-accent/10">
                                <p className="text-sm text-muted leading-relaxed italic line-clamp-3">
                                    "{tailor.bio || "This artisan preserves the legacy of Sui Dhaga through meticulous craft and heritage techniques. A master of silhouettes and fine stitching."}"
                                </p>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="mt-6 pt-6 flex items-center justify-between border-t border-accent/10">
                            <div className="flex items-center gap-1 text-secondary">
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} className="opacity-30" />
                            </div>
                            <button className="text-[10px] font-bold text-secondary hover:underline uppercase tracking-widest">
                                Configure Hub
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {tailors.length === 0 && (
                <div className="card py-24 text-center border-accent/5">
                    <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                        <Scissors className="text-secondary" size={32} />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-primary mb-2">Artisan Registry Vacant</h3>
                    <p className="text-muted text-sm">No master tailors have been integrated into the heritage node yet.</p>
                </div>
            )}
        </div>
    );
}
