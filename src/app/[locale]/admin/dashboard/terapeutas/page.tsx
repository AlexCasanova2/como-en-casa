'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, UserPlus, Edit2, X, Save, Mail, Lock, Clock } from 'lucide-react'
import { createTerapeutaAction, updateTerapeutaAction, saveScheduleAction } from '@/app/actions/admin'
import Toast from '@/components/ui/Toast'

export default function TerapeutasPage() {
    const [terapeutas, setTerapeutas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTerapeuta, setEditingTerapeuta] = useState<any>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null)

    // Estados para Horarios (Opción B)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const [selectedTerapeutaForSchedule, setSelectedTerapeutaForSchedule] = useState<any>(null)
    const [schedule, setSchedule] = useState<any[]>([])
    const [isSavingSchedule, setIsSavingSchedule] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchTerapeutas()
    }, [])

    const fetchTerapeutas = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('terapeutas')
            .select(`
                id,
                bio,
                specialties,
                experience_years,
                is_active,
                profiles (
                    full_name,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false })

        if (!error) setTerapeutas(data || [])
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este terapeuta?')) {
            const { error } = await supabase.from('terapeutas').delete().eq('id', id)
            if (error) {
                setToast({
                    message: `Error al eliminar: ${error.message}`,
                    type: 'error'
                })
            } else {
                setToast({
                    message: 'Terapeuta eliminado correctamente',
                    type: 'success'
                })
                fetchTerapeutas()
            }
        }
    }

    const openEditModal = (terapeuta: any = null) => {
        if (terapeuta) {
            setEditingTerapeuta({
                ...terapeuta,
                full_name: terapeuta.profiles?.full_name || ''
            })
        } else {
            setEditingTerapeuta({
                email: '',
                password: '',
                full_name: '',
                bio: '',
                specialties: '',
                experience_years: 0,
                is_active: true
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        try {
            const specialtiesArr = typeof editingTerapeuta.specialties === 'string'
                ? editingTerapeuta.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
                : editingTerapeuta.specialties

            if (!editingTerapeuta.id) {
                // MODO CREACIÓN: Usamos la Server Action
                await createTerapeutaAction({
                    ...editingTerapeuta,
                    specialties: specialtiesArr
                })
            } else {
                // MODO EDICIÓN: Usamos la Server Action para saltar RLS en profiles
                await updateTerapeutaAction({
                    ...editingTerapeuta,
                    specialties: specialtiesArr
                })
                console.log('✅ Terapeuta actualizado correctamente vía Server Action')
            }

            setIsModalOpen(false)
            setToast({
                message: editingTerapeuta.id ? 'Terapeuta actualizado correctamente' : 'Terapeuta creado correctamente',
                type: 'success'
            })
            await fetchTerapeutas()
        } catch (error: any) {
            console.error('Error en handleSave:', error)
            setToast({
                message: error.message || 'Error al guardar los cambios',
                type: 'error'
            })
        } finally {
            setIsCreating(false)
        }
    }

    // LÓGICA DE HORARIOS (OPCIÓN B)
    const openScheduleModal = async (terapeuta: any) => {
        setSelectedTerapeutaForSchedule(terapeuta)
        setIsScheduleModalOpen(true)

        const { data, error } = await supabase
            .from('disponibilidad_semanal')
            .select('*')
            .eq('terapeuta_id', terapeuta.id)
            .order('dia_semana', { ascending: true })
            .order('hora_inicio', { ascending: true })

        if (!error) setSchedule(data || [])
    }

    const addScheduleSlot = (dia: number) => {
        const newSlot = {
            id: undefined, // Para slots existentes
            tempId: crypto.randomUUID(), // Identificador estable para nuevos slots
            terapeuta_id: selectedTerapeutaForSchedule.id,
            dia_semana: dia,
            hora_inicio: '09:00',
            hora_fin: '14:00'
        }
        setSchedule([...schedule, newSlot])
    }

    const removeScheduleSlot = (slotToRemove: any) => {
        setSchedule(schedule.filter(s => {
            if (slotToRemove.id) return s.id !== slotToRemove.id
            return s.tempId !== slotToRemove.tempId
        }))
    }

    const updateScheduleSlot = (targetSlot: any, field: string, value: string) => {
        setSchedule(schedule.map(s => {
            const isMatch = targetSlot.id ? s.id === targetSlot.id : s.tempId === targetSlot.tempId
            return isMatch ? { ...s, [field]: value } : s
        }))
    }

    const saveSchedule = async () => {
        setIsSavingSchedule(true)
        try {
            await saveScheduleAction(selectedTerapeutaForSchedule.id, schedule)

            setToast({
                message: 'Horario guardado correctamente',
                type: 'success'
            })
            setIsScheduleModalOpen(false)
        } catch (error: any) {
            setToast({
                message: `Error al guardar horario: ${error.message}`,
                type: 'error'
            })
        } finally {
            setIsSavingSchedule(false)
        }
    }

    if (loading && terapeutas.length === 0) return <div id="loading-state" style={{ padding: '2rem', color: '#666' }}>Cargando terapeutas...</div>

    return (
        <div id="terapeutas-page">
            <div id="terapeutas-actions" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    id="add-terapeuta-btn"
                    onClick={() => openEditModal()}
                    className="glass"
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: 'none', background: '#d4a373', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <UserPlus size={18} /> Nuevo Terapeuta
                </button>
            </div>

            <div id="terapeutas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {terapeutas.map((t) => (
                    <div key={t.id} id={`terapeuta-card-${t.id}`} className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: '#f5ebe0', flexShrink: 0, overflow: 'hidden' }}>
                                {t.profiles?.avatar_url ? (
                                    <img src={t.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a373', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {t.profiles?.full_name?.[0] || 'T'}
                                    </div>
                                )}
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h3 id={`terapeuta-name-${t.id}`} style={{ fontSize: '1.2rem', color: '#4a3f35', fontWeight: 700, marginBottom: '0.2rem' }}>
                                    {t.profiles?.full_name || 'Nombre no definido'}
                                </h3>
                                <span style={{ fontSize: '0.8rem', color: t.is_active ? '#2d6a4f' : '#d9534f', background: t.is_active ? '#d8f3dc' : '#f8d7da', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
                                    {t.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>

                        <div id={`terapeuta-bio-${t.id}`} style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6', height: '4.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                            {t.bio || 'Sin biografía definida.'}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {t.specialties?.map((s: string) => (
                                <span key={s} style={{ fontSize: '0.75rem', background: '#fdf6e3', padding: '0.3rem 0.75rem', borderRadius: '12px', color: '#7a5448', border: '1px solid #ede0d4' }}>
                                    {s}
                                </span>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button
                                    id={`schedule-terapeuta-${t.id}`}
                                    onClick={() => openScheduleModal(t)}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #d4a373', background: '#fdf6e3', color: '#7a5448', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Clock size={14} /> Horario
                                </button>
                                <button id={`edit-terapeuta-${t.id}`} onClick={() => openEditModal(t)} style={{ border: 'none', background: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            <button id={`delete-terapeuta-${t.id}`} onClick={() => handleDelete(t.id)} style={{ border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDICIÓN / ALTA COMPLETA */}
            {isModalOpen && (
                <div id="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div id="modal-content" className="glass" style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button id="close-modal" onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: '#4a3f35' }}>
                            {editingTerapeuta.id ? 'Editar Perfil' : 'Crear Nuevo Terapeuta'}
                        </h2>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {!editingTerapeuta.id && (
                                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e9ecef', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', color: '#4a3f35', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Datos de Acceso</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Email</label>
                                            <input required type="email" value={editingTerapeuta.email} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, email: e.target.value })}
                                                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', outlineColor: '#d4a373' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Contraseña</label>
                                            <input required type="password" value={editingTerapeuta.password} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, password: e.target.value })}
                                                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', outlineColor: '#d4a373' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Nombre Completo</label>
                                <input required value={editingTerapeuta.full_name} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, full_name: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', outlineColor: '#d4a373' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Biografía Profesional</label>
                                <textarea rows={4} value={editingTerapeuta.bio} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, bio: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', lineHeight: '1.5', resize: 'none', outlineColor: '#d4a373' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Experiencia (años)</label>
                                    <input type="number" value={editingTerapeuta.experience_years} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, experience_years: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', outlineColor: '#d4a373' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.8rem', gap: '0.8rem' }}>
                                    <input type="checkbox" id="is_active_check" checked={editingTerapeuta.is_active} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, is_active: e.target.checked })}
                                        style={{ width: '22px', height: '22px', border: '2px solid #d4a373', cursor: 'pointer' }} />
                                    <label htmlFor="is_active_check" style={{ fontSize: '1rem', fontWeight: 600, color: '#333', cursor: 'pointer' }}>Disponible para citas</label>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Especialidades</label>
                                <input value={Array.isArray(editingTerapeuta.specialties) ? editingTerapeuta.specialties.join(', ') : editingTerapeuta.specialties} onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, specialties: e.target.value })}
                                    placeholder="Pj: Nómadas digitales, Ansiedad, Duelo..."
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', background: 'white', color: '#1a1a1a', fontSize: '1rem', outlineColor: '#d4a373' }} />
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating}
                                style={{ marginTop: '1rem', padding: '1.1rem', borderRadius: '50px', border: 'none', background: '#4a3f35', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isCreating ? 0.7 : 1 }}>
                                {isCreating ? 'Procesando...' : <><Save size={20} /> {editingTerapeuta.id ? 'Guardar Cambios' : 'Crear y Activar'}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE GESTIÓN DE HORARIOS (OPCIÓN B) */}
            {isScheduleModalOpen && (
                <div id="schedule-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div id="schedule-content" className="glass" style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button id="close-schedule-modal" onClick={() => setIsScheduleModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#4a3f35' }}>Horario Semanal</h2>
                        <p style={{ color: '#999', marginBottom: '2rem' }}>Configura las franjas de disponibilidad para <strong>{selectedTerapeutaForSchedule?.profiles?.full_name}</strong></p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dayName, index) => {
                                const dayIndex = (index + 1) % 7; // Ajustar a 0=Dom, 1=Lun...
                                const slots = schedule.filter(s => s.dia_semana === dayIndex);

                                return (
                                    <div key={dayName} style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e9ecef' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4 style={{ fontWeight: 800, color: '#4a3f35', textTransform: 'uppercase', fontSize: '0.85rem' }}>{dayName}</h4>
                                            <button
                                                onClick={() => addScheduleSlot(dayIndex)}
                                                style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', border: 'none', background: '#d4a373', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <Plus size={14} /> Añadir franja
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            {slots.map(slot => (
                                                <div key={slot.id || slot.tempId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.8rem', borderRadius: '12px', border: '1px solid #ddd' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                                        <Clock size={16} color="#999" />
                                                        <input
                                                            type="time"
                                                            value={slot.hora_inicio}
                                                            onChange={(e) => updateScheduleSlot(slot, 'hora_inicio', e.target.value)}
                                                            style={{ border: 'none', fontSize: '0.9rem', color: '#333', fontWeight: 600, width: '100px' }}
                                                        />
                                                        <span style={{ color: '#ccc' }}>—</span>
                                                        <input
                                                            type="time"
                                                            value={slot.hora_fin}
                                                            onChange={(e) => updateScheduleSlot(slot, 'hora_fin', e.target.value)}
                                                            style={{ border: 'none', fontSize: '0.9rem', color: '#333', fontWeight: 600, width: '100px' }}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeScheduleSlot(slot)}
                                                        style={{ border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {slots.length === 0 && <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>Sin disponibilidad este día.</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={saveSchedule}
                            disabled={isSavingSchedule}
                            style={{ position: 'sticky', bottom: '0', marginTop: '2rem', width: '100%', padding: '1.1rem', borderRadius: '50px', border: 'none', background: '#4a3f35', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {isSavingSchedule ? 'Guardando...' : <><Save size={20} /> Guardar Horario Semanal</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
