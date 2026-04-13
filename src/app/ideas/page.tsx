import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import IdeaCard from "@/components/IdeaCard";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

export default async function CreativeIdeas() {
    const session = await auth();

    await dbConnect();
    const posts = await Post.find()
        .populate('tailor_id', 'name image')
        .sort({ createdAt: -1 });

    const formattedPosts = posts.map(p => {
        const post = p.toObject();
        return {
            ...post,
            id: post._id.toString(),
            tailor_name: (post.tailor_id as any)?.name,
            tailor_image: (post.tailor_id as any)?.image,
            images: post.images?.map((img: any) => img.url) || [],
            // Format for IdeaCard compatibility
            tailorId: { name: (post.tailor_id as any)?.name || 'Tailor' }
        };
    });

    // Fallback mock posts if DB is empty
    const mockPosts = [
        {
            id: 'mock-1',
            _id: 'mock-1',
            title: 'Handcrafted Chikankari Saree',
            content: 'Exquisite handcrafted chikankari saree with intricate floral motifs and royal aesthetics. Perfect for every occasion.',
            images: ['https://images.unsplash.com/photo-1610030469983-ca885539c928?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
            tags: ['Traditional', 'Saree'],
            likes: [1, 2, 3, 4, 5],
            tailorId: { name: 'Arjun Verma' }
        },
        {
            id: 'mock-2',
            _id: 'mock-2',
            title: 'Modern Minimalist Suit',
            content: 'Custom tailored modern minimalist suit with clean lines and premium wool fabric. Designed for the contemporary professional.',
            images: ['https://images.unsplash.com/photo-1594932224010-75f430537039?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
            tags: ['Modern', 'Suit'],
            likes: [1, 2, 3],
            tailorId: { name: 'Saira Khan' }
        },
        {
            id: 'mock-3',
            _id: 'mock-3',
            title: 'Heritage Bandhgala Coat',
            content: 'A masterpiece created with traditional heritage techniques. Royal bandhgala coat perfect for the wedding season.',
            images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
            tags: ['Heritage', 'Royal'],
            likes: [1, 2, 3, 4, 5, 6, 7, 8],
            tailorId: { name: 'Anwar Qureshi' }
        }
    ];

    const displayPosts = formattedPosts.length > 0 ? formattedPosts : mockPosts;

    return (
        <main className="min-h-screen bg-texture">
            <Navbar session={session} />

            <section className="pt-32 pb-20">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
                        <span className="text-primary font-bold tracking-widest uppercase py-1 border-b-2 border-primary/20">The Canvas of Artisans</span>
                        <h1 className="text-5xl md:text-7xl font-playfair font-bold">Creative Vision & Handcrafted Ideas.</h1>
                        <p className="text-muted leading-relaxed">
                            Discover the latest fashion trends and portfolios from our community of expert tailors.
                            Find inspiration for your next custom creation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {displayPosts.map((post: any) => (
                            <IdeaCard key={post.id || post._id} post={post} />
                        ))}
                    </div>

                    {displayPosts.length === 0 && (
                        <div className="text-center py-20 card border-dashed border-primary/20 bg-primary/5">
                            <p className="text-muted italic">No creative ideas posted yet. Be the first to share your vision.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
