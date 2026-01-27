'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Instagram } from 'lucide-react'

export default function Footer() {
    const t = useTranslations('Footer')
    const n = useTranslations('Navigation')

    return (
        <footer style={{
            padding: '4rem 2rem 2rem',
            background: 'rgba(0,0,0,0.1)',
            marginTop: '4rem',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand */}
                    <div style={{ minWidth: '200px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Como en casa</h3>
                        <p style={{ opacity: 0.6, maxWidth: '300px', fontSize: '0.9rem' }}>
                            Terapia online para nómadas y ciudadanos globales. Un refugio seguro, estés donde estés.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.4 }}>MENU</span>
                            <Link href="/conocenos" style={{ opacity: 0.8, fontSize: '0.9rem' }}>{n('about')}</Link>
                            <Link href="/#pricing" style={{ opacity: 0.8, fontSize: '0.9rem' }}>{n('appointment')}</Link>
                            <Link href="/blog" style={{ opacity: 0.8, fontSize: '0.9rem' }}>{n('blog')}</Link>
                            <Link href="/contacto" style={{ opacity: 0.8, fontSize: '0.9rem' }}>{n('contact')}</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.4 }}>SOCIAL</span>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                                <Instagram size={16} /> Instagram
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.85rem',
                    opacity: 0.4
                }}>
                    <p>{t('rights')}</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link href="/privacidad">{t('privacy')}</Link>
                        <Link href="/terminos">{t('terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
