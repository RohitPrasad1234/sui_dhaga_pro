'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ShoppingBag, Star, Search, Plus, X, Minus, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    tailor_name?: string;
}

export default function ShopPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams();
                if (searchTerm) params.set('q', searchTerm);
                if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);

                const res = await fetch(`/api/products?${params.toString()}`);
                const data = await res.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchTerm, selectedCategory]);

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <main className="min-h-screen bg-texture pt-32 pb-24">
            <Navbar session={session} />

            <div className="container">
                {/* Header & Controls */}
                <div className="flex flex-col md-flex-row justify-between items-start md-items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md-text-5xl font-playfair font-bold mb-4">Artisan Marketplace</h1>
                        <p className="text-muted">Direct from our master tailors to your wardrobe.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md-w-auto">
                        <div className="relative flex-1 md-w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search designs..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-accent-10 bg-white shadow-sm focus-border-primary outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn-primary p-2.5 relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                ? "bg-primary text-white shadow-lg"
                                : "bg-white text-text border border-accent-10 hover-bg-primary-5"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="card h-96 animate-pulse bg-white-10" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-8">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card group flex flex-col p-3"
                            >
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover-scale-110"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                                        <Star size={12} fill="currentColor" />
                                        {product.rating}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-playfair text-lg font-bold mb-1 group-hover-text-primary transition-colors">{product.name}</h3>
                                    <p className="text-xs text-muted mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-accent-10">
                                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="btn-primary p-2 rounded-lg hover-scale-105"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20 card border-dashed border-primary/20 bg-primary/5">
                        <p className="text-muted italic">No products found. Try a different search or category.</p>
                    </div>
                )}
            </div>

            {/* Cart Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black-10 backdrop-blur-sm z-50 pt-0"
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col pt-0"
                        >
                            <div className="p-6 border-b border-accent-10 flex items-center justify-between bg-texture">
                                <h2 className="text-2xl font-playfair font-bold flex items-center gap-3">
                                    <ShoppingBag className="text-primary" />
                                    Your Wardrobe
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover-bg-primary-5 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-primary-5 rounded-full flex items-center justify-center mb-4">
                                            <ShoppingBag size={32} className="text-primary opacity-20" />
                                        </div>
                                        <p className="text-muted italic">Your cart is as empty as an unthreaded needle.</p>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="mt-6 text-primary font-bold underline underline-offset-4"
                                        >
                                            Keep Browsing
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-muted hover-text-error transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-muted mb-2">₹{item.price}</p>
                                                <div className="flex items-center gap-3 mt-auto">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 rounded-full border border-accent-10 flex items-center justify-center hover-bg-primary-5"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 rounded-full border border-accent-10 flex items-center justify-center hover-bg-primary-5"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 bg-texture border-t border-accent-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-muted">Total Balance</span>
                                        <span className="text-3xl font-playfair font-black text-primary">₹{cartTotal}</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            router.push('/checkout');
                                        }}
                                        className="btn-primary w-full py-4 text-lg shadow-xl hover:scale-[1.01] flex items-center justify-center gap-3 group"
                                    >
                                        Checkout & Deliver
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-[10px] text-center text-muted mt-4 uppercase tracking-widest">
                                        Premium Tailoring • Secure Stripe Checkout
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
