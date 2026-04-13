"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, ArrowLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password.");
                setLoading(false);
            } else {
                window.location.href = "/";
            }
        } catch (err: any) {
            setError("Service unavailable. Please try again later.");
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 font-sans p-6 overflow-hidden">
            {/* --- Background Architecture --- */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute inset-0 bg-black/80 z-10 backdrop-blur-[8px]" />
                <img
                    src="/images/golden_flower.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40 scale-105"
                />
            </div>

            {/* --- Premium SaaS Card Container --- */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-20 w-full max-w-[420px]"
            >
                <div className="bg-[#0f0f10] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 rounded-3xl p-8 md:p-10">
                    
                    {/* Header: Clean & Modern */}
                    <div className="mb-10 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-300 hover:text-white transition-colors uppercase mb-8">
                            <ArrowLeft size={14} strokeWidth={2.5} />
                            Exit to Home
                        </Link>
                        
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Sui Dhaga.</h1>
                        <p className="text-zinc-400 text-sm font-medium">Verify your artisan credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs text-center rounded-xl font-semibold"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6">
                            {/* Email Field with Forced Padding */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-100 ml-1">Identity Path</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-800 transition-colors z-30 pointer-events-none">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@suidhaga.com"
                                        style={{ paddingLeft: '3.8rem' }}
                                        className="w-full h-[52px] pr-4 bg-[#f8f9fa] text-zinc-950 font-bold text-sm rounded-xl border-0 ring-1 ring-white/10 focus:ring-2 focus:ring-[#d4af37] transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>

                            {/* Password Field with Forced Padding */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-100">Digital Seal</label>
                                    <Link href="#" className="text-[10px] font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-800 transition-colors z-30 pointer-events-none">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ paddingLeft: '3.8rem' }}
                                        className="w-full h-[52px] pr-12 bg-[#f8f9fa] text-zinc-950 font-bold text-sm rounded-xl border-0 ring-1 ring-white/10 focus:ring-2 focus:ring-[#d4af37] transition-all placeholder:text-zinc-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-600 transition-colors z-30"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Centered, Modern Slate/Gold Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                disabled={loading}
                                type="submit"
                                style={{ backgroundColor: '#ffffff', color: '#09090b' }}
                                className="h-[52px] px-12 min-w-[220px] hover:bg-zinc-200 font-extrabold text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50 border border-white/10"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-zinc-900/20 border-t-zinc-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn size={20} strokeWidth={3} />
                                        <span>Sign In Now</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Subtle SaaS Footer */}
                        <div className="pt-10 text-center border-t border-white/5 mt-6">
                            <Link href="/register" className="text-zinc-400 text-xs hover:text-white transition-colors flex items-center justify-center gap-2 group">
                                New to Sui Dhaga? <span className="text-zinc-100 font-black border-b border-zinc-100/30 group-hover:border-zinc-100">Create Guild Identity</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Micro Footer Environment Info */}
                <div className="flex items-center justify-center gap-4 mt-12 opacity-30 select-none grayscale">
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Heritage Protocols</p>
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Node 2026</p>
                </div>
            </motion.div>
        </main>
    );
}