"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, ArrowLeft, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

function PaymentSuccessContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderRef, setOrderRef] = useState('');

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch('/api/checkout/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.error);

                // Success!
                setOrderRef(data.orderId || sessionId.slice(-8).toUpperCase());
                setStatus('success');
                clearCart();
            } catch (err) {
                console.error("Verification failed:", err);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [sessionId, clearCart]);

    if (status === 'loading') {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center font-inter">
                <div className="text-center space-y-6">
                    <Loader2 size={64} className="text-primary animate-spin mx-auto" />
                    <p className="text-white/60 text-lg italic">Confirming your payment...</p>
                </div>
            </main>
        );
    }

    if (status === 'error') {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center font-inter p-6">
                <div className="text-center space-y-8 max-w-md">
                    <h1 className="text-4xl font-playfair font-black text-white">Payment Issue</h1>
                    <p className="text-white/50 italic leading-relaxed">
                        We could not verify your payment session. If you were charged, please contact support.
                    </p>
                    <div className="flex flex-col gap-4">
                        <Link href="/checkout" className="w-full py-5 bg-primary text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3">
                            <ArrowLeft size={20} />
                            Return to Checkout
                        </Link>
                        <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors">Go Home</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black flex items-center justify-center font-inter p-6">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/70 z-10" />
                <img 
                    src="/images/golden_flower.png" 
                    alt="Background" 
                    className="w-full h-full object-cover animate-pulse-slow opacity-60 scale-105"
                    style={{ animationDuration: '30s' }}
                />
                
                {/* Dynamic Ambient Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] z-10 opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[140px] z-10 opacity-40" />
            </div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                className="relative z-20 text-center space-y-12 max-w-lg"
            >
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full scale-150 animate-pulse" />
                    <CheckCircle2 size={120} className="text-secondary relative z-10 filter drop-shadow-[0_0_20px_rgba(139,94,60,0.4)]" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-playfair font-black text-white leading-tight">Payment Secured!</h1>
                    <p className="text-white/60 text-lg leading-relaxed italic font-light max-w-sm mx-auto">
                        Your creation is now being handcrafted by our expert artisans. The journey has begun.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-[50px] p-8 rounded-[2.5rem] border border-white/20 text-left space-y-5 shadow-2xl">
                    <div className="flex justify-between items-end border-b border-white/10 pb-5">
                        <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Order Reference</span>
                        <span className="text-xl font-black text-white">#{orderRef}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Payment Status</span>
                        <span className="text-xl font-black text-secondary uppercase tracking-widest italic">Paid via Stripe</span>
                    </div>
                </div>

                <div className="flex flex-col gap-5 pt-8">
                    <Link href="/dashboard/user" className="w-full py-6 bg-white text-black font-black text-xl rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-12px_rgba(255,255,255,0.2)]">
                        <Package size={22} />
                        View My Orders
                        <ChevronRight size={22} />
                    </Link>
                    <Link href="/shop" className="w-full py-5 bg-white/10 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 border border-white/10 hover:bg-white/20 transition-all">
                        Continue Shopping
                    </Link>
                    <Link href="/" className="text-white/40 text-xs font-black tracking-widest uppercase hover:text-white transition-colors">Return to Home</Link>
                </div>
            </motion.div>
        </main>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-playfair">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                <div className="text-primary text-2xl animate-pulse">Confirming Payment...</div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
