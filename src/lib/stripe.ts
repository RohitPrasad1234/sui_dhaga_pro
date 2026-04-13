/**
 * Stripe server-side configuration for Sui Dhaga
 */
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
    apiVersion: '2025-03-31.basil' as any,
    typescript: true,
});

export default stripe;
