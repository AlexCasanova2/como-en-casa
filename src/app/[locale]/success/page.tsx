'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Mail, Home } from 'lucide-react'
import { Link } from '@/i18n/routing'
import styles from './SuccessPage.module.css'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // En un caso real, aquí podríamos llamar a una API para verificar el estado
        // Pero el webhook ya se encarga de la lógica pesada
        const timer = setTimeout(() => setLoading(false), 1500)
        return () => clearTimeout(timer)
    }, [sessionId])

    if (loading) {
        return (
            <div className={styles.loadingContainer} style={{
                background: 'linear-gradient(135deg, #4a3f35 0%, #7a5448 50%, #d4a373 100%)',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.2)',
                    zIndex: 0
                }} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div className={styles.spinner} style={{ margin: '0 auto 1.5rem' }} />
                    <p>Verificando tu reserva...</p>
                </div>
            </div>
        )
    }

    return (
        <main className={styles.main} style={{
            background: 'linear-gradient(135deg, #4a3f35 0%, #7a5448 50%, #d4a373 100%)',
            position: 'relative'
        }}>
            {/* Overlay sutil para mejorar legibilidad del contenido */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.2)',
                zIndex: 0
            }} />

            <div className={styles.card} style={{ position: 'relative', zIndex: 1 }}>
                <div className={styles.iconWrapper}>
                    <CheckCircle size={60} />
                </div>

                <h1 className={styles.title}>¡Reserva Confirmada!</h1>
                <p className={styles.subtitle}>
                    Gracias por confiar en Como en Casa. Tu camino hacia el bienestar ha comenzado.
                </p>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <Calendar size={20} />
                        <div>
                            <span>Tu cita ha sido agendada</span>
                            <p>Recibirás un recordatorio 24h antes.</p>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <Mail size={20} />
                        <div>
                            <span>Revisa tu email</span>
                            <p>Te hemos enviado los detalles y el enlace de la sesión.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href="/dashboard" className={styles.primaryBtn}>
                        Ir a mi panel de paciente
                    </Link>
                    <Link href="/" className={styles.secondaryBtn}>
                        <Home size={18} /> Volver al Inicio
                    </Link>
                </div>
            </div>
        </main>
    )
}
