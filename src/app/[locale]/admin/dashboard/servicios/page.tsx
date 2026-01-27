'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchServicios()
    }, [])

    const fetchServicios = async () => {
        const { data, error } = await supabase
            .from('servicios')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error) setServicios(data || [])
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este servicio?')) {
            await supabase.from('servicios').delete().eq('id', id)
            fetchServicios()
        }
    }

    if (loading) return <div>Cargando servicios...</div>

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: 'none', background: '#d4a373', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <Plus size={18} /> Nuevo Servicio
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {servicios.map((s) => (
                    <div key={s.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#4a4a4a' }}>{s.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleDelete(s.id)} style={{ border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{s.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>{s.price_cents / 100}€</span>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>{s.duration_minutes} min</span>
                        </div>
                    </div>
                ))}
            </div>

            {servicios.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>No hay servicios creados.</div>}
        </div>
    )
}
