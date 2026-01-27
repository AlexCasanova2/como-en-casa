'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, UserPlus } from 'lucide-react'

export default function TerapeutasPage() {
    const [terapeutas, setTerapeutas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTerapeutas()
    }, [])

    const fetchTerapeutas = async () => {
        const { data, error } = await supabase
            .from('terapeutas')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false })

        if (!error) setTerapeutas(data || [])
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este terapeuta?')) {
            await supabase.from('terapeutas').delete().eq('id', id)
            fetchTerapeutas()
        }
    }

    if (loading) return <div>Cargando terapeutas...</div>

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: 'none', background: '#d4a373', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <UserPlus size={18} /> Añadir Terapeuta
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {terapeutas.map((t) => (
                    <div key={t.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'white', display: 'flex', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eee', flexShrink: 0, overflow: 'hidden' }}>
                            {t.profiles?.avatar_url ? <img src={t.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>?</div>}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', color: '#4a4a4a' }}>{t.profiles?.full_name}</h3>
                                <button onClick={() => handleDelete(t.id)} style={{ border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>{t.bio?.substring(0, 100)}...</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {t.specialties?.map((s: string) => (
                                    <span key={s} style={{ fontSize: '0.7rem', background: '#f0f0f0', padding: '0.2rem 0.6rem', borderRadius: '10px', color: '#666' }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {terapeutas.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>No hay terapeutas registrados.</div>}
        </div>
    )
}
