'use client'

import { ArrowRight, Globe, Video, Clock, CheckCircle2 } from 'lucide-react'
import Pricing from '@/components/ui/Pricing'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Footer from '@/components/layout/Footer'

export default function Home() {
    const t = useTranslations('Index');
    const f = useTranslations('Features');
    const a = useTranslations('About');
    const b = useTranslations('Blog');

    // Blog posts data from JSON as array
    const blogPosts = [0, 1, 2];

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* HERO SECTION */}
            <section className="hero">
                <h1 className="gradient-text">{t('title')}</h1>
                <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', opacity: 0.9, maxWidth: '750px', lineHeight: '1.6', color: 'var(--text-soft)' }}>
                    {t('subtitle')}
                </p>

                <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                        className="glass" style={{ padding: '1.1rem 2.8rem', color: '#ffffff', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px' }}>
                        {t('cta')} <ArrowRight size={20} />
                    </button>
                    <button style={{ padding: '1rem 2.5rem', background: 'transparent', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', textDecoration: 'underline', fontSize: '1.1rem' }}>
                        {t('learnMore')}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '2.5rem', marginTop: '5rem', opacity: 0.9, fontSize: '0.95rem', flexWrap: 'wrap', color: 'var(--text-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Globe size={18} strokeWidth={1.5} /> {t('onlinePresence')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Video size={18} strokeWidth={1.5} /> {f('nomadFriendly')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Clock size={18} strokeWidth={1.5} /> {f('bilingual')}
                    </div>
                </div>
            </section>

            {/* ABOUT US PREVIEW */}
            <section className="section" style={{ alignItems: 'flex-start', padding: '10rem 10%' }}>
                <div style={{ maxWidth: '600px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.2em', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' }}>SOBRE NOSOTRAS</span>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: 'white', lineHeight: '1.1' }}>{a('title')}</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-soft)', opacity: 0.9 }}>{a('subtitle')}</p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '3rem', color: 'var(--text-soft)', opacity: 0.7, lineHeight: '1.8' }}>{a('description')}</p>
                    <Link href="/conocenos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 600, borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>
                        {a('cta')} <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* REFORMULATED FEATURES (PREMIUM GRID) */}
            <section className="section" style={{ background: 'rgba(255,255,255,0.02)', padding: '8rem 10%' }}>
                <div style={{ maxWidth: '1100px', width: '100%' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', textAlign: 'center', fontWeight: 800 }}>{f('title')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                        <div>
                            <CheckCircle2 color="var(--accent)" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white' }}>{f('nomadFriendly')}</h3>
                            <p style={{ opacity: 0.7, lineHeight: '1.7', color: 'var(--text-soft)' }}>{f('nomadFriendlyDesc')}</p>
                        </div>
                        <div>
                            <CheckCircle2 color="var(--accent)" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white' }}>{f('bilingual')}</h3>
                            <p style={{ opacity: 0.7, lineHeight: '1.7', color: 'var(--text-soft)' }}>{f('bilingualDesc')}</p>
                        </div>
                        <div>
                            <CheckCircle2 color="var(--accent)" size={32} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'white' }}>{f('flexible')}</h3>
                            <p style={{ opacity: 0.7, lineHeight: '1.7', color: 'var(--text-soft)' }}>{f('flexibleDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <Pricing />

            {/* BLOG PREVIEW */}
            <section className="section" style={{ padding: '8rem 10%' }}>
                <div style={{ maxWidth: '1100px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>{b('title')}</h2>
                        <Link href="/blog" style={{ color: 'var(--accent)', fontWeight: 600 }}>Ver todo el blog</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {blogPosts.map((i) => (
                            <div key={i} className="glass" style={{ padding: '2.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{b(`posts.${i}.date`)}</span>
                                <h3 style={{ fontSize: '1.3rem', lineHeight: '1.4', color: 'white' }}>{b(`posts.${i}.title`)}</h3>
                                <p style={{ opacity: 0.6, fontSize: '0.95rem', flexGrow: 1 }}>{b(`posts.${i}.excerpt`)}</p>
                                <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, marginTop: '1rem' }}>
                                    {b('readMore')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
