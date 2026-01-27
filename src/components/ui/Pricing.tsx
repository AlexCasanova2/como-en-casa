'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl';

export default function PricingSection() {
    const t = useTranslations('Pricing');
    const [loading, setLoading] = useState<string | null>(null)
    const [userTimezone, setUserTimezone] = useState<string>('')

    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [])

    const handleCheckout = async (type: 'individual' | 'pack5') => {
        setLoading(type)
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            })
            const { url, error } = await response.json()
            if (error) throw new Error(error)
            window.location.href = url
        } catch (err) {
            console.error(err)
            alert('Error processing payment.')
        } finally {
            setLoading(null)
        }
    }

    return (
        <section className="section" id="pricing">
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--foreground)', textAlign: 'center' }}>{t('title')}</h2>
            <p style={{ marginBottom: '3rem', opacity: 0.8, fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-soft)' }}>
                {t('timezoneNotice')} <strong>{userTimezone || '...'}</strong>
            </p>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>

                {/* Individual Session */}
                <div className="glass" style={{ flex: '1', minWidth: '300px', padding: '3rem', borderRadius: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1rem' }}>{t('individual')}</h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1rem 0', color: 'var(--foreground)' }}>
                        60€ <span style={{ fontSize: '1.1rem', fontWeight: 400, opacity: 0.7 }}>{t('perSession')}</span>
                    </div>
                    <p style={{ flexGrow: 1, opacity: 0.9, marginBottom: '2.5rem', color: 'var(--text-soft)' }}>{t('individualDesc')}</p>
                    <button
                        onClick={() => handleCheckout('individual')}
                        disabled={loading !== null}
                        style={{
                            padding: '1.1rem',
                            borderRadius: '50px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#7a5448',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'transform 0.2s ease',
                            opacity: loading === 'individual' ? 0.7 : 1
                        }}
                    >
                        {loading === 'individual' ? '...' : t('bookNow')}
                    </button>
                </div>

                {/* Nomad Pack */}
                <div className="glass" style={{ flex: '1', minWidth: '300px', padding: '3rem', borderRadius: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', border: '2px solid rgba(255,255,255,0.4)' }}>
                    <div style={{ background: '#ffffff', color: '#7a5448', padding: '0.35rem 1.25rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, alignSelf: 'center', marginBottom: '1rem' }}>{t('recommended')}</div>
                    <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1rem' }}>{t('pack5')}</h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1rem 0', color: 'var(--foreground)' }}>
                        250€ <span style={{ fontSize: '1.1rem', fontWeight: 400, opacity: 0.7 }}>{t('perPack')}</span>
                    </div>
                    <p style={{ flexGrow: 1, opacity: 0.9, marginBottom: '2.5rem', color: 'var(--text-soft)' }}>{t('pack5Desc')}</p>
                    <button
                        onClick={() => handleCheckout('pack5')}
                        disabled={loading !== null}
                        style={{
                            padding: '1.1rem',
                            borderRadius: '50px',
                            border: 'none',
                            background: '#ffffff',
                            color: '#7a5448',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            opacity: loading === 'pack5' ? 0.7 : 1
                        }}
                    >
                        {loading === 'pack5' ? '...' : t('buyPack')}
                    </button>
                </div>

            </div>
        </section>
    )
}
