import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { auth } from '@/auth';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orders
 * Returns orders for the current authenticated user (client or tailor)
 */
export async function GET(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const status = searchParams.get('status') || '';
        const skip = (page - 1) * limit;

        const userId = session.user.id;
        const role = session.user.role;

        const filter: any = {};

        if (role === 'admin') {
            // Admin sees all
        } else if (role === 'tailor') {
            filter.tailor_id = userId;
        } else {
            filter.client_id = userId;
        }

        if (status) {
            filter.status = status;
        }

        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .populate('client_id', 'name email phone')
            .populate('tailor_id', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Map for backward compatibility
        const formattedOrders = orders.map(o => {
            const order = o.toObject();
            return {
                ...order,
                client_name: (order.client_id as any)?.name,
                client_email: (order.client_id as any)?.email,
                client_phone: (order.client_id as any)?.phone,
                tailor_name: (order.tailor_id as any)?.name,
                tailor_email: (order.tailor_id as any)?.email,
                tailor_phone: (order.tailor_id as any)?.phone,
            };
        });

        return NextResponse.json({ orders: formattedOrders, total, page, limit });
    } catch (error: any) {
        console.error("API Orders GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/orders
 * Create a new order with items (called from checkout)
 */
export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            items,
            service_type,
            delivery_address,
            customer_name,
            customer_phone,
            tailor_id,
            total_price,
            stripe_session_id,
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        const clientId = session.user.id;
        const orderTotal = total_price || items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);

        const order = await Order.create({
            client_id: clientId,
            tailor_id: tailor_id && tailor_id !== 'null' ? tailor_id : null,
            service_type: service_type || items.map((i: any) => i.product_name).join(', '),
            price: orderTotal,
            delivery_address: delivery_address || 'Address Pending',
            customer_name: customer_name || session.user.name,
            customer_phone: customer_phone || null,
            stripe_session_id: stripe_session_id || null,
            payment_status: stripe_session_id ? 'PENDING' : 'UNPAID',
            order_total: orderTotal,
            order_date: new Date(),
            items: items.map((i: any) => ({
                product_id: i.product_id && i.product_id !== 'null' ? i.product_id : null,
                product_name: i.product_name,
                product_image: i.product_image || '',
                price: i.price,
                quantity: i.quantity
            })),
            payments: [{
                payment_date: new Date(),
                payment_method: 1, // Stripe
                payment_amount: orderTotal
            }]
        });

        return NextResponse.json({ id: order._id, message: 'Order created' }, { status: 201 });
    } catch (error: any) {
        console.error("API Orders POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
