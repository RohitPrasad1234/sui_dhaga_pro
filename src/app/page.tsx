"use client";

import Navbar from "@/components/Navbar";
import { Scissors, Star, Truck, Heart, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card flex flex-col items-center text-center group"
  >
    <div className="p-4 bg-primary-5 rounded-full text-primary mb-6 transition-colors group-hover-bg-primary group-hover-text-white">
      <Icon size={32} />
    </div>
    <h3 className="font-playfair text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-texture">
      <Navbar session={session} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Artisan Tailor Hero"
            fill
            className="object-cover brightness-70"
            priority
          />
          <div className="absolute inset-0 bg-primary opacity-10"></div>
        </div>

        <div className="container relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl px-6"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-30 backdrop-blur-sm text-secondary text-sm font-semibold mb-6 tracking-widest uppercase">
              The Artisan Tailor Marketplace
            </span>
            <h1 className="text-6xl md-text-8xl font-playfair font-bold mb-8 leading-[1.1]">
              Sui Dhaga: <br />
              <span className="text-secondary italic">Every Stitch</span> Tells a Story.
            </h1>
            <p className="text-lg md-text-xl text-white-80 mb-10 max-w-lg leading-relaxed font-light">
              Connect with India's most talented tailors, share creative inspirations, and experience premium custom tailoring delivered with love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary flex items-center gap-2 group px-8 py-4 shadow-xl">
                Explore Tailors
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ideas" className="px-8 py-4 border border-white-10 backdrop-blur-sm rounded-md font-medium hover-bg-white hover-text-black transition-all">
                Creative Ideas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md-text-5xl font-playfair font-bold mb-6">Experience the Craft</h2>
            <p className="text-muted">Discover a platform where traditional artistry meets modern convenience.</p>
          </div>

          <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
            <FeatureCard
              icon={Scissors}
              title="Expert Stitching"
              description="Connect with seasoned tailors specializing in everything from ethinic wear to modern silhouettes."
              delay={0.1}
            />
            <FeatureCard
              icon={Heart}
              title="Creative Community"
              description="A space for tailors to showcase their portfolios and for users to discover the latest fashion trends."
              delay={0.2}
            />
            <FeatureCard
              icon={Truck}
              title="Express Delivery"
              description="Track your orders in real-time. We ensure your custom creations reach you safely and swiftly."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 border-t border-accent-10">
        <div className="container">
          <div className="grid grid-cols-1 lg-grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558603668-6570496b66f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Tailor Portfolio"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary-20 hover-bg-transparent transition-all duration-500" />
            </div>

            <div className="space-y-8">
              <span className="text-primary font-bold tracking-widest uppercase">For Tailors</span>
              <h2 className="text-4xl md-text-5xl font-playfair font-bold">Grow Your Craftsmanship Digitally.</h2>
              <p className="text-muted text-lg leading-relaxed">
                As a tailor on Sui Dhaga, you gain access to a wide client base, tools to manage your stitching orders,
                and a dedicated space to post your creative ideas and portfolios. Show the world what you can do.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-6 h-6 rounded-full bg-secondary-10 flex items-center justify-center text-secondary">✓</span>
                  Manage Order Status (Stitching, Ready, Out)
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-6 h-6 rounded-full bg-secondary-10 flex items-center justify-center text-secondary">✓</span>
                  Showcase Portfolio with High-Res Images
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="w-6 h-6 rounded-full bg-secondary-10 flex items-center justify-center text-secondary">✓</span>
                  Communicate Directly with Fashion Enthusiasts
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/register?role=tailor" className="btn-primary inline-flex items-center gap-3 px-10 py-5 text-lg shadow-xl hover-scale-105 transition-all">
                  Join as a Tailor
                  <ChevronRight size={22} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark pt-24 pb-12 text-white-70 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary opacity-30"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-5 rounded-full blur-3xl opacity-10"></div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-16 mb-20">
            <div className="lg-col-span-1">
              <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                <div className="bg-primary p-2\.5 rounded-xl text-white shadow-lg group-hover-rotate-12 transition-transform">
                  <Scissors size={24} />
                </div>
                <span className="font-playfair text-3xl font-black text-white tracking-tight">Sui Dhaga</span>
              </Link>
              <p className="text-white-50 leading-relaxed font-light mb-8 max-w-xs">
                Empowering the community of artisans and providing premium custom stitching services to your doorstep.
                Every stitch crafted with love and tradition.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white-5 flex items-center justify-center hover-bg-primary transition-colors cursor-pointer border border-white-10">
                  <span className="text-white text-xs font-bold">In</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white-5 flex items-center justify-center hover-bg-primary transition-colors cursor-pointer border border-white-10">
                  <span className="text-white text-xs font-bold">Tw</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white-5 flex items-center justify-center hover-bg-primary transition-colors cursor-pointer border border-white-10">
                  <span className="text-white text-xs font-bold">Ig</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-10 font-playfair text-xl tracking-wide border-b border-primary-20 pb-4 inline-block">Platform</h4>
              <ul className="space-y-5">
                <li><Link href="/explore" className="text-white-60 hover-text-secondary transition-colors inline-block">Explore Tailors</Link></li>
                <li><Link href="/ideas" className="text-white-60 hover-text-secondary transition-colors inline-block">Creative Ideas</Link></li>
                <li><Link href="/about" className="text-white-60 hover-text-secondary transition-colors inline-block">Our Story</Link></li>
                <li><Link href="/blog" className="text-white-60 hover-text-secondary transition-colors inline-block">Fashion Journal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-10 font-playfair text-xl tracking-wide border-b border-primary-20 pb-4 inline-block">Community</h4>
              <ul className="space-y-5 text-sm">
                <li><Link href="/login" className="text-white-60 hover-text-secondary transition-colors inline-block">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-white-60 hover-text-secondary transition-colors inline-block">Privacy Policy</Link></li>
                <li><Link href="/support" className="text-white-60 hover-text-secondary transition-colors inline-block">Support Center</Link></li>
                <li><Link href="/faq" className="text-white-60 hover-text-secondary transition-colors inline-block">Common Questions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-10 font-playfair text-xl tracking-wide border-b border-primary-20 pb-4 inline-block">Newsletter</h4>
              <p className="text-white-40 mb-6 text-sm leading-relaxed">Join 5,000+ fashion enthusiasts and get exclusive tailoring tips.</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-white-5 border border-white-10 rounded-xl px-4 py-4 text-sm text-white focus-border-secondary outline-none transition-all pr-12"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary px-3 rounded-lg text-white hover-bg-secondary transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white-5 flex flex-col md-flex-row justify-between items-center gap-6">
            <p className="text-white-30 text-xs font-light tracking-widest uppercase">
              © {new Date().getFullYear()} Sui Dhaga. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-white-30 text-xs uppercase tracking-widest">
              <span>Made with India's Heritage</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
