import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/posts
 * Fetch posts with tailor info, images, tags, like counts
 */
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '12', 10);
        const tailorId = searchParams.get('tailor_id') || '';
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (tailorId) {
            filter.tailor_id = tailorId;
        }

        const total = await Post.countDocuments(filter);
        const posts = await Post.find(filter)
            .populate('tailor_id', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format for backward compatibility
        const formattedPosts = posts.map(p => {
            const post = p.toObject();
            return {
                ...post,
                tailor_name: (post.tailor_id as any)?.name,
                tailor_image: (post.tailor_id as any)?.image,
                like_count: post.likes?.length || 0,
                images: post.images?.map((img: any) => img.url) || [],
                tags: post.tags || []
            };
        });

        return NextResponse.json({ posts: formattedPosts, total, page, limit });
    } catch (error: any) {
        console.error("API Posts GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/posts
 * Create a new portfolio post (tailor only)
 */
export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user || (session.user.role !== 'tailor' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Only tailors can create posts' }, { status: 403 });
        }

        const body = await request.json();
        const { title, content, images, tags } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const tailorId = session.user.id;

        const post = await Post.create({
            tailor_id: tailorId,
            title,
            content,
            images: images?.map((url: string, index: number) => ({ url, sort_order: index })) || [],
            tags: tags || []
        });

        return NextResponse.json({ id: post._id, message: 'Post created' }, { status: 201 });
    } catch (error: any) {
        console.error("API Posts POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
