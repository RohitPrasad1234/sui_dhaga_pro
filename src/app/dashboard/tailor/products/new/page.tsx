"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Tag, Image as ImageIcon, IndianRupee, Layers, FileText } from "lucide-react";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Suits",
        image: "",
        stock: "10"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock, 10)
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create product');
            }

            // Successfully created
            router.push('/dashboard/tailor/products');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <Link href="/dashboard/tailor/products" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-primary hover:underline mb-6">
                    <ArrowLeft size={16} /> Back to Products
                </Link>
                <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Publish New Listing</h2>
                <p className="text-muted text-sm">Add a new bespoke garment to your storefront portfolio.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-8 sm:p-10 bg-white border-accent/10 space-y-8">
                
                {/* Basic Details */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black tracking-widest uppercase text-muted border-b border-accent/10 pb-4 flex items-center gap-2">
                        <FileText size={16} /> Basic Details
                    </h3>
                    
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1 mb-2 block">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Royal Golden Sherwani"
                            className="w-full px-5 py-3.5 bg-white border border-accent/20 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1 mb-2 block">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the styling, fabric, and fit..."
                            className="w-full px-5 py-3.5 bg-white border border-accent/20 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Categorization & Financials */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black tracking-widest uppercase text-muted border-b border-accent/10 pb-4 flex items-center gap-2">
                            <Layers size={16} /> Classification
                        </h3>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1 mb-2 block">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-white border border-accent/20 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm appearance-none"
                                >
                                    <option value="Suits">Suits</option>
                                    <option value="Ethnic">Ethnic Wear</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Dresses">Dresses</option>
                                    <option value="Trousers">Trousers</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                                <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1 mb-2 block">Available Units (Stock)</label>
                            <input
                                type="number"
                                name="stock"
                                min="1"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-white border border-accent/20 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black tracking-widest uppercase text-muted border-b border-accent/10 pb-4 flex items-center gap-2">
                            <IndianRupee size={16} /> Pricing & Media
                        </h3>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1 mb-2 block">Base Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="any"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                className="w-full px-5 py-3.5 bg-white border border-accent/20 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1 mb-2 block">Image URL</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://..."
                                    className="w-full pl-11 pr-5 py-3.5 bg-white border border-accent/20 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                />
                                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
                            </div>
                            <p className="text-[10px] text-muted/60 mt-2 px-1">Provide a direct link to the product cover image.</p>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-8 border-t border-accent/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all outline-none disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} /> Publish Listing
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
