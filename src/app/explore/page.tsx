import dbConnect from "@/lib/db";
import User from "@/models/User";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { Search, Scissors, Star, MapPin, ChevronRight, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ExploreTailors() {
    const session = await auth();

    await dbConnect();
    const tailors = await User.find({ role: 'tailor', is_active: true }).sort({ createdAt: -1 });

    // Fallback mock data if no tailors registered
    const mockTailors = [
        {
            id: 'mock-1',
            name: 'Arjun Verma',
            bio: 'Expert in ethnic wear and bridal costumes. 15 years of experience in the heart of Delhi.',
            location: 'New Delhi, India',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'mock-2',
            name: 'Saira Khan',
            bio: 'Contemporary silhouettes and modern formal wear expert. Bringing Mumbai style to everyone.',
            location: 'Mumbai, India',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 'mock-3',
            name: 'Anwar Qureshi',
            bio: 'Traditional artisans specializing in sherwanis and heritage coats. Legacy of three generations.',
            location: 'Lucknow, India',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        }
    ];

    const displayTailors = tailors.length > 0 ? tailors : mockTailors;

    return (
        <main className="min-h-screen bg-texture">
            <Navbar session={session} />

            <section className="pt-32 pb-20">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-16">
                        <div className="max-w-xl space-y-4">
                            <span className="text-primary font-bold tracking-widest uppercase">The Artisan Directory</span>
                            <h1 className="text-5xl font-playfair font-bold">Discover Expert Tailors.</h1>
                            <p className="text-muted leading-relaxed">
                                Connect with the most talented artisans across the country.
                                Experience premium custom tailoring tailored to your measurements and lifestyle.
                            </p>
                        </div>

                        <div className="w-full md:w-auto">
                            <div className="relative group">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
                                <input
                                    type="text"
                                    placeholder="Search by city or style..."
                                    className="w-full md:w-80 pl-12 pr-4 py-4 bg-white rounded-full border border-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {displayTailors.map((tailor: any) => (
                            <div key={tailor.id} className="card p-0 overflow-hidden hover:border-primary/20 transition-all group shadow-sm hover:shadow-xl">
                                <div className="relative aspect-square">
                                    <Image
                                        src={tailor.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                        alt={tailor.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <div className="absolute bottom-6 left-6 text-white space-y-1">
                                        <h3 className="text-2xl font-playfair font-bold">{tailor.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                                            <MapPin size={12} className="text-secondary" />
                                            {tailor.location || 'India'}
                                        </div>
                                    </div>
                                    <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                                        <Scissors size={18} />
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase">
                                        <div className="flex items-center gap-1 text-secondary">
                                            <Star size={14} fill="currentColor" />
                                            <span>4.9 (120 Reviews)</span>
                                        </div>
                                        <div className="text-muted">Since 2012</div>
                                    </div>

                                    <p className="text-sm text-muted leading-relaxed line-clamp-3 italic">"{tailor.bio || 'Passionate about custom tailoring and creating timeless pieces with a modern twist.'}"</p>

                                    <div className="flex gap-4">
                                        <Link href={`/shop`} className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2 group">
                                            Book Service
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                        <Link href={`/ideas`} className="p-3 border border-secondary/20 rounded-xl hover:bg-primary hover:text-white transition-all">
                                            <Scissors size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
