'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ServiceStep from './ServiceStep'
import CalendarStep from './CalendarStep'
import TherapistStep from './TherapistStep'
import ClientInfoStep from './ClientInfoStep'
import styles from './BookingFlow.module.css'

export type BookingData = {
    serviceId?: string
    serviceName?: string
    priceCents?: number
    date?: string
    time?: string
    therapistId?: string
    autoSelectTherapist: boolean
    fullName?: string
    email?: string
}

export default function BookingFlow() {
    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState<BookingData>({
        autoSelectTherapist: true
    })

    const totalSteps = 4

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps))
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const updateData = (newData: Partial<BookingData>) => {
        setBookingData(prev => ({ ...prev, ...newData }))
    }

    return (
        <div className={styles.container}>
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.stepWrapper}
                >
                    {step === 1 && (
                        <ServiceStep
                            bookingData={bookingData}
                            onSelect={(service: any) => {
                                updateData({
                                    serviceId: service.id,
                                    serviceName: service.name,
                                    priceCents: service.price_cents
                                })
                                nextStep()
                            }}
                        />
                    )}

                    {step === 2 && (
                        <CalendarStep
                            bookingData={bookingData}
                            onSelect={(date: string, time: string) => {
                                updateData({ date, time })
                                nextStep()
                            }}
                            onBack={prevStep}
                        />
                    )}

                    {step === 3 && (
                        <TherapistStep
                            bookingData={bookingData}
                            onSelect={(therapistId: string | undefined, autoSelect: boolean) => {
                                updateData({ therapistId, autoSelectTherapist: autoSelect })
                                nextStep()
                            }}
                            onBack={prevStep}
                        />
                    )}

                    {step === 4 && (
                        <ClientInfoStep
                            bookingData={bookingData}
                            onBack={prevStep}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
