
'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ChevronDown, Mail, Instagram, Send, CheckCircle } from 'lucide-react'

export default function ContactClient() {
    const t = useTranslations('Contact')
    const f = useTranslations('FAQ')
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const faqItems = [0, 1, 2, 3]

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'El asunto es obligatorio'
        }

        if (!formData.message.trim()) {
            newErrors.message = 'El mensaje es obligatorio'
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'El mensaje debe tener al menos 10 caracteres'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitSuccess(true)
            setFormData({ name: '', email: '', subject: '', message: '' })

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false)
            }, 5000)
        }, 1500)
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    return (
        <>
            {/* HERO SECTION */}
            <section id="contacto-hero" style={{ padding: '12rem 10% 6rem', textAlign: 'center' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.85rem', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>CONECTA CON NOSOTRAS</span>
                <h1 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', color: 'white' }}>{t('title')}</h1>
                <p className="text-soft" style={{ maxWidth: '750px', marginInline: 'auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    {f('subtitle')}
                </p>
            </section>

            {/* FAQ SECTION */}
            <section id="faq-section" style={{ padding: '4rem 0', maxWidth: '1100px', marginInline: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {faqItems.map((i) => (
                        <div
                            key={i}
                            id={`faq-item-${i}`}
                            className="glass-card"
                            style={{
                                borderRadius: '24px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <div style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{f(`items.${i}.q`)}</h3>
                                <ChevronDown
                                    size={24}
                                    style={{
                                        transition: 'transform 0.3s ease',
                                        transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                                        color: 'var(--accent)'
                                    }}
                                />
                            </div>
                            <div style={{
                                padding: openIndex === i ? '0 2.5rem 2.5rem' : '0 2.5rem 0',
                                maxHeight: openIndex === i ? '500px' : '0',
                                opacity: openIndex === i ? 1 : 0,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                overflow: 'hidden',
                                fontSize: '1.1rem',
                                lineHeight: '1.7',
                                color: 'var(--text-soft)'
                            }}>
                                {f(`items.${i}.a`)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT FORM SECTION */}
            <section id="contact-form-section" style={{ padding: '10rem 10%', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ maxWidth: '1100px', marginInline: 'auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6rem' }}>

                    {/* INFO COLUMN */}
                    <div id="contact-info">
                        <h2 className="text-glow" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>{t('infoTitle')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '16px' }}>
                                    <Mail color="var(--accent)" size={24} />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem' }}>{t('emailLabel')}</span>
                                    <a href="mailto:hola@comoencasa.com" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>hola@comoencasa.com</a>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '16px' }}>
                                    <Instagram color="var(--accent)" size={24} />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem' }}>{t('instaLabel')}</span>
                                    <a href="#" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>@comoencasaterapia</a>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card" style={{ marginTop: '4rem', padding: '2rem', borderRadius: '24px', borderLeft: '4px solid var(--accent)' }}>
                            <p className="text-soft" style={{ fontSize: '1.05rem', fontStyle: 'italic' }}>
                                "{t('subtitle')}"
                            </p>
                        </div>
                    </div>

                    {/* FORM COLUMN */}
                    <div id="contact-form-container">
                        {submitSuccess && (
                            <div style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                border: '2px solid rgba(34, 197, 94, 0.5)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                animation: 'fadeInUp 0.5s ease'
                            }}>
                                <CheckCircle color="#22c55e" size={24} />
                                <div>
                                    <strong style={{ color: '#22c55e', display: 'block', marginBottom: '0.25rem' }}>¡Mensaje enviado!</strong>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Te responderemos pronto.</span>
                                </div>
                            </div>
                        )}

                        <form id="contact-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('formName')}</label>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: errors.name ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            color: 'white',
                                            outline: 'none',
                                            transition: 'border 0.3s ease'
                                        }}
                                    />
                                    {errors.name && <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errors.name}</span>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('formEmail')}</label>
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: errors.email ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            color: 'white',
                                            outline: 'none',
                                            transition: 'border 0.3s ease'
                                        }}
                                    />
                                    {errors.email && <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errors.email}</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('formSubject')}</label>
                                <input
                                    type="text"
                                    placeholder="¿Cómo podemos ayudarte?"
                                    value={formData.subject}
                                    onChange={(e) => handleChange('subject', e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: errors.subject ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        color: 'white',
                                        outline: 'none',
                                        transition: 'border 0.3s ease'
                                    }}
                                />
                                {errors.subject && <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errors.subject}</span>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('formMessage')}</label>
                                <textarea
                                    rows={6}
                                    placeholder="Escribe aquí tu mensaje..."
                                    value={formData.message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: errors.message ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        color: 'white',
                                        outline: 'none',
                                        resize: 'none',
                                        transition: 'border 0.3s ease'
                                    }}
                                />
                                {errors.message && <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errors.message}</span>}
                            </div>
                            <button
                                type="submit"
                                className="glass-button"
                                disabled={isSubmitting}
                                style={{
                                    marginTop: '1rem',
                                    width: 'fit-content',
                                    opacity: isSubmitting ? 0.6 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? 'Enviando...' : t('formSubmit')} {!isSubmitting && <Send size={18} />}
                            </button>
                        </form>
                    </div>

                </div>
            </section>
        </>
    )
}
