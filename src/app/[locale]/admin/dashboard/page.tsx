'use client'

import { useEffect, useState } from 'react'
import { getDashboardOverviewAction } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'
import { Users, CreditCard, Calendar, Activity, ArrowUpRight, ArrowDownRight, User, Video } from 'lucide-react'
import Link from 'next/link'
import styles from './DashboardOverview.module.css'

export default function DashboardOverviewPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [fixStatus, setFixStatus] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboardOverviewAction()
                setData(res)
                setIsAdmin(res.isAdmin)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleFixRoles = async () => {
        try {
            setFixStatus('Reparando...')
            const { fixExistingTherapistRolesAction } = await import('@/app/actions/admin')
            const result = await fixExistingTherapistRolesAction()
            setFixStatus(`¡Listo! Se corrigieron ${result.count} cuentas.`)
            setTimeout(() => setFixStatus(null), 5000)
        } catch (error) {
            setFixStatus('Error al reparar')
        }
    }

    const handleJoinRoom = (booking: any) => {
        router.push(`/dashboard/sesion/${booking.id}`)
    }

    if (loading) return (
        <div className={styles.loadingWrapper}>
            <p className={styles.loading}>Cargando resumen...</p>
        </div>
    )

    if (!data) return <div className={styles.emptyState}>Error al cargar el dashboard</div>

    const { stats, recentBookings, userName } = data

    return (
        <div className={styles.pageContainer}>
            {/* Bienvenida */}
            <div className={styles.welcomeSection}>
                <h2>¡Hola, {userName.split(' ')[0]}! 👋</h2>
                <p>
                    {isAdmin ? 'Esto es lo que está pasando en la plataforma hoy.' : 'Aquí tienes tus próximas sesiones y actividad reciente.'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Sesiones"
                    value={stats.totalSessions}
                    icon={<Calendar size={24} color="#d4a373" />}
                    trend="+12%"
                    positive={true}
                />
                <StatCard
                    title="Ingresos"
                    value={`${stats.totalRevenue}€`}
                    icon={<CreditCard size={24} color="#6b705c" />}
                    trend="+8%"
                    positive={true}
                />
                {isAdmin && (
                    <StatCard
                        title="Terapeutas"
                        value={stats.totalTherapists}
                        icon={<Users size={24} color="#a5a58d" />}
                        trend="+2"
                        positive={true}
                    />
                )}
                <StatCard
                    title="Pacientes Activos"
                    value="24"
                    icon={<User size={24} color="#b7b7a4" />}
                    trend="-3%"
                    positive={false}
                />
            </div>

            <div className={styles.mainGrid}>
                {/* Tabla de Reservas Recientes */}
                <div className={styles.recentBookingsCard}>
                    <div className={styles.cardHeader}>
                        <h3>Reservas Recientes</h3>
                        <Link href="/admin/dashboard/pagos" className={styles.viewAllLink}>Ver todas</Link>
                    </div>

                    <div className={styles.tableScroll}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>CLIENTE</th>
                                    <th className={styles.th}>SERVICIO</th>
                                    {isAdmin && <th className={styles.th}>TERAPEUTA</th>}
                                    <th className={styles.th}>ESTADO</th>
                                    <th className={styles.th}>FECHA</th>
                                    <th className={styles.th}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking: any) => (
                                    <tr key={booking.id} className={styles.bookingRow}>
                                        <td className={styles.tdName}>{booking.cliente?.full_name || 'Desconocido'}</td>
                                        <td className={styles.tdText}>{booking.servicios?.name}</td>
                                        {isAdmin && (
                                            <td className={styles.tdText}>
                                                {booking.terapeuta?.profiles?.full_name || 'Asignando...'}
                                            </td>
                                        )}
                                        <td style={{ padding: '1.25rem 0.5rem' }}>
                                            <span className={`${styles.statusBadge} ${booking.status === 'paid' ? styles.paid : styles.pending}`}>
                                                {booking.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className={styles.tdDate}>
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </td>
                                        <td className={styles.tdText}>
                                            {booking.status === 'paid' && (
                                                <button
                                                    onClick={() => handleJoinRoom(booking)}
                                                    className={styles.videoBtn}
                                                >
                                                    <Video size={14} /> Videollamada
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentBookings.length === 0 && (
                            <div className={styles.emptyState}>No hay reservas recientes.</div>
                        )}
                    </div>
                </div>

                {/* Info Lateral / Calendario Placeholder */}
                <div className={styles.sidebar}>
                    <div className={styles.tipCard}>
                        <h4>Sugerencia Directiva</h4>
                        <p>
                            Hemos notado un aumento del 15% en las búsquedas de "Ansiedad" este mes. Podrías considerar pedir a los terapeutas que añadan este tag a sus especialidades.
                        </p>
                    </div>

                    <div className={styles.appointmentsCard}>
                        <h4>Próximas Sesiones</h4>
                        <div className={styles.appointmentsList}>
                            <small style={{ color: '#999', fontStyle: 'italic' }}>El sistema de calendario se integrará próximamente con la tabla de citas programadas.</small>
                            <AppointmentItem time="17:00" patient="Marc Ribas" type="Terapia Individual" />
                            <AppointmentItem time="19:30" patient="Elena Gomez" type="Parejas" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend, positive }: any) {
    return (
        <div className={styles.statCard}>
            <div>
                <p className={styles.statTitle}>{title}</p>
                <h3 className={styles.statValue}>{value}</h3>
                <div className={`${styles.statTrend} ${positive ? styles.trendPositive : styles.trendNegative}`}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span className={styles.trendValue}>{trend}</span>
                    <span className={styles.trendLabel}>vs mes pasado</span>
                </div>
            </div>
            <div className={styles.statIconWrapper}>
                {icon}
            </div>
        </div>
    )
}

function AppointmentItem({ time, patient, type }: any) {
    return (
        <div className={styles.appointmentItem}>
            <div className={styles.appointmentTime}>
                <span className={styles.timeText}>{time}</span>
            </div>
            <div>
                <span className={styles.patientName}>{patient}</span>
                <span className={styles.appointmentType}>{type}</span>
            </div>
        </div>
    )
}
