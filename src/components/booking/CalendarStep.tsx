'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookingData } from './BookingFlow'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import styles from './CalendarStep.module.css'

interface CalendarStepProps {
    bookingData: BookingData
    onSelect: (date: string, time: string) => void
    onBack: () => void
}

export default function CalendarStep({ bookingData, onSelect, onBack }: CalendarStepProps) {
    const [availability, setAvailability] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [occupancy, setOccupancy] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        async function fetchAvailability() {
            const { data } = await supabase
                .from('disponibilidad_semanal')
                .select('*, terapeutas(id, is_active)')
                .eq('terapeutas.is_active', true)
            if (data) setAvailability(data)
            setLoading(false)
        }
        fetchAvailability()
    }, [])

    useEffect(() => {
        if (!selectedDate) return
        const fetchOccupancy = async () => {
            const { getBookingOccupancyAction } = await import('@/app/actions/booking')
            const dateStr = selectedDate.toISOString().split('T')[0]
            const res = await getBookingOccupancyAction(dateStr)
            setOccupancy(res)
        }
        fetchOccupancy()
    }, [selectedDate])

    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year: number, month: number) => {
        let day = new Date(year, month, 1).getDay()
        return day === 0 ? 6 : day - 1
    }

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    const prevMonth = () => {
        const now = new Date()
        if (currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear()) return
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const isAvailable = (date: Date) => {
        const now = new Date(); now.setHours(0, 0, 0, 0)
        if (date < now) return false
        const dayOfWeek = date.getDay()
        return availability.some(a => a.dia_semana === dayOfWeek)
    }

    const getAvailableSlots = (date: Date) => {
        const dayOfWeek = date.getDay()
        const dailySlots = availability.filter(a => a.dia_semana === dayOfWeek)
        const totalTherapists = occupancy?.totalTherapists || 0
        const busyMap = occupancy?.occupancy || {}

        const slots: string[] = []
        dailySlots.forEach(av => {
            let [h, m] = av.hora_inicio.split(':').map(Number)
            let [eh, em] = av.hora_fin.split(':').map(Number)

            while (h < eh || (h === eh && m < em)) {
                const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                // SOLO AGREGAR SI HAY TERAPEUTAS LIBRES
                const busyCount = busyMap[time]?.length || 0
                if (busyCount < totalTherapists) {
                    slots.push(time)
                }
                h += 1
            }
        })
        return Array.from(new Set(slots)).sort()
    }

    if (loading) return <div className={styles.loading}>Cargando disponibilidad...</div>

    return (
        <div className={styles.step}>
            <button className={styles.backBtn} onClick={onBack}><ArrowLeft size={18} /> Volver a servicios</button>
            <header className={styles.header}>
                <h2 className={styles.title}>¿Cuándo te viene mejor?</h2>
                <p className={styles.subtitle}>Selecciona un día para ver las horas disponibles.</p>
            </header>

            <div className={styles.calendarLayout}>
                <div className={styles.calendarCard}>
                    <div className={styles.monthHeader}>
                        <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={20} /></button>
                        <h3 className={styles.monthName}>{currentMonth.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={20} /></button>
                    </div>
                    <div className={styles.weekDays}>{daysOfWeek.map(d => <div key={d} className={styles.weekDay}>{d}</div>)}</div>
                    <div className={styles.daysGrid}>
                        {(() => {
                            const year = currentMonth.getFullYear(), month = currentMonth.getMonth()
                            const daysInMonth = getDaysInMonth(year, month), firstDay = getFirstDayOfMonth(year, month)
                            const days = []
                            for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className={styles.emptyDay} />)
                            for (let d = 1; d <= daysInMonth; d++) {
                                const date = new Date(year, month, d), available = isAvailable(date)
                                const isSelected = selectedDate?.toDateString() === date.toDateString()
                                days.push(
                                    <button key={d} disabled={!available}
                                        className={`${styles.dayCell} ${available ? styles.available : ''} ${isSelected ? styles.selected : ''}`}
                                        onClick={() => setSelectedDate(date)}>{d}</button>
                                )
                            }
                            return days
                        })()}
                    </div>
                </div>

                <div className={styles.slotsCard}>
                    <h3 className={styles.slotsTitle}>{selectedDate ? selectedDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Selecciona un día'}</h3>
                    <div className={styles.slotsGrid}>
                        {selectedDate ? (
                            getAvailableSlots(selectedDate).length > 0 ? (
                                getAvailableSlots(selectedDate).map((slot) => (
                                    <button key={slot} className={styles.slotBtn} onClick={() => onSelect(selectedDate.toISOString().split('T')[0], slot)}>{slot}</button>
                                ))
                            ) : <p className={styles.noSlots}>No hay horarios disponibles.</p>
                        ) : <p className={styles.noSlots}>Elige una fecha para ver las franjas horarias.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
