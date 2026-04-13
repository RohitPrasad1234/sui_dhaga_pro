"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, CreditCard, ShieldCheck, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { cart, cartTotal, removeFromCart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [error, setError] = useState('');

    if (!session) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-inter p-6 text-center">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src="/images/golden_flower.png" className="w-full h-full object-cover opacity-20 blur-sm" />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative z-10 max-w-md">
                    <h1 className="text-white text-5xl font-playfair font-black mb-6">Identity Reserved.</h1>
                    <p className="text-white/50 mb-10 text-lg leading-relaxed italic">The artisan journey requires your presence. Please sign in to finalize your custom creation.</p>
                    <Link href="/login" className="w-full py-5 bg-primary text-white font-black text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-3">Sign In Now</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-texture font-inter pb-20 pt-32">
                <Navbar session={session} />
                <div className="container flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                        <ShoppingBag size={48} className="text-primary/20" />
                    </div>
                    <h2 className="text-5xl font-playfair font-bold text-primary mb-6">Your Wardrobe is Unthreaded</h2>
                    <p className="text-muted text-lg italic mb-12 max-w-sm">You haven't selected any custom creations yet. Explore our marketplace to begin.</p>
                    <Link href="/shop" className="btn-primary px-12 py-5 rounded-2xl text-lg font-black shadow-xl">Explore Marketplace</Link>
                </div>
            </main>
        );
    }

    const handleCheckout = async () => {
        setLoading(true);
        setError('');

        try {
            // Call Stripe checkout API
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        category: item.category,
                    })),
                    customer_name: customerName || session.user?.name || '',
                    customer_phone: customerPhone,
                    delivery_address: deliveryAddress,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-texture font-inter pb-20">
            <Navbar session={session} />
            
            <div className="container pt-32 lg:pt-40">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16">
                    <div className="flex-1 w-full space-y-12">
                        <div>
                            <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-primary hover:underline mb-8">
                                <ArrowLeft size={16} /> Continue Selection
                            </Link>
                            <h1 className="text-6xl font-playfair font-black text-primary leading-tight">Order Initialization.</h1>
                            <p className="text-muted text-lg italic mt-4">Review your curated artisan selections before Stripe checkout.</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
                                {error}
                            </div>
                        )}

                        {/* Order Items List */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-widest text-primary/40 flex items-center gap-3">
                                <ShoppingBag size={20} /> Selection Summary
                            </h3>
                            {cart.map((item) => (
                                <div key={item.id} className="card px-6 py-6 border border-accent/10 shadow-sm rounded-[2rem] flex flex-col md:flex-row gap-8 group hover:shadow-xl transition-all">
                                    <div className="w-full md:w-32 aspect-square relative rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black tracking-widest uppercase rounded-full border border-secondary/20">{item.category}</span>
                                                <h3 className="text-2xl font-playfair font-bold text-primary mt-2">{item.name}</h3>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="p-3 text-muted/30 hover-text-red-500 hover-bg-red-50 rounded-full transition-all">
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm font-bold text-muted uppercase tracking-widest mt-1">
                                            <span className="flex items-center gap-2 pr-6 border-r border-accent/10">Qty: {item.quantity}</span>
                                            <span className="text-primary text-lg font-playfair font-black tracking-tight">₹{item.price} each</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Information */}
                        <div className="space-y-8 pt-10">
                            <h3 className="text-2xl font-playfair font-black flex items-center gap-4 italic border-b border-accent/10 pb-6">
                                <Truck size={28} className="text-primary" /> Delivery Logistics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1">Artisan Full Name</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        defaultValue={session.user?.name || ""}
                                        placeholder="Your full name"
                                        className="w-full px-5 py-3 bg-white border border-accent/10 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="+91 00000 00000"
                                        className="w-full px-5 py-3 bg-white border border-accent/10 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1">Delivery Address</label>
                                    <textarea
                                        rows={3}
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Detailed address for delivery..."
                                        className="w-full px-5 py-3 bg-white border border-accent/10 rounded-xl shadow-inner focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="w-full lg:w-[420px] sticky top-32 lg:top-40">
                        <div className="card p-10 md:p-12 bg-primary text-white border-none rounded-[3.5rem] shadow-[0_64px_128px_-20px_rgba(139,94,60,0.4)] space-y-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] pb-8 border-b border-white/10 text-white/50">Billing Summary</h3>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between text-sm font-light italic">
                                    <span className="text-white/40">Base Tailoring Fee</span>
                                    <span className="font-bold">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-light italic">
                                    <span className="text-white/40">Express Courier</span>
                                    <span className="font-bold">₹250</span>
                                </div>
                                <div className="flex justify-between text-sm font-light italic">
                                    <span className="text-white/40">Heritage Tax</span>
                                    <span className="font-bold">₹150</span>
                                </div>
                                <div className="h-[2px] bg-white/5 mx-[-20px]" />
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Charged</span>
                                    <span className="text-5xl font-playfair font-black tracking-tighter italic">₹{cartTotal + 400}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full py-6 bg-white text-primary font-black text-xl rounded-2xl shadow-2xl hover:bg-secondary hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-4 outline-none group"
                            >
                                {loading ? (
                                    <div className="w-7 h-7 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard size={24} className="group-hover:rotate-12 transition-transform" />
                                        Pay with Stripe
                                    </>
                                )}
                            </button>

                            <div className="flex items-center gap-4 justify-center text-[9px] font-black tracking-[0.3em] text-white/30 uppercase">
                                <ShieldCheck size={18} className="text-secondary/60" />
                                Powered by Stripe Secure Checkout
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
