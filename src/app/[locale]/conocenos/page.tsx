
import { createClient } from '@/lib/supabase/server'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import { ArrowRight, Award, GraduationCap, MapPin } from 'lucide-react'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: `${t('title')} | Como en casa`,
        description: t('subtitle')
    };
}

export default async function ConocenosPage() {
    const t = await getTranslations('About');
    const supabase = createClient();

    // Fetch active therapists with profile data
    const { data: terapeutas } = await supabase
        .from('terapeutas')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url
            )
        `)
        .eq('is_active', true);

    return (
        <div id="conocenos-page-container" style={{ minHeight: '100vh' }}>
            {/* HERO / EXPLANATION SECTION */}
            <section id="conocenos-hero" style={{ padding: '12rem 10% 8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
                <div id="conocenos-text">
                    <span id="conocenos-kicker" style={{ color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.85rem', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>{t('title')}</span>
                    <h1 id="conocenos-title" className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem', color: 'white', lineHeight: '1.1', fontWeight: 900 }}>
                        {t('subtitle')}
                    </h1>
                    <p id="conocenos-desc" className="text-soft" style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem', opacity: 0.9 }}>
                        {t('description')}
                    </p>
                    <p id="conocenos-full-desc" className="text-soft" style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8 }}>
                        {t('fullDescription')}
                    </p>
                </div>
                <div id="conocenos-image-container" style={{ position: 'relative', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', aspectRatio: '1/1' }}>
                    <Image
                        src="/images/conocenos.png"
                        alt="Nuestro equipo"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
            </section>

            {/* TEAM GRID */}
            <section id="team-section" style={{ padding: '8rem 10%', background: 'rgba(0,0,0,0.1)' }}>
                <div id="team-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 id="team-title" className="text-glow" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{t('teamTitle')}</h2>
                    <p id="team-subtitle" className="text-soft" style={{ fontSize: '1.2rem', opacity: 0.8 }}>{t('teamSubtitle')}</p>
                </div>

                <div id="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                    {terapeutas?.map((tera: any) => (
                        <div key={tera.id} id={`tera-card-${tera.id}`} className="glass-card hover-lift" style={{ borderRadius: '40px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div id={`tera-info-${tera.id}`} style={{ padding: '3rem', flexGrow: 1 }}>
                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
                                    <div id={`tera-avatar-${tera.id}`} style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent)', overflow: 'hidden', position: 'relative', border: '3px solid white' }}>
                                        {tera.profiles?.avatar_url ? (
                                            <Image src={tera.profiles.avatar_url} alt={tera.profiles.full_name} fill style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white' }}>
                                                {tera.profiles?.full_name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{tera.profiles?.full_name}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <Award size={16} /> {tera.experience_years} años exp.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-soft" style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', opacity: 0.9 }}>
                                    {tera.bio}
                                </p>

                                <div id={`tera-specialties-${tera.id}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {tera.specialties?.map((spec: string) => (
                                        <span key={spec} style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: 'var(--text-soft)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div id={`tera-footer-${tera.id}`} style={{ padding: '2rem 3rem', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button className="glass-button" style={{ width: '100%', justifyContent: 'center' }}>
                                    Pedir cita con {tera.profiles?.full_name?.split(' ')[0]} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    )
}
