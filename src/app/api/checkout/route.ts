import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session and returns the session URL
 */
export async function POST(request: Request) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items, customer_name, customer_phone, delivery_address } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items provided' }, { status: 400 });
        }

        // Build Stripe line items from cart items
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    description: item.category || 'Custom tailored garment',
                    images: item.image?.startsWith('http') ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses paise (cents)
            },
            quantity: item.quantity,
        }));

        // Add delivery charge
        lineItems.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Express Courier & Heritage Tax',
                    description: 'Premium delivery service',
                },
                unit_amount: 40000, // ₹400 in paise
            },
            quantity: 1,
        });

        // Calculate Total
        const totalAmount = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0) + 400; // include delivery

        // Create UNPAID Order in MongoDB
        const order = await Order.create({
            client_id: session.user.id,
            service_type: items.map((i: any) => i.name).join(', '),
            price: totalAmount,
            payment_status: 'PENDING',
            delivery_address: delivery_address || 'Address Pending',
            customer_name: customer_name || session.user.name,
            customer_phone: customer_phone || '',
            payment_method: 'Stripe',
            order_total: totalAmount,
            order_date: new Date(),
            items: items.map((item: any) => ({
                product_id: item.id && item.id !== 'null' ? item.id : null,
                product_name: item.name,
                product_image: item.image || '',
                price: item.price,
                quantity: item.quantity
            }))
        });

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['IN', 'US', 'GB', 'CA', 'AE', 'AU', 'SG']
            },
            line_items: lineItems,
            customer_email: session.user.email || undefined,
            metadata: {
                order_id: order._id.toString(),
            },
            success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout`,
        });

        return NextResponse.json({ 
            url: checkoutSession.url, 
            sessionId: checkoutSession.id 
        });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
