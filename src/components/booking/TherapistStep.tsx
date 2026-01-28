'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookingData } from './BookingFlow'
import { ArrowLeft, UserCheck, Users } from 'lucide-react'
import Image from 'next/image'
import styles from './TherapistStep.module.css'

interface TherapistStepProps {
    bookingData: BookingData
    onSelect: (id: string | undefined, auto: boolean) => void
    onBack: () => void
}

export default function TherapistStep({ bookingData, onSelect, onBack }: TherapistStepProps) {
    const [therapists, setTherapists] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchAvailableTherapists() {
            if (!bookingData.date || !bookingData.time) return

            const dayOfWeek = new Date(bookingData.date).getDay()

            // 1. Obtener disponibilidad base
            const { data: availability, error } = await supabase
                .from('disponibilidad_semanal')
                .select('*, terapeutas(*, profiles(*))')
                .eq('dia_semana', dayOfWeek)
                .lte('hora_inicio', bookingData.time)
                .gt('hora_fin', bookingData.time)

            // 2. Obtener ocupación real (citas ya reservadas)
            const { getBookingOccupancyAction } = await import('@/app/actions/booking')
            const occupancyRes = await getBookingOccupancyAction(bookingData.date)
            const busyTherapistIds = occupancyRes.occupancy?.[bookingData.time] || []

            if (availability) {
                const uniqueTherapists = Array.from(new Set(availability.map(item => item.terapeutas.id)))
                    .map(id => availability.find(item => item.terapeutas.id === id).terapeutas)
                    // FILTRAR LOS QUE ESTÁN OCUPADOS
                    .filter(t => !busyTherapistIds.includes(t.id));

                setTherapists(uniqueTherapists)
            }
            setLoading(false)
        }
        fetchAvailableTherapists()
    }, [bookingData.date, bookingData.time])

    if (loading) return <div className={styles.loading}>Buscando terapeutas disponibles...</div>

    return (
        <div className={styles.step}>
            <button className={styles.backBtn} onClick={onBack}>
                <ArrowLeft size={18} /> Volver al calendario
            </button>

            <header className={styles.header}>
                <h2 className={styles.title}>Elige a tu compañera</h2>
                <p className={styles.subtitle}>Puedes elegir una terapeuta específica o dejar que el sistema te asigne la primera disponible.</p>
            </header>

            <div className={styles.options}>
                {/* Opción de Auto-selección */}
                <button
                    className={`${styles.card} ${styles.autoCard}`}
                    onClick={() => onSelect(undefined, true)}
                >
                    <div className={styles.autoIcon}>
                        <Users size={28} />
                    </div>
                    <div className={styles.info}>
                        <h3 className={styles.name}>Asignación automática</h3>
                        <p className={styles.bio}>Te asignaremos a la terapeuta que mejor se adapte a tu horario de forma rápida.</p>
                    </div>
                    <div className={styles.badge}>Recomendado</div>
                </button>

                <div className={styles.divider}>
                    <span>O elige tú misma</span>
                </div>

                <div className={styles.grid}>
                    {therapists.map((t) => (
                        <button
                            key={t.id}
                            className={styles.therapistCard}
                            onClick={() => onSelect(t.id, false)}
                        >
                            <div className={styles.avatarWrapper}>
                                {t.profiles?.avatar_url ? (
                                    <Image
                                        src={t.profiles.avatar_url}
                                        alt={t.profiles.full_name}
                                        width={60}
                                        height={60}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.initials}>{t.profiles.full_name[0]}</div>
                                )}
                            </div>
                            <div className={styles.tInfo}>
                                <h4 className={styles.tName}>{t.profiles.full_name}</h4>
                                <p className={styles.tBio}>{t.bio?.substring(0, 60)}...</p>
                            </div>
                            <UserCheck size={20} className={styles.selectIcon} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
