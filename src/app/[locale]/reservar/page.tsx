import BookingFlow from '@/components/booking/BookingFlow'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
    return {
        title: 'Reservar Cita | Como en Casa',
        description: 'Reserva tu sesión de terapia bilingüe online de forma fácil y segura.'
    }
}

export default async function ReservarPage() {
    return (
        <main style={{
            paddingTop: '120px',
            minHeight: '100vh',
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

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
                <BookingFlow />
            </div>
        </main>
    )
}
