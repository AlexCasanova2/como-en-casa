'use client'

import { Clock, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import styles from './TherapistCard.module.css'

interface TherapistCardProps {
    terapeuta: any
    onEdit: (t: any) => void
    onDelete: (id: string) => void
    onSchedule: (t: any) => void
}

export default function TherapistCard({
    terapeuta,
    onEdit,
    onDelete,
    onSchedule
}: TherapistCardProps) {
    const { id, bio, specialties, is_active, profiles } = terapeuta
    const fullName = profiles?.full_name || 'Nombre no definido'
    const avatarUrl = profiles?.avatar_url

    return (
        <div id={`terapeuta-card-${id}`} className={`glass ${styles.card}`}>
            <div className={styles.header}>
                <div className={styles.avatarContainer}>
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={fullName}
                            className={styles.avatar}
                            width={60}
                            height={60}
                        />
                    ) : (
                        <div className={styles.initials}>
                            {fullName[0]?.toUpperCase() || 'T'}
                        </div>
                    )}
                </div>
                <div className={styles.info}>
                    <h3 id={`terapeuta-name-${id}`} className={styles.name}>
                        {fullName}
                    </h3>
                    <span className={`${styles.statusBadge} ${is_active ? styles.statusActive : styles.statusInactive}`}>
                        {is_active ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>

            <div id={`terapeuta-bio-${id}`} className={styles.bio}>
                {bio || 'Sin biografía definida.'}
            </div>

            <div className={styles.specialties}>
                {specialties?.map((s: string) => (
                    <span key={s} className={styles.specialtyBadge}>
                        {s}
                    </span>
                ))}
            </div>

            <div className={styles.footer}>
                <div className={styles.actionsLeft}>
                    <button
                        id={`schedule-terapeuta-${id}`}
                        onClick={() => onSchedule(terapeuta)}
                        className={styles.scheduleBtn}
                        aria-label="Gestionar horario"
                    >
                        <Clock size={14} /> Horario
                    </button>
                    <button
                        id={`edit-terapeuta-${id}`}
                        onClick={() => onEdit(terapeuta)}
                        className={styles.editBtn}
                        aria-label="Editar terapeuta"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
                <button
                    id={`delete-terapeuta-${id}`}
                    onClick={() => onDelete(id)}
                    className={styles.deleteBtn}
                    aria-label="Eliminar terapeuta"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}
