import { NextRequest, NextResponse } from 'next/server';
import { stripeServer } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

/**
 * TIPOS DE SESIONES
 */
const SESSIONS = {
    individual: {
        name: 'Sesión Terapéutica Individual',
        price: 6000,
        description: 'Sesión de 50 minutos vía videollamada.',
    },
    pack5: {
        name: 'Pack 5 Sesiones',
        price: 25000,
        description: 'Bono de 5 sesiones individuales para tu proceso terapéutico.',
    }
};

export async function POST(req: NextRequest) {
    try {
        const { type } = await req.json();
        const supabase = createClient();

        // Obtener usuario autenticado si existe
        const { data: { user } } = await supabase.auth.getUser();

        const selectedSession = SESSIONS[type as keyof typeof SESSIONS];

        if (!selectedSession) {
            return NextResponse.json({ error: 'Tipo de sesión no válido' }, { status: 400 });
        }

        // Creamos la sesión de Checkout de Stripe
        const session = await stripeServer.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user?.email, // Pre-rellenar email si está logueado
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: selectedSession.name,
                            description: selectedSession.description,
                        },
                        unit_amount: selectedSession.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.nextUrl.origin}/`,
            metadata: {
                session_type: type,
                user_id: user?.id || 'anonymous', // Guardamos el ID del usuario
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
