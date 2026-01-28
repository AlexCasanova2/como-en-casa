'use client'

import { useState } from 'react'
import { BookingData } from './BookingFlow'
import { ArrowLeft, CreditCard, Lock } from 'lucide-react'
import styles from './ClientInfoStep.module.css'

interface ClientInfoStepProps {
    bookingData: BookingData
    onBack: () => void
}

export default function ClientInfoStep({ bookingData, onBack }: ClientInfoStepProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: ''
    })

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: bookingData.serviceId, // Usamos el ID del servicio
                    bookingMetadata: {
                        ...bookingData,
                        ...formData
                    }
                })
            })

            const { url, error } = await response.json()
            if (url) window.location.href = url
            else alert(error || 'Error al iniciar sesión de pago')
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Algo salió mal. Por favor intenta de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.step}>
            <button className={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={18} /> Volver a selección de terapeuta
            </button>

            <header className={styles.header}>
                <h2 className={styles.title}>Datos de contacto</h2>
                <p className={styles.subtitle}>Casi hemos terminado. Introduce tus datos para confirmar la reserva.</p>
            </header>

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span>Servicio:</span>
                    <strong>{bookingData.serviceName}</strong>
                </div>
                <div className={styles.summaryItem}>
                    <span>Fecha:</span>
                    <strong>{new Date(bookingData.date!).toLocaleDateString('es', { day: 'numeric', month: 'long' })} a las {bookingData.time}</strong>
                </div>
                <div className={styles.summaryItem}>
                    <span>Total:</span>
                    <strong className={styles.totalCents}>{(bookingData.priceCents! / 100).toFixed(2)}€</strong>
                </div>
            </div>

            <form onSubmit={handlePayment} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Ej. María García"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ejemplo@email.com"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Teléfono (opcional)</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+34 600 000 000"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Notas adicionales</label>
                    <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Si tienes algo que quieras comentarnos antes de la sesión..."
                    />
                </div>

                <div className={styles.secureBadge}>
                    <Lock size={14} /> Pago seguro gestionado por Stripe
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Cargando pasarela...' : (
                        <><CreditCard size={20} /> Proceder al pago</>
                    )}
                </button>
            </form>
        </div>
    )
}
