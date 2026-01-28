'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Video, User } from 'lucide-react'
import styles from './DashboardPage.module.css'

export default function ClientDashboardPage() {
    const [citas, setCitas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchCitas = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('citas')
                    .select('*, terapeutas(profiles(full_name, avatar_url)), servicios(name)')
                    .eq('user_id', user.id)
                    .order('fecha_inicio', { ascending: true })
                if (data) setCitas(data)
            }
            setLoading(false)
        }
        fetchCitas()
    }, [])

    const handleJoinRoom = (cita: any) => {
        router.push(`/dashboard/sesion/${cita.id}`)
    }

    if (loading) return (
        <div className={styles.loadingWrapper}>
            <p className={styles.loading}>Cargando tus citas...</p>
        </div>
    )

    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.overlay} />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Mis Citas</h1>
                    <p className={styles.subtitle}>Aquí puedes ver tus próximas sesiones y el historial.</p>
                </header>

                <div className={styles.grid}>
                    {citas.length > 0 ? (
                        citas.map((cita) => {
                            const now = new Date()
                            const startTime = new Date(cita.fecha_inicio)
                            const canJoin = now >= new Date(startTime.getTime() - 10 * 60000)

                            return (
                                <div key={cita.id} className={styles.citaCard}>
                                    <div className={styles.dateInfo}>
                                        <div className={styles.dateBox}>
                                            <span className={styles.day}>{startTime.getDate()}</span>
                                            <span className={styles.month}>{startTime.toLocaleDateString('es', { month: 'short' })}</span>
                                        </div>
                                        <div className={styles.timeInfo}>
                                            <span className={styles.time}>
                                                <Clock size={16} />
                                                {startTime.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                                - {new Date(cita.fecha_fin).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className={styles.serviceName}>{cita.servicios?.name}</span>
                                            <div className={styles.metadata}>
                                                <span>{(cita.servicios?.price_cents / 100).toFixed(2)}€</span>
                                                <span>•</span>
                                                <span>50 min</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.therapistInfo}>
                                        <div className={styles.avatar}>
                                            {cita.terapeutas?.profiles?.avatar_url ? (
                                                <img src={cita.terapeutas.profiles.avatar_url} alt={cita.terapeutas.profiles.full_name} className={styles.avatarImg} />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <span className={styles.label}>Tu terapeuta</span>
                                            <span className={styles.tName}>{cita.terapeutas?.profiles?.full_name || 'Asignando...'}</span>
                                        </div>
                                        <div className={`${styles.statusBadge} ${styles[cita.status]}`}>
                                            {cita.status === 'paid' ? 'Pagada' : cita.status}
                                        </div>
                                    </div>

                                    <div className={styles.footer}>
                                        <button
                                            className={styles.joinBtn}
                                            disabled={!canJoin}
                                            onClick={() => handleJoinRoom(cita)}
                                        >
                                            <Video size={18} /> {canJoin ? 'Unirse a la sesión' : 'Disponible pronto'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className={styles.empty}>
                            <Calendar size={48} />
                            <p>Aún no tienes ninguna cita programada.</p>
                            <a href="/reservar" className={styles.bookLink}>Reservar mi primera cita</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
