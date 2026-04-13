import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { auth } from '@/auth';
import mongoose from 'mongoose';

/**
 * POST /api/posts/[id]/like - Toggle like on a post
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const userId = new mongoose.Types.ObjectId(session.user.id);

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if already liked
        const likedIndex = post.likes.findIndex(likeId => likeId.toString() === userId.toString());

        if (likedIndex > -1) {
            // Unlike
            post.likes.splice(likedIndex, 1);
            await post.save();
            return NextResponse.json({ liked: false, message: 'Post unliked' });
        } else {
            // Like
            post.likes.push(userId);
            await post.save();
            return NextResponse.json({ liked: true, message: 'Post liked' });
        }
    } catch (error: any) {
        console.error("API Post Like Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
