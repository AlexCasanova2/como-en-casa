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
        const body = await req.json();
        console.log('Checkout request body:', body);
        const { type, bookingMetadata } = body;
        const supabase = createClient();

        // 1. Obtener detalles del servicio desde la base de datos
        console.log('Fetching service with ID:', type);
        const { data: service, error: serviceError } = await supabase
            .from('servicios')
            .select('*')
            .eq('id', type)
            .single();

        if (serviceError || !service) {
            console.error('Service not found or error:', serviceError);
            return NextResponse.json({ error: 'Servicio no encontrado en la base de datos' }, { status: 404 });
        }

        console.log('Service found:', service.name);

        // 2. Obtener usuario autenticado si existe
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Authenticated user:', user?.id || 'none');

        // 3. Creamos la sesión de Checkout de Stripe
        console.log('Creating Stripe session...');
        const session = await stripeServer.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user?.email || bookingMetadata?.email,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: service.name,
                            description: service.description || undefined,
                        },
                        unit_amount: service.price_cents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.nextUrl.origin}/reservar`,
            metadata: {
                service_id: type,
                user_id: user?.id || 'anonymous',
                booking_date: bookingMetadata?.date,
                booking_time: bookingMetadata?.time,
                therapist_id: bookingMetadata?.therapistId || 'auto',
                full_name: bookingMetadata?.fullName,
                email: bookingMetadata?.email,
                phone: bookingMetadata?.phone,
                notes: bookingMetadata?.notes
            },
        });

        console.log('Stripe session created:', session.url);
        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: `Error del servidor: ${error.message}` }, { status: 500 });
    }
}
