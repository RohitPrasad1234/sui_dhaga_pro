import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    BarChart3,
    Package,
    Settings,
    ShoppingBag,
    User as UserIcon,
    LogOut,
    Scissors,
    PlusCircle,
    LayoutDashboard,
    Heart,
    Tag
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    const role = session.user.role;

    const userLinks = [
        { name: "My Orders", href: "/dashboard/user", icon: ShoppingBag },
        { name: "My Likes", href: "/dashboard/user/likes", icon: Heart },
        { name: "Profile", href: "/dashboard/user/profile", icon: UserIcon },
    ];

    const tailorLinks = [
        { name: "Overview", href: "/dashboard/tailor", icon: LayoutDashboard },
        { name: "Incoming Orders", href: "/dashboard/tailor/orders", icon: Package },
        { name: "My Products", href: "/dashboard/tailor/products", icon: Tag },
        { name: "Portfolio Posts", href: "/dashboard/tailor/posts", icon: Scissors },
    ];

    const adminLinks = [
        { name: "Overview", href: "/dashboard/admin", icon: BarChart3 },
        { name: "Users", href: "/dashboard/admin/users", icon: UserIcon },
        { name: "Tailors", href: "/dashboard/admin/tailors", icon: Scissors },
        { name: "All Orders", href: "/dashboard/admin/orders", icon: Package },
    ];

    const links = role === 'admin' ? adminLinks : role === 'tailor' ? tailorLinks : userLinks;

    return (
        <div className="min-h-screen bg-texture">
            <Navbar session={session} />
            <div className="container pt-32 pb-20">
                <div className="grid grid-cols-1 lg-grid-cols-4 gap-10">
                    {/* Sidebar */}
                    <aside className="lg-col-span-1">
                        <div className="bg-white px-6 py-6 rounded-2xl shadow-sm border border-accent/5 sticky top-32">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {session.user.name?.[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm truncate w-24">{session.user.name}</h3>
                                    <p className="text-xs text-muted capitalize">{role}</p>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover-bg-primary-5 hover-text-primary transition-all"
                                    >
                                        <link.icon size={18} />
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="my-4 border-accent/10" />
                                <Link
                                    href="/api/auth/signout"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover-bg-white-10 transition-all"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg-col-span-3">
                        <div className="bg-white px-8 py-12 rounded-2xl shadow-sm border border-accent/5 min-h-[60vh]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
