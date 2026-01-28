import { resend } from '@/lib/resend';

/**
 * SERVICIO DE EMAIL REAL (Usando Resend)
 */

export async function sendBookingSummary(email: string, details: any) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Como en Casa <casanovaalex11@gmail.com>', // Necesitarás configurar tu dominio en Resend
            to: [email],
            subject: 'Resumen de tu reserva - Como en Casa',
            html: `
                <div style="font-family: sans-serif; color: #4a3f35;">
                    <h1 style="color: #d4a373;">¡Tu reserva está confirmada!</h1>
                    <p>Hola, aquí tienes los detalles de tu próxima sesión:</p>
                    <div style="background: #fdf6e3; padding: 20px; border-radius: 10px;">
                        <p><strong>Día:</strong> ${details.date}</p>
                        <p><strong>Hora:</strong> ${details.time}</p>
                        <p><strong>Terapeuta:</strong> ${details.therapist_id === 'auto' ? 'Asignando...' : 'Tu terapeuta seleccionado'}</p>
                    </div>
                    <p>Te hemos enviado un enlace para la sesión a tu panel de paciente.</p>
                    <a href="https://psicologiacomoencasa.com/dashboard" style="display: inline-block; padding: 10px 20px; background: #4a3f35; color: white; text-decoration: none; border-radius: 50px; margin-top: 20px;">
                        Ir a mi Panel
                    </a>
                </div>
            `
        });

        if (error) {
            console.error('Error enviando email de resumen:', error);
        }
        return data;
    } catch (err) {
        console.error('Error inesperado en el servicio de email:', err);
    }
}

export async function sendWelcomeEmail(email: string, fullName: string, setupUrl?: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Como en Casa <casanovaalex11@gmail.com>',
            to: [email],
            subject: 'Bienvenida a Como en Casa',
            html: `
                <div style="font-family: sans-serif; color: #4a3f35; max-width: 600px; margin: 0 auto; border: 1px solid #ede0d4; border-radius: 12px; padding: 40px;">
                    <h1 style="color: #d4a373;">¡Hola ${fullName}!</h1>
                    <p style="font-size: 1.1rem; line-height: 1.6;">Es un placer darte la bienvenida a <strong>Como en Casa</strong>.</p>
                    <p>Hemos creado tu cuenta automáticamente para que puedas gestionar tus citas y sesiones de forma segura.</p>
                    
                    ${setupUrl ? `
                    <div style="margin: 30px 0; padding: 20px; background: #fdf6e3; border-radius: 10px; text-align: center;">
                        <p style="margin-bottom: 20px;"><strong>Para acceder a tu panel por primera vez, necesitas crear una contraseña:</strong></p>
                        <a href="${setupUrl}" style="display: inline-block; padding: 12px 24px; background: #4a3f35; color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">
                            Establecer mi Contraseña
                        </a>
                    </div>
                    ` : `
                    <p>Puedes acceder a tu panel con tu email y la contraseña que utilizaste al registrarte.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://psicologiacomoencasa.com/dashboard" style="display: inline-block; padding: 12px 24px; background: #4a3f35; color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">
                            Acceder al Panel
                        </a>
                    </div>
                    `}
                    
                    <p style="margin-top: 40px; font-size: 0.9rem; color: #94a3b8;">Si tienes cualquier duda, estamos aquí para ayudarte.</p>
                </div>
            `
        });

        if (error) {
            console.error('Error enviando email de bienvenida:', error);
        }
        return data;
    } catch (err) {
        console.error('Error inesperado en bienvenida:', err);
    }
}
