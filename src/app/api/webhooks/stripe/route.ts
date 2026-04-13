import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events (payment success, failure, etc.)
 */
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const sig = request.headers.get('stripe-signature');

        let event;

        // Verify webhook signature if secret is configured
        if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
            try {
                event = stripe.webhooks.constructEvent(
                    body,
                    sig,
                    process.env.STRIPE_WEBHOOK_SECRET
                );
            } catch (err: any) {
                console.error('Webhook signature verification failed:', err.message);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        } else {
            event = JSON.parse(body);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log(`Checkout session completed: ${session.id}. Data will be verified and stored via the Success Page redirection fallback.`);
                break;
            }

            case 'checkout.session.expired': {
                console.log('Checkout session expired:', event.data.object.id);
                break;
            }

            case 'payment_intent.payment_failed': {
                console.log('Payment failed:', event.data.object.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Stripe Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
