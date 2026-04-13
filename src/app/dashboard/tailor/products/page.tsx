import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function TailorProductsPage() {
    const session = await auth();
    if (!session || session.user.role !== 'tailor') return null;

    await dbConnect();
    const tailorId = session.user.id;

    const dbProducts = await Product.find({ tailor_id: tailorId }).sort({ createdAt: -1 });
    
    const products = dbProducts.map(p => {
        const prod = p.toObject();
        return {
            ...prod,
            id: prod._id.toString()
        };
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-primary mb-2 flex items-center gap-3">
                        <Tag size={28} /> My Shop Products
                    </h2>
                    <p className="text-muted text-sm relative z-10">Manage the apparel listings available for purchase on your shop profile.</p>
                </div>
                <Link 
                    href="/dashboard/tailor/products/new" 
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm w-fit"
                >
                    <Plus size={18} /> Add New Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-accent/20 rounded-3xl bg-accent/5">
                    <Tag size={48} className="text-primary/20 mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">No Products Mapped</h3>
                    <p className="text-muted text-sm max-w-sm mb-6">You haven't listed any bespoke products yet. Start adding your collection to showcase your craftsmanship.</p>
                    <Link 
                        href="/dashboard/tailor/products/new" 
                        className="px-6 py-3 bg-white text-primary rounded-xl font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all text-sm"
                    >
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <div key={product.id} className="card rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group flex flex-col bg-white border border-accent/10">
                            <div className="relative aspect-video w-full overflow-hidden bg-accent/5">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                    ₹{product.price}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="font-playfair font-bold text-xl text-primary line-clamp-1">{product.name}</h3>
                                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest rounded">
                                        {product.category}
                                    </span>
                                </div>
                                <p className="text-muted text-sm line-clamp-2 mb-6 flex-1">
                                    {product.description}
                                </p>
                                
                                <div className="flex items-center gap-2 pt-4 border-t border-accent/10">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button className="flex items-center justify-center p-2 bg-error/5 text-error rounded-lg hover:bg-error hover:text-white transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
