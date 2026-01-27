import { NextRequest, NextResponse } from 'next/server';
import { stripeServer } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event;

    try {
        event = stripeServer.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Manejar el evento de éxito
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // AQUÍ: Lógica para actualizar tu base de datos
        // - Marcar la sesión como pagada
        // - Enviar email de confirmación
        // - Generar link de Zoom/Meet, etc.
        console.log('Pago completado con éxito para:', session.metadata?.session_type);
    }

    return NextResponse.json({ received: true });
}
