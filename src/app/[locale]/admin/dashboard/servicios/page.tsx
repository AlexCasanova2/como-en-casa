'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit2, X, Save, Package, Clock, Euro, Users } from 'lucide-react'

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<any[]>([])
    const [terapeutas, setTerapeutas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingServicio, setEditingServicio] = useState<any>(null)
    const [selectedTerapeutas, setSelectedTerapeutas] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)

        // 1. Cargar servicios
        const { data: servs, error: sErr } = await supabase
            .from('servicios')
            .select('*, servicio_terapeuta(terapeuta_id)')
            .order('created_at', { ascending: false })

        // 2. Cargar terapeutas activos
        const { data: teraps, error: tErr } = await supabase
            .from('terapeutas')
            .select('id, profiles(full_name)')
            .eq('is_active', true)

        if (!sErr) setServicios(servs || [])
        if (!tErr) setTerapeutas(teraps || [])

        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este servicio?')) {
            const { error } = await supabase.from('servicios').delete().eq('id', id)
            if (error) alert(error.message)
            else fetchData()
        }
    }

    const openModal = (servicio: any = null) => {
        if (servicio) {
            setEditingServicio(servicio)
            setSelectedTerapeutas(servicio.servicio_terapeuta?.map((st: any) => st.terapeuta_id) || [])
        } else {
            setEditingServicio({
                name: '',
                description: '',
                price_cents: 0,
                duration_minutes: 50,
                is_pack: false,
                pack_quantity: 1
            })
            setSelectedTerapeutas([])
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // 1. Guardar/Actualizar servicio
            const { data: savedServicio, error: sError } = await supabase
                .from('servicios')
                .upsert({
                    id: editingServicio.id,
                    name: editingServicio.name,
                    description: editingServicio.description,
                    price_cents: editingServicio.price_cents,
                    duration_minutes: editingServicio.duration_minutes,
                    is_pack: editingServicio.is_pack,
                    pack_quantity: editingServicio.is_pack ? editingServicio.pack_quantity : 1
                })
                .select()
                .single()

            if (sError) throw sError

            const servicioId = savedServicio.id

            // 2. Sincronizar Relaciones Muchos-a-Muchos con Terapeutas
            // Borrar relaciones antiguas
            await supabase.from('servicio_terapeuta').delete().eq('servicio_id', servicioId)

            // Insertar nuevas relaciones
            if (selectedTerapeutas.length > 0) {
                const relations = selectedTerapeutas.map(tId => ({
                    servicio_id: servicioId,
                    terapeuta_id: tId
                }))
                const { error: rError } = await supabase.from('servicio_terapeuta').insert(relations)
                if (rError) throw rError
            }

            setIsModalOpen(false)
            fetchData()
        } catch (error: any) {
            alert('Error al guardar: ' + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    const toggleTerapeuta = (id: string) => {
        setSelectedTerapeutas(prev =>
            prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
        )
    }

    if (loading && servicios.length === 0) return <div id="loading-state" style={{ padding: '2rem', color: '#666' }}>Cargando datos...</div>

    return (
        <div id="servicios-page">
            <div id="servicios-actions" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    id="add-servicio-btn"
                    onClick={() => openModal()}
                    className="glass"
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: 'none', background: '#d4a373', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <Plus size={18} /> Nuevo Servicio
                </button>
            </div>

            <div id="servicios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {servicios.map((s) => (
                    <div key={s.id} id={`servicio-card-${s.id}`} className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative' }}>
                        {s.is_pack && (
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#d4a373', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: '20px', textTransform: 'uppercase' }}>
                                Pack x{s.pack_quantity}
                            </div>
                        )}

                        <div>
                            <h3 id={`servicio-name-${s.id}`} style={{ fontSize: '1.3rem', color: '#4a3f35', fontWeight: 700, marginBottom: '0.5rem', paddingRight: s.is_pack ? '4rem' : '0' }}>
                                {s.name}
                            </h3>
                            <div id={`servicio-desc-${s.id}`} style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5', minHeight: '3em' }}>
                                {s.description || 'Sin descripción.'}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid #f8f9fa', paddingTop: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', width: '100%', marginBottom: '0.2rem' }}>TERAPEUTAS:</span>
                            {s.servicio_terapeuta?.length > 0 ? (
                                s.servicio_terapeuta.map((st: any) => {
                                    const t = terapeutas.find(tera => tera.id === st.terapeuta_id)
                                    return (
                                        <span key={st.terapeuta_id} style={{ fontSize: '0.7rem', background: '#f5ebe0', color: '#7a5448', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                                            {t?.profiles?.full_name || 'Terapeuta'}
                                        </span>
                                    )
                                })
                            ) : (
                                <span style={{ fontSize: '0.7rem', color: '#ccc', fontStyle: 'italic' }}>Sin asignar</span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4a3f35' }}>
                                <Euro size={20} />
                                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.price_cents / 100}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#999', fontSize: '0.9rem' }}>
                                <Clock size={16} />
                                <span>{s.duration_minutes} min</span>
                            </div>
                        </div>

                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button id={`edit-servicio-${s.id}`} onClick={() => openModal(s)} style={{ border: 'none', background: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Edit2 size={18} />
                            </button>
                            <button id={`delete-servicio-${s.id}`} onClick={() => handleDelete(s.id)} style={{ border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDICIÓN / ALTA CON SELECTOR DE TERAPEUTAS */}
            {isModalOpen && (
                <div id="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div id="modal-content" className="glass" style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', maxWidth: '600px', maxHeight: '95vh', overflowY: 'auto', position: 'relative' }}>
                        <button id="close-modal" onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: '#4a3f35' }}>
                            {editingServicio.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                        </h2>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Nombre del Servicio</label>
                                <input required value={editingServicio.name} onChange={(e) => setEditingServicio({ ...editingServicio, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem' }} />
                            </div>

                            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e9ecef' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 800, color: '#4a3f35' }}>
                                    <Users size={18} /> ASIGNAR TERAPEUTAS
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                    {terapeutas.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => toggleTerapeuta(t.id)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '12px',
                                                border: '2px solid',
                                                borderColor: selectedTerapeutas.includes(t.id) ? '#d4a373' : '#eee',
                                                background: selectedTerapeutas.includes(t.id) ? '#fdf6e3' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.94rem',
                                                color: selectedTerapeutas.includes(t.id) ? '#7a5448' : '#666',
                                                fontWeight: selectedTerapeutas.includes(t.id) ? 600 : 400,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid #d4a373', background: selectedTerapeutas.includes(t.id) ? '#d4a373' : 'transparent' }} />
                                            {t.profiles?.full_name}
                                        </div>
                                    ))}
                                </div>
                                {terapeutas.length === 0 && <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No hay terapeutas activos para asignar.</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Precio (€)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input required type="number" step="0.01" value={editingServicio.price_cents / 100}
                                            onChange={(e) => setEditingServicio({ ...editingServicio, price_cents: Math.round(parseFloat(e.target.value) * 100) })}
                                            style={{ width: '100%', padding: '0.8rem', paddingLeft: '2rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem' }} />
                                        <Euro size={16} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Duración (minutos)</label>
                                    <input required type="number" value={editingServicio.duration_minutes} onChange={(e) => setEditingServicio({ ...editingServicio, duration_minutes: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Descripción</label>
                                <textarea rows={2} value={editingServicio.description} onChange={(e) => setEditingServicio({ ...editingServicio, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', resize: 'none' }} />
                            </div>

                            <div style={{ background: '#f8f9fa', padding: '1.2rem', borderRadius: '20px', border: '1px solid #e9ecef' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: editingServicio.is_pack ? '1rem' : '0' }}>
                                    <input type="checkbox" id="is_pack_check" checked={editingServicio.is_pack} onChange={(e) => setEditingServicio({ ...editingServicio, is_pack: e.target.checked })}
                                        style={{ width: '22px', height: '22px', cursor: 'pointer' }} />
                                    <label htmlFor="is_pack_check" style={{ fontSize: '1rem', fontWeight: 600, color: '#333', cursor: 'pointer' }}>¿Es un Pack de sesiones?</label>
                                </div>
                                {editingServicio.is_pack && (
                                    <input type="number" value={editingServicio.pack_quantity} onChange={(e) => setEditingServicio({ ...editingServicio, pack_quantity: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '2px solid #ddd' }} />
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                id="save-servicio-btn"
                                style={{ marginTop: '1rem', padding: '1.1rem', borderRadius: '50px', border: 'none', background: '#4a3f35', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
                                {isSaving ? 'Guardando...' : <><Save size={20} /> {editingServicio.id ? 'Actualizar' : 'Crear'}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
