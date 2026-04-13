"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PaymentRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        // Old payment page now redirects to checkout
        router.replace('/checkout');
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-playfair">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <div className="text-primary text-2xl animate-pulse">Redirecting to Checkout...</div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-playfair">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                <div className="text-primary text-2xl animate-pulse">Loading...</div>
            </div>
        }>
            <PaymentRedirect />
        </Suspense>
    );
}
