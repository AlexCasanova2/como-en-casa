'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CreditCard, User, Calendar, Activity, CheckCircle, Clock } from 'lucide-react'
import styles from './PagosPage.module.css'

export default function PagosPage() {
    const [pagos, setPagos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPagos = async () => {
            const { data, error } = await supabase
                .from('sesiones_compradas')
                .select(`
          *,
          servicios(name, price_cents),
          cliente:profiles!sesiones_compradas_user_id_fkey(full_name)
        `)
                .order('created_at', { ascending: false })

            if (!error) setPagos(data)
            setLoading(false)
        }
        fetchPagos()
    }, [])

    if (loading) return (
        <div className={styles.loading}>
            <div className="spinner">Cargando transacciones...</div>
        </div>
    )

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.headerInfo}>
                <div>
                    <h2>Historial de Pagos</h2>
                    <p>Gestiona y visualiza todas las transacciones de la plataforma.</p>
                </div>
                <div className={styles.transactionBadge}>
                    <CreditCard size={18} color="#4a3f35" />
                    <span>{pagos.length} Transacciones</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>
                                    <div className={styles.thContent}><Calendar size={14} /> Fecha</div>
                                </th>
                                <th className={styles.th}>
                                    <div className={styles.thContent}><User size={14} /> Cliente</div>
                                </th>
                                <th className={styles.th}>
                                    <div className={styles.thContent}><Activity size={14} /> Servicio</div>
                                </th>
                                <th className={styles.th}>Monto</th>
                                <th className={styles.th}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagos.map((pago) => (
                                <tr key={pago.id} className={styles.row}>
                                    <td className={styles.tdDate}>
                                        {new Date(pago.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className={styles.tdUser}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userAvatar}>
                                                {pago.cliente?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <span className={styles.userName}>{pago.cliente?.full_name || 'Usuario desconocido'}</span>
                                        </div>
                                    </td>
                                    <td className={styles.tdService}>
                                        {pago.servicios?.name}
                                    </td>
                                    <td className={styles.tdAmount}>
                                        <span className={styles.amount}>
                                            {(pago.servicios?.price_cents / 100).toFixed(2)}€
                                        </span>
                                    </td>
                                    <td className={styles.tdStatus}>
                                        <div className={`${styles.statusBadge} ${pago.status === 'paid' ? styles.paid : styles.pending}`}>
                                            {pago.status === 'paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            {pago.status === 'paid' ? 'Completado' : 'Pendiente'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pagos.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <CreditCard size={32} color="#94a3b8" />
                        </div>
                        <h3 className={styles.emptyTitle}>Sin movimientos</h3>
                        <p className={styles.emptyDesc}>No se han registrado pagos en la plataforma todavía.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
