'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookingData } from './BookingFlow'
import { Sparkles, Package, MoveRight } from 'lucide-react'
import styles from './ServiceStep.module.css'

interface ServiceStepProps {
    bookingData: BookingData
    onSelect: (service: any) => void
}

export default function ServiceStep({ onSelect }: ServiceStepProps) {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchServices() {
            const { data, error } = await supabase
                .from('servicios')
                .select('*')
            if (data) setServices(data)
            setLoading(false)
        }
        fetchServices()
    }, [])

    if (loading) return <div className={styles.loading}>Cargando servicios...</div>

    return (
        <div className={styles.step}>
            <header className={styles.header}>
                <h2 className={styles.title}>¿Qué tipo de apoyo buscas?</h2>
                <p className={styles.subtitle}>Elige la opción que mejor se adapte a tu situación actual.</p>
            </header>

            <div className={styles.grid}>
                {services.map((service) => (
                    <button
                        key={service.id}
                        className={styles.card}
                        onClick={() => onSelect(service)}
                    >
                        <div className={styles.iconWrapper}>
                            {service.is_pack ? <Package size={24} /> : <Sparkles size={24} />}
                        </div>
                        <div className={styles.info}>
                            <h3 className={styles.serviceName}>{service.name}</h3>
                            <p className={styles.serviceDesc}>{service.description}</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>{(service.price_cents / 100).toFixed(2)}€</span>
                                <span className={styles.duration}>{service.duration_minutes} min</span>
                            </div>
                        </div>
                        <MoveRight className={styles.arrow} size={20} />
                    </button>
                ))}
            </div>
        </div>
    )
}
