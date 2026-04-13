"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Scissors, User, Menu, X, ShoppingBag, PenSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function Navbar({ session }: { session: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Shop", href: "/shop", icon: ShoppingBag },
        { name: "Explore", href: "/explore", icon: Scissors },
        { name: "Creative Ideas", href: "/ideas", icon: PenSquare },
    ];

    const textColorClass = scrolled ? "text-text" : "text-white";
    const mobileToggleColor = scrolled ? "text-primary" : "text-white";

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-xl py-3" : "bg-black-10 backdrop-blur-sm py-6"}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-full text-white shadow-lg group-hover-rotate-12 transition-transform">
                        <Scissors size={20} />
                    </div>
                    <span className={`font-playfair text-2xl font-black tracking-tight ${scrolled ? "text-primary" : "text-white"}`}>Sui Dhaga</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md-flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-bold tracking-wide transition-colors hover-text-secondary ${pathname === link.href ? "text-secondary underline underline-offset-8" : textColorClass}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link href="/shop" className={`relative p-2 rounded-full transition-colors ${scrolled ? "hover-bg-primary-5" : "hover-bg-white-10"}`}>
                        <ShoppingBag size={20} className={textColorClass} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {session ? (
                        <Link href={session.user.role === 'admin' ? '/dashboard/admin' : session.user.role === 'tailor' ? '/dashboard/tailor' : '/dashboard/user'} className="flex items-center gap-2 btn-primary px-6 py-3">
                            <User size={18} />
                            <span className="font-bold">Dashboard</span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link href="/login" className={`text-sm font-bold hover-text-secondary transition-colors ${textColorClass}`}>Login</Link>
                            <Link href="/register" className="btn-primary px-8 py-3 shadow-lg">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button onClick={toggleMenu} className={`md-hidden ${mobileToggleColor} p-2 hover-bg-white-10 rounded-lg transition-colors`}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md-hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-accent-10 overflow-hidden"
                    >
                        <div className="flex flex-col gap-2 p-6 bg-texture">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={toggleMenu}
                                    className={`flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-all ${pathname === link.href ? "bg-primary text-white" : "text-text hover-bg-primary-5 hover-text-primary"}`}
                                >
                                    <link.icon size={22} className={pathname === link.href ? "text-white" : "text-primary"} />
                                    {link.name}
                                </Link>
                            ))}
                            <Link href="/shop" onClick={toggleMenu} className="flex items-center gap-4 p-4 rounded-xl text-lg font-bold text-text hover-bg-primary-5">
                                <div className="relative">
                                    <ShoppingBag size={22} className="text-primary" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-secondary text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                Shop
                            </Link>
                            <hr className="my-4 border-accent-10" />
                            {session ? (
                                <Link href="/dashboard" onClick={toggleMenu} className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
                                    <User size={20} />
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/login" onClick={toggleMenu} className="flex items-center justify-center py-4 font-bold text-text border border-accent-10 rounded-xl hover-bg-primary-5 transition-colors">Login</Link>
                                    <Link href="/register" onClick={toggleMenu} className="btn-primary flex items-center justify-center py-4 rounded-xl font-bold font-bold shadow-lg">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
