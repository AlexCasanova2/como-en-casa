'use client'

import { useEffect, useState } from 'react'
import { getDashboardOverviewAction } from '@/app/actions/admin'
import { Users, CreditCard, Calendar, Activity, ArrowUpRight, ArrowDownRight, User } from 'lucide-react'
import Link from 'next/link'

export default function DashboardOverviewPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboardOverviewAction()
                setData(res)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#666' }}>
            <Activity className="animate-spin" size={32} />
            <span style={{ marginLeft: '1rem' }}>Cargando resumen...</span>
        </div>
    )

    if (!data) return <div>Error al cargar el dashboard</div>

    const { stats, recentBookings, isAdmin, userName } = data

    return (
        <div id="dashboard-overview" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Bienvenida */}
            <div id="welcome-section">
                <h2 style={{ fontSize: '1.5rem', color: '#4a4a4a', marginBottom: '0.5rem' }}>
                    ¡Hola, {userName.split(' ')[0]}! 👋
                </h2>
                <p style={{ color: '#999' }}>
                    {isAdmin ? 'Esto es lo que está pasando en la plataforma hoy.' : 'Aquí tienes tus próximas sesiones y actividad reciente.'}
                </p>
            </div>

            {/* Stats Cards */}
            <div id="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Tabla de Reservas Recientes */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#4a4a4a', fontWeight: 700 }}>Reservas Recientes</h3>
                        <Link href="/admin/dashboard/pagos" style={{ color: '#d4a373', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>Ver todas</Link>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    <th style={{ padding: '1rem 0.5rem', color: '#999', fontSize: '0.85rem', fontWeight: 600 }}>CLIENTE</th>
                                    <th style={{ padding: '1rem 0.5rem', color: '#999', fontSize: '0.85rem', fontWeight: 600 }}>SERVICIO</th>
                                    {isAdmin && <th style={{ padding: '1rem 0.5rem', color: '#999', fontSize: '0.85rem', fontWeight: 600 }}>TERAPEUTA</th>}
                                    <th style={{ padding: '1rem 0.5rem', color: '#999', fontSize: '0.85rem', fontWeight: 600 }}>ESTADO</th>
                                    <th style={{ padding: '1rem 0.5rem', color: '#999', fontSize: '0.85rem', fontWeight: 600 }}>FECHA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking: any) => (
                                    <tr key={booking.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '1.25rem 0.5rem', color: '#4a3f35', fontWeight: 600 }}>{booking.profiles?.full_name}</td>
                                        <td style={{ padding: '1.25rem 0.5rem', color: '#666' }}>{booking.servicios?.name}</td>
                                        {isAdmin && (
                                            <td style={{ padding: '1.25rem 0.5rem', color: '#666' }}>
                                                {booking.terapeuta?.profiles?.full_name || 'Asignando...'}
                                            </td>
                                        )}
                                        <td style={{ padding: '1.25rem 0.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: booking.status === 'paid' ? '#e9f7ef' : '#fef9e7',
                                                color: booking.status === 'paid' ? '#27ae60' : '#f1c40f'
                                            }}>
                                                {booking.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 0.5rem', color: '#999', fontSize: '0.85rem' }}>
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentBookings.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No hay reservas recientes.</div>
                        )}
                    </div>
                </div>

                {/* Info Lateral / Calendario Placeholder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: '#4a3f35', color: 'white' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Sugerencia Directiva</h4>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.5' }}>
                            Hemos notado un aumento del 15% en las búsquedas de "Ansiedad" este mes. Podrías considerar pedir a los terapeutas que añadan este tag a sus especialidades.
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'white', border: '1px solid #eee' }}>
                        <h4 style={{ fontSize: '1rem', color: '#4a4a4a', fontWeight: 700, marginBottom: '1.25rem' }}>Próximas Sesiones</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        <div className="glass" style={{ padding: '1.75rem', borderRadius: '24px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <div>
                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{title}</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4a3f35' }}>{value}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: positive ? '#27ae60' : '#e74c3c' }}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span style={{ fontWeight: 700 }}>{trend}</span>
                    <span style={{ color: '#ccc', fontWeight: 400, marginLeft: '0.25rem' }}>vs mes pasado</span>
                </div>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '15px', background: '#f8f9fa' }}>
                {icon}
            </div>
        </div>
    )
}

function AppointmentItem({ time, patient, type }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '15px', background: '#fdf6e3', border: '1px solid #ede0d4' }}>
            <div style={{ textAlign: 'center', minWidth: '45px', borderRight: '1px solid #ede0d4', paddingRight: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4a373', display: 'block' }}>{time}</span>
            </div>
            <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4a3f35', display: 'block' }}>{patient}</span>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>{type}</span>
            </div>
        </div>
    )
}
