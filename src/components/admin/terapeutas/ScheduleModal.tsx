'use client'

import { Clock, Plus, Save, Trash2, X } from 'lucide-react'
import styles from './ScheduleModal.module.css'

interface ScheduleSlot {
    id?: string
    tempId?: string
    terapeuta_id: string
    dia_semana: number
    hora_inicio: string
    hora_fin: string
}

interface ScheduleModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    selectedTerapeuta: any
    schedule: ScheduleSlot[]
    setSchedule: (s: ScheduleSlot[]) => void
    isSaving: boolean
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function ScheduleModal({
    isOpen,
    onClose,
    onSave,
    selectedTerapeuta,
    schedule,
    setSchedule,
    isSaving
}: ScheduleModalProps) {
    if (!isOpen) return null

    const addScheduleSlot = (dia: number) => {
        const newSlot: ScheduleSlot = {
            tempId: crypto.randomUUID(),
            terapeuta_id: selectedTerapeuta.id,
            dia_semana: dia,
            hora_inicio: '09:00',
            hora_fin: '14:00'
        }
        setSchedule([...schedule, newSlot])
    }

    const removeScheduleSlot = (slotToRemove: ScheduleSlot) => {
        setSchedule(schedule.filter(s => {
            if (slotToRemove.id) return s.id !== slotToRemove.id
            return s.tempId !== slotToRemove.tempId
        }))
    }

    const updateScheduleSlot = (targetSlot: ScheduleSlot, field: keyof ScheduleSlot, value: string) => {
        setSchedule(schedule.map(s => {
            const isMatch = targetSlot.id ? s.id === targetSlot.id : s.tempId === targetSlot.tempId
            return isMatch ? { ...s, [field]: value } : s
        }) as ScheduleSlot[])
    }

    return (
        <div id="schedule-overlay" className={styles.overlay}>
            <div id="schedule-content" className={`glass ${styles.content}`}>
                <button
                    id="close-schedule-modal"
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label="Cerrar modal"
                >
                    <X size={24} />
                </button>

                <h2 className={styles.title}>Horario Semanal</h2>
                <p className={styles.subtitle}>
                    Configura las franjas de disponibilidad para <strong>{selectedTerapeuta?.profiles?.full_name}</strong>
                </p>

                <div className={styles.scheduleList}>
                    {DAYS.map((dayName, index) => {
                        const dayIndex = (index + 1) % 7 // Ajustar a 0=Dom, 1=Lun...
                        const slots = schedule.filter(s => s.dia_semana === dayIndex)

                        return (
                            <div key={dayName} className={styles.dayCard}>
                                <div className={styles.dayHeader}>
                                    <h4 className={styles.dayName}>{dayName}</h4>
                                    <button
                                        onClick={() => addScheduleSlot(dayIndex)}
                                        className={styles.addSlotBtn}
                                    >
                                        <Plus size={14} /> Añadir franja
                                    </button>
                                </div>

                                <div className={styles.slotsContainer}>
                                    {slots.map(slot => (
                                        <div key={slot.id || slot.tempId} className={styles.slot}>
                                            <div className={styles.timeInputs}>
                                                <Clock size={16} color="#999" />
                                                <input
                                                    type="time"
                                                    value={slot.hora_inicio}
                                                    onChange={(e) => updateScheduleSlot(slot, 'hora_inicio', e.target.value)}
                                                    className={styles.timeInput}
                                                />
                                                <span className={styles.separator}>—</span>
                                                <input
                                                    type="time"
                                                    value={slot.hora_fin}
                                                    onChange={(e) => updateScheduleSlot(slot, 'hora_fin', e.target.value)}
                                                    className={styles.timeInput}
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeScheduleSlot(slot)}
                                                className={styles.removeBtn}
                                                aria-label="Eliminar franja"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {slots.length === 0 && (
                                        <p className={styles.emptyMsg}>Sin disponibilidad este día.</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className={styles.saveBtn}
                >
                    {isSaving ? 'Guardando...' : (
                        <>
                            <Save size={20} />
                            Guardar Horario Semanal
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
