'use client'

import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    message: string
    type?: ToastType
    onClose: () => void
    duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    }

    const Icon = icons[type]

    return (
        <div className={`${styles.toast} ${styles[type]}`} role="alert" aria-live="polite">
            <Icon className={styles.icon} size={20} aria-hidden="true" />
            <p className={styles.message}>{message}</p>
            <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Cerrar notificación"
            >
                <X size={18} />
            </button>
        </div>
    )
}
