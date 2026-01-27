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
        <section className="section" id="pricing" style={{ padding: '10rem 10%', background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-glow" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--foreground)', textAlign: 'center', fontWeight: 900 }}>{t('title')}</h2>
            <p className="text-soft" style={{ marginBottom: '4rem', fontSize: '1rem', textAlign: 'center', maxWidth: '600px', marginInline: 'auto' }}>
                {t('timezoneNotice')} <strong style={{ color: 'var(--accent)' }}>{userTimezone || '...'}</strong>
            </p>

            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1100px' }}>

                {/* Individual Session */}
                <div className="glass-card" style={{ flex: '1', minWidth: '320px', padding: '3.5rem', borderRadius: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700 }}>{t('individual')}</h3>
                    <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--foreground)', margin: '0.5rem 0' }}>
                        60€ <span style={{ fontSize: '1.2rem', fontWeight: 500, opacity: 0.6 }}>{t('perSession')}</span>
                    </div>
                    <p className="text-soft" style={{ flexGrow: 1, fontSize: '1.05rem', lineHeight: '1.7' }}>{t('individualDesc')}</p>
                    <button
                        onClick={() => handleCheckout('individual')}
                        disabled={loading !== null}
                        className="glass-button"
                        style={{ width: '100%', justifyContent: 'center', background: 'white', color: 'var(--background)' }}
                    >
                        {loading === 'individual' ? '...' : t('bookNow')}
                    </button>
                </div>

                {/* Nomad Pack */}
                <div className="glass-card" style={{ flex: '1', minWidth: '320px', padding: '3.5rem', borderRadius: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', border: '1px solid rgba(212, 163, 115, 0.4)', background: 'rgba(212, 163, 115, 0.05)' }}>
                    <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 4px 15px rgba(212, 163, 115, 0.4)' }}>{t('recommended')}</div>

                    <h3 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700 }}>{t('pack5')}</h3>
                    <div style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--foreground)', margin: '0.5rem 0' }}>
                        250€ <span style={{ fontSize: '1.2rem', fontWeight: 500, opacity: 0.6 }}>{t('perPack')}</span>
                    </div>
                    <p className="text-soft" style={{ flexGrow: 1, fontSize: '1.05rem', lineHeight: '1.7' }}>{t('pack5Desc')}</p>
                    <button
                        onClick={() => handleCheckout('pack5')}
                        disabled={loading !== null}
                        className="glass-button"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loading === 'pack5' ? '...' : t('buyPack')}
                    </button>
                </div>

            </div>
        </section>
    )
}
