import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { auth } from '@/auth';

/**
 * PATCH /api/orders/[id]/status
 * Update order status (tailor/admin only) or payment status
 */
export async function PATCH(
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
        const body = await request.json();
        const { status, payment_status, stripe_payment_intent } = body;

        // Verify order exists
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const userId = session.user.id;
        const role = session.user.role;

        // Only admin, assigned tailor, or order owner can update
        const isTailor = order.tailor_id?.toString() === userId;
        const isOwner = order.client_id?.toString() === userId;

        if (role !== 'admin' && !isTailor && !isOwner) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updateData: any = {};

        if (status) {
            const validStatuses = ['PENDING', 'ACCEPTED', 'STITCHING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
            if (!validStatuses.includes(status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }
            updateData.status = status;
        }

        if (payment_status) {
            const validPaymentStatuses = ['UNPAID', 'PENDING', 'PAID', 'REFUNDED'];
            if (!validPaymentStatuses.includes(payment_status)) {
                return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
            }
            updateData.payment_status = payment_status;
        }

        if (stripe_payment_intent) {
            updateData.stripe_payment_intent = stripe_payment_intent;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
        }

        await Order.findByIdAndUpdate(id, updateData);

        return NextResponse.json({ message: 'Order updated successfully' });
    } catch (error: any) {
        console.error("API Order Status Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
