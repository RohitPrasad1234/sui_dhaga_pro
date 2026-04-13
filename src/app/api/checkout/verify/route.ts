import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

/**
 * POST /api/checkout/verify
 * Verifies a Stripe Checkout session and updates the order status in the database.
 * This is used as a reliable alternative to webhooks for local development.
 */
export async function POST(request: Request) {
    try {
        await dbConnect();
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // 1. Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Session is not paid' }, { status: 400 });
        }

        // 2. Extract Order ID from metadata
        const orderId = session.metadata?.order_id;
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID missing in metadata' }, { status: 400 });
        }

        // 3. Check if order exists
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const totalAmount = (session.amount_total || 0) / 100;

        // 4. Update Database if status is still PENDING
        if (order.payment_status !== 'PAID') {
            // Update Order
            order.payment_status = 'PAID';
            order.stripe_session_id = session.id;
            order.stripe_payment_intent = session.payment_intent as string;
            
            // Add to Payments embedded array if not already present
            const alreadyPaid = order.payments.some(p => p.payment_amount === totalAmount);
            if (!alreadyPaid) {
                order.payments.push({
                    payment_date: new Date(),
                    payment_method: 1, // Stripe integration
                    payment_amount: totalAmount
                });
            }

            await order.save();
            
            console.log(`Order #${orderId} verified and updated manually via Success Page fallback.`);
        }

        return NextResponse.json({ 
            success: true, 
            orderId,
            sessionId: session.id,
            amount: totalAmount
        });

    } catch (error: any) {
        console.error("Verification API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
