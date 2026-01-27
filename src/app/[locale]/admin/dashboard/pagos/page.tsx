'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PagosPage() {
    const [pagos, setPagos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPagos = async () => {
            const { data, error } = await supabase
                .from('sesiones_compradas')
                .select(`
          *,
          servicios(name),
          profiles:user_id(full_name)
        `)
                .order('created_at', { ascending: false })

            if (!error) setPagos(data)
            setLoading(false)
        }

        fetchPagos()
    }, [])

    if (loading) return <div>Cargando transacciones...</div>

    return (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', background: 'white' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8f9fa', color: '#6b705c' }}>
                    <tr>
                        <th style={{ padding: '1.5rem' }}>Fecha</th>
                        <th style={{ padding: '1.5rem' }}>Cliente</th>
                        <th style={{ padding: '1.5rem' }}>Servicio</th>
                        <th style={{ padding: '1.5rem' }}>Monto</th>
                        <th style={{ padding: '1.5rem' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map((pago) => (
                        <tr key={pago.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1.5rem', color: '#666' }}>{new Date(pago.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '1.5rem', fontWeight: 600 }}>{pago.profiles?.full_name || 'Usuario desconocido'}</td>
                            <td style={{ padding: '1.5rem' }}>{pago.servicios?.name}</td>
                            <td style={{ padding: '1.5rem' }}>{pago.servicios?.price_cents / 100}€</td>
                            <td style={{ padding: '1.5rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    background: pago.status === 'paid' ? '#e1f5fe' : '#fff3e0',
                                    color: pago.status === 'paid' ? '#0288d1' : '#f57c00'
                                }}>
                                    {pago.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pagos.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No hay pagos registrados.</div>}
        </div>
    )
}
