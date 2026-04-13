import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users
 * List all users with pagination, search, role filter (admin only)
 */
export async function GET(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const q = searchParams.get('q') || '';
        const role = searchParams.get('role') || '';
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ];
        }

        if (role) {
            filter.role = role;
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({ users, total, page, limit });
    } catch (error: any) {
        console.error("API Admin Users GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/users - Update user role or status
 */
export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { user_id, role, is_active } = body;

        if (!user_id) {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        }

        const updateData: any = {};

        if (role) {
            if (!['user', 'tailor', 'admin'].includes(role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            updateData.role = role;
        }

        if (is_active !== undefined) {
            updateData.is_active = is_active;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(user_id, updateData, { new: true });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully', user });
    } catch (error: any) {
        console.error("API Admin Users PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/users - Soft-delete a user
 */
export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'User id required' }, { status: 400 });
        }

        // Soft delete
        const user = await User.findByIdAndUpdate(userId, { is_active: false }, { new: true });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deactivated' });
    } catch (error: any) {
        console.error("API Admin Users DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
