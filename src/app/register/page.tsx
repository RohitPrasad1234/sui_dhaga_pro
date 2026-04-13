"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";
import { Scissors, User as UserIcon, Mail, Lock, UserPlus, ArrowLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

import { Suspense } from "react";

function RegisterContent() {
    const searchParams = useSearchParams();
    const initialRole = searchParams.get("role") === "tailor" ? "tailor" : "user";
    const [role, setRole] = useState(initialRole);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        formData.append("role", role);

        try {
            const res = await registerUser(formData);
            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else if (res?.success) {
                router.push("/login");
            }
        } catch (err: any) {
            if (err.message === "NEXT_REDIRECT") return;
            setError("Registration failed. Please try again.");
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-inter overflow-hidden bg-black">
            {/* --- Background Layer --- */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <img 
                    src="/images/golden_flower.png" 
                    alt="Background" 
                    className="w-full h-full object-cover scale-110 animate-pulse-slow"
                    style={{ animationDuration: '35s' }}
                />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] z-10 opacity-70" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[140px] z-10 opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 w-full max-w-[520px] px-6 py-10"
            >
                {/* Glassmorphic Registration Card */}
                <div className="bg-white/10 backdrop-blur-[45px] p-10 md:p-14 rounded-[3.5rem] border border-white/20 shadow-[0_64px_128px_-20px_rgba(0,0,0,0.8)]">
                    <div className="mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-white/40 hover:text-white transition-all group mb-8">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Return Path
                        </Link>
                        
                        <h1 className="text-5xl font-playfair font-black text-white mb-3">Join Us.</h1>
                        <p className="text-white/50 text-sm font-light italic leading-relaxed">Define your role in the Sui Dhaga artisan guild.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-red-400/20 backdrop-blur-md text-red-50 text-sm rounded-2xl border border-red-500/30 flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </motion.div>
                        )}

                        <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 mb-10">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${role === 'user' ? 'bg-primary text-white shadow-xl' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                Enthusiast
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('tailor')}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${role === 'tailor' ? 'bg-primary text-white shadow-xl' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                Master Tailor
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="group transition-all">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3 px-1 group-focus-within:text-white transition-colors">Identity</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
                                    <input required name="name" type="text" placeholder="Your Full Name" className="w-full pl-14 pr-7 py-5 bg-white/5 text-white placeholder:text-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/5 focus:bg-white/10 focus:border-white/30 transition-all text-lg" />
                                </div>
                            </div>
                            
                            <div className="group transition-all">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3 px-1 group-focus-within:text-white transition-colors">Communication</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
                                    <input required name="email" type="email" placeholder="example@domain.com" className="w-full pl-14 pr-7 py-5 bg-white/5 text-white placeholder:text-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/5 focus:bg-white/10 focus:border-white/30 transition-all text-lg" />
                                </div>
                            </div>

                            <div className="group transition-all">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3 px-1 group-focus-within:text-white transition-colors">Security</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
                                    <input 
                                        required 
                                        name="password" 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters" 
                                        className="w-full pl-14 pr-14 py-5 bg-white/5 text-white placeholder:text-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/5 focus:bg-white/10 focus:border-white/30 transition-all text-lg" 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading} 
                            type="submit" 
                            className="bg-primary text-white w-full py-6 rounded-2xl flex items-center justify-center gap-4 group shadow-[0_25px_50px_-12px_rgba(139,94,60,0.5)] hover:bg-accent active:scale-95 transition-all outline-none focus:ring-4 focus:ring-primary/40 border border-white/10 mt-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-xl font-bold tracking-tight">Initialize Account</span>
                                    <UserPlus size={24} className="group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="pt-10 text-center border-t border-white/10">
                            <p className="text-white/30 text-[10px] font-bold mb-4 tracking-[0.2em] uppercase">Already part of the guild?</p>
                            <Link href="/login" className="text-white text-xl font-black hover:text-secondary inline-flex items-center gap-3 transition-all group">
                                Sign In Instead
                                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}

export default function Register() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex flex-col items-center justify-center font-playfair">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <div className="text-primary text-2xl animate-pulse">Summoning Artisans...</div>
        </div>}>
            <RegisterContent />
        </Suspense>
    );
}
