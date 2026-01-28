'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, UserPlus } from 'lucide-react'
import { createTerapeutaAction, updateTerapeutaAction, saveScheduleAction } from '@/app/actions/admin'
import Toast from '@/components/ui/Toast'
import TherapistCard from '@/components/admin/terapeutas/TherapistCard'
import TherapistModal from '@/components/admin/terapeutas/TherapistModal'
import ScheduleModal from '@/components/admin/terapeutas/ScheduleModal'

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
                    <TherapistCard
                        key={t.id}
                        terapeuta={t}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        onSchedule={openScheduleModal}
                    />
                ))}
            </div>

            <TherapistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingTerapeuta={editingTerapeuta}
                setEditingTerapeuta={setEditingTerapeuta}
                isSaving={isCreating}
            />

            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSave={saveSchedule}
                selectedTerapeuta={selectedTerapeutaForSchedule}
                schedule={schedule}
                setSchedule={setSchedule}
                isSaving={isSavingSchedule}
            />

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
