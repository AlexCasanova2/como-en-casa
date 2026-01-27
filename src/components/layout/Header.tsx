'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Instagram } from 'lucide-react'

export default function Header() {
    const t = useTranslations('Navigation')

    return (
        <header id="main-public-header" style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            maxWidth: '1100px',
            zIndex: 100
        }}>
            <div id="header-glass-container" className="glass-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 2rem',
                height: '70px'
            }}>
                {/* Logo Text */}
                <Link id="header-logo-link" href="/" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
                    Como en casa
                </Link>

                {/* Menu */}
                <nav id="header-navigation" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <Link id="nav-conocenos" href="/conocenos" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                        {t('about')}
                    </Link>
                    <Link id="nav-cita" href="/#pricing" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                        {t('appointment')}
                    </Link>
                    <Link id="nav-blog" href="/blog" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                        {t('blog')}
                    </Link>
                    <Link id="nav-contacto" href="/contacto" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                        {t('contact')}
                    </Link>
                </nav>

                {/* Social & Language */}
                <div id="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <a id="instagram-link" href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                        <Instagram size={20} />
                    </a>
                    <div id="header-divider" style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                    <Link id="lang-es" href="/" locale="es" style={{ fontSize: '0.85rem', color: 'white', opacity: 0.8 }}>ES</Link>
                    <Link id="lang-en" href="/" locale="en" style={{ fontSize: '0.85rem', color: 'white', opacity: 0.8 }}>EN</Link>
                </div>
            </div>
        </header>
    )
}
