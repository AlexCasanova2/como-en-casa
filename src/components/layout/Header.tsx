'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Instagram } from 'lucide-react'

export default function Header() {
    const t = useTranslations('Navigation')

    return (
        <header style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            maxWidth: '1100px',
            zIndex: 100
        }}>
            <div className="glass-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 2rem',
                height: '70px'
            }}>
                {/* Logo Text */}
                <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
                    Como en casa
                </Link>

                {/* Menu */}
                <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <Link href="/conocenos" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                        {t('about')}
                    </Link>
                    <Link href="/#pricing" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                        {t('appointment')}
                    </Link>
                    <Link href="/blog" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                        {t('blog')}
                    </Link>
                    <Link href="/contacto" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                        {t('contact')}
                    </Link>
                </nav>

                {/* Social & Language */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                        <Instagram size={20} />
                    </a>
                    <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                    <Link href="/" locale="es" style={{ fontSize: '0.85rem', color: 'white', opacity: 0.8 }}>ES</Link>
                    <Link href="/" locale="en" style={{ fontSize: '0.85rem', color: 'white', opacity: 0.8 }}>EN</Link>
                </div>
            </div>
        </header>
    )
}
