'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Instagram, Menu, X, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
    const t = useTranslations('Navigation')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    return (
        <>
            <header id="main-public-header" style={{
                position: 'fixed',
                top: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'clamp(90%, 95%, 95%)',
                maxWidth: '1100px',
                zIndex: 100
            }}>
                <div id="header-glass-container" className="glass-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'clamp(0.75rem, 2vw, 0.75rem) clamp(1rem, 3vw, 2rem)',
                    height: '70px'
                }}>
                    {/* Logo Text */}
                    <Link id="header-logo-link" href="/" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white', zIndex: 101 }}>
                        Como en casa
                    </Link>

                    {/* Desktop Menu */}
                    <nav id="header-navigation" className="desktop-nav" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        <Link id="nav-conocenos" href="/conocenos" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                            {t('about')}
                        </Link>
                        <Link id="nav-cita" href="/reservar" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                            {t('appointment')}
                        </Link>
                        <Link id="nav-blog" href="/blog" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                            {t('blog')}
                        </Link>
                        <Link id="nav-contacto" href="/contacto" className="hover-lift" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', transition: 'all 0.3s' }}>
                            {t('contact')}
                        </Link>
                    </nav>

                    {/* Desktop Social & Language */}
                    <div id="header-actions" className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <a id="instagram-link" href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                            <Instagram size={20} />
                        </a>
                        <div id="header-divider" style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                        <Link id="lang-es" href="/" locale="es" style={{ fontSize: '0.85rem', color: 'white', opacity: 0.8 }}>ES</Link>
                        <Link id="lang-en" href="/" locale="en" style={{ fontSize: '0.85rem', color: 'white', opacity: 0.8 }}>EN</Link>
                        {user && (
                            <Link
                                id="admin-icon-link"
                                href="/admin/dashboard"
                                className="hover-lift"
                                style={{ color: 'white', display: 'flex', alignItems: 'center' }}
                                title="Panel de Administración"
                            >
                                <Settings size={20} />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        id="mobile-menu-button"
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            zIndex: 101
                        }}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu-overlay"
                className="mobile-menu"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    background: 'rgba(122, 84, 72, 0.98)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 99,
                    display: 'none',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    opacity: mobileMenuOpen ? 1 : 0,
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
            >
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                    <Link
                        href="/conocenos"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}
                    >
                        {t('about')}
                    </Link>
                    <Link
                        href="/reservar"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}
                    >
                        {t('appointment')}
                    </Link>
                    <Link
                        href="/blog"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}
                    >
                        {t('blog')}
                    </Link>
                    <Link
                        href="/contacto"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}
                    >
                        {t('contact')}
                    </Link>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                        <Instagram size={28} />
                    </a>
                    <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.3)' }} />
                    <Link href="/" locale="es" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'white' }}>ES</Link>
                    <Link href="/" locale="en" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'white' }}>EN</Link>
                    {user && (
                        <Link
                            href="/admin/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Settings size={24} /> Admin
                        </Link>
                    )}
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-nav,
                    .desktop-actions {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    .mobile-menu {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    )
}
