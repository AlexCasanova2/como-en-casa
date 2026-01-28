'use client'

import { Save, X } from 'lucide-react'
import styles from './TherapistModal.module.css'

interface TherapistModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (e: React.FormEvent) => void
    editingTerapeuta: any
    setEditingTerapeuta: (t: any) => void
    isSaving: boolean
}

export default function TherapistModal({
    isOpen,
    onClose,
    onSave,
    editingTerapeuta,
    setEditingTerapeuta,
    isSaving
}: TherapistModalProps) {
    if (!isOpen) return null

    const isEditing = !!editingTerapeuta.id

    return (
        <div id="modal-overlay" className={styles.overlay}>
            <div id="modal-content" className={`glass ${styles.content}`}>
                <button
                    id="close-modal"
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label="Cerrar modal"
                >
                    <X size={24} />
                </button>

                <h2 className={styles.title}>
                    {isEditing ? 'Editar Perfil' : 'Crear Nuevo Terapeuta'}
                </h2>

                <form onSubmit={onSave} className={styles.form}>
                    {!isEditing && (
                        <div className={styles.accessSection}>
                            <h4 className={styles.sectionTitle}>Datos de Acceso</h4>
                            <div className={styles.grid2}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={editingTerapeuta.email || ''}
                                        onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, email: e.target.value })}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Contraseña</label>
                                    <input
                                        required
                                        type="password"
                                        value={editingTerapeuta.password || ''}
                                        onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, password: e.target.value })}
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.label}>Nombre Completo</label>
                        <input
                            required
                            value={editingTerapeuta.full_name || ''}
                            onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, full_name: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Biografía Profesional</label>
                        <textarea
                            rows={4}
                            value={editingTerapeuta.bio || ''}
                            onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, bio: e.target.value })}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label className={styles.label}>Experiencia (años)</label>
                            <input
                                type="number"
                                value={editingTerapeuta.experience_years || 0}
                                onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, experience_years: parseInt(e.target.value) || 0 })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="is_active_check"
                                checked={editingTerapeuta.is_active ?? true}
                                onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, is_active: e.target.checked })}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_active_check" className={styles.label} style={{ cursor: 'pointer' }}>
                                Disponible para citas
                            </label>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Especialidades</label>
                        <input
                            value={Array.isArray(editingTerapeuta.specialties) ? editingTerapeuta.specialties.join(', ') : editingTerapeuta.specialties || ''}
                            onChange={(e) => setEditingTerapeuta({ ...editingTerapeuta, specialties: e.target.value })}
                            placeholder="Pj: Nómadas digitales, Ansiedad, Duelo..."
                            className={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className={styles.submitBtn}
                    >
                        {isSaving ? 'Procesando...' : (
                            <>
                                <Save size={20} />
                                {isEditing ? 'Guardar Cambios' : 'Crear y Activar'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
