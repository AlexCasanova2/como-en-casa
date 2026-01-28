import { NextRequest, NextResponse } from 'next/server';
import { stripeServer } from '@/lib/stripe';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendBookingSummary, sendWelcomeEmail } from '@/lib/email/service';

export async function POST(req: NextRequest) {
    console.log('>>> WEBHOOK HIT AT:', new Date().toISOString());
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

    const admin = createAdminClient();
    console.log('Webhook start. Event type:', event.type);

    try {
        // Manejar el evento de éxito
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            console.log('Session Metadata:', session.metadata);
            const meta = session.metadata;

            if (!meta) {
                console.error('CRITICAL: No metadata found in checkout session');
                return NextResponse.json({ error: 'Metadata missing' }, { status: 400 });
            }

            let finalUserId = meta.user_id;
            console.log('Processing user for ID/Email:', finalUserId, meta.email);

            // 1. Asegurar usuario y perfil
            if (finalUserId === 'anonymous') {
                // Intentamos buscar si ya existe un usuario con ese email
                const { data: existingUsers } = await admin.auth.admin.listUsers();
                const existingUser = existingUsers.users.find(u => u.email?.toLowerCase() === meta.email?.toLowerCase());

                if (existingUser) {
                    console.log('User already exists by email:', existingUser.id);
                    finalUserId = existingUser.id;
                } else {
                    console.log('Creating new user for:', meta.email);
                    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
                        email: meta.email,
                        email_confirm: true,
                        user_metadata: { full_name: meta.full_name, role: 'paciente' }
                    });

                    if (createError) {
                        console.error('CRITICAL: Error creating user:', createError);
                        // Si falla por alguna razón (ej. carrera), intentamos buscar de nuevo
                        const { data: retryUsers } = await admin.auth.admin.listUsers();
                        const retryUser = retryUsers.users.find(u => u.email?.toLowerCase() === meta.email?.toLowerCase());
                        if (retryUser) finalUserId = retryUser.id;
                    } else if (newUser?.user) {
                        finalUserId = newUser.user.id;
                        console.log('New user created successfully:', finalUserId);
                    }
                }
            }

            // Asegurarnos de que el perfil existe y está actualizado (UPSERT)
            if (finalUserId && finalUserId !== 'anonymous') {
                console.log('Ensuring profile exists for:', finalUserId);
                const { error: profileError } = await admin.from('profiles').upsert({
                    id: finalUserId,
                    full_name: meta.full_name,
                    role: 'paciente',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

                if (profileError) {
                    console.error('Error in profile upsert:', profileError);
                }
            } else {
                console.error('CRITICAL: Could not determine finalUserId move forward');
                return NextResponse.json({ error: 'User creation/lookup failed' }, { status: 500 });
            }

            // 2. Determinar Terapeuta (Auto-asignación)
            let finalTherapistId = meta.therapist_id;
            if (finalTherapistId === 'auto') {
                // Parsing manual para evitar problemas de zona horaria con getDay()
                const [y, m, d] = meta.booking_date.split('-').map(Number);
                const dayOfWeek = new Date(y, m - 1, d).getDay();

                const { data: available } = await admin
                    .from('disponibilidad_semanal')
                    .select('terapeuta_id')
                    .eq('dia_semana', dayOfWeek)
                    .lte('hora_inicio', meta.booking_time)
                    .gt('hora_fin', meta.booking_time)
                    .limit(1)
                    .single();

                if (available) finalTherapistId = available.terapeuta_id;
                console.log('Auto-assigned therapist:', finalTherapistId);
            }

            // 3. Registrar la compra en sesiones_compradas
            console.log('Inserting into sesiones_compradas for therapist:', finalTherapistId);
            const { error: sessionError } = await admin
                .from('sesiones_compradas')
                .insert({
                    user_id: finalUserId,
                    service_id: meta.service_id,
                    terapeuta_id: finalTherapistId, // <--- AHORA SÍ
                    stripe_session_id: session.id,
                    status: 'paid'
                });

            if (sessionError) {
                console.error('CRITICAL: Error inserting into sesiones_compradas:', sessionError);
            }

            // 4. Registrar la cita en 'citas'
            const startDate = new Date(`${meta.booking_date}T${meta.booking_time}:00Z`);
            const endDate = new Date(startDate.getTime() + 50 * 60000); // +50 min

            console.log('Inserting into citas table...');
            const { error: appointmentError } = await admin
                .from('citas')
                .insert({
                    user_id: finalUserId,
                    terapeuta_id: finalTherapistId,
                    servicio_id: meta.service_id,
                    fecha_inicio: startDate.toISOString(),
                    fecha_fin: endDate.toISOString(),
                    status: 'paid'
                });

            if (appointmentError) {
                console.error('CRITICAL: Error creating appointment in citas table:', appointmentError);
            }

            // 4. Enviar emails
            let setupUrl = undefined;
            if (meta.user_id === 'anonymous') {
                console.log('Generating password invite link...');
                const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
                    type: 'invite',
                    email: meta.email,
                    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://psicologiacomoencasa.com'}/dashboard` }
                });
                if (!linkError && linkData?.properties?.action_link) {
                    setupUrl = linkData.properties.action_link;
                } else if (linkError) {
                    console.error('Error generating invite link:', linkError);
                }
            }

            console.log('Sending emails...');
            await sendWelcomeEmail(meta.email, meta.full_name, setupUrl);
            await sendBookingSummary(meta.email, {
                service_id: meta.service_id,
                date: meta.booking_date,
                time: meta.booking_time,
                therapist_id: finalTherapistId
            });

            console.log('¡Reserva completada con éxito!');
        }
    } catch (globalError: any) {
        console.error('CRITICAL: Unhandled error in Stripe webhook:', globalError);
        return NextResponse.json({ error: 'Internal Server Error during webhook' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
