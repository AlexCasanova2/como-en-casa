import { loadStripe, Stripe } from '@stripe/stripe-js';
import StripeNode from 'stripe';

// Configuración para el cliente (Browser)
let stripePromise: Promise<Stripe | null>;
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }
    return stripePromise;
};

// Configuración para el servidor (API Routes)
export const stripeServer = new StripeNode(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any, // Usa la versión más reciente
    typescript: true,
});
