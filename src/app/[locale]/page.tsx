
import { ArrowRight, Globe, Compass, Languages, Zap } from 'lucide-react'
import Pricing from '@/components/ui/Pricing'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations('Index');
    const f = await getTranslations('Features');
    const a = await getTranslations('About');
    const b = await getTranslations('Blog');
    const supabase = createClient()

    // Fetch latest 3 blog posts from DB
    const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('language', locale)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

    return (
        <div id="home-page-container" style={{ minHeight: '100vh' }}>
            {/* HERO SECTION */}
            <section id="hero-section" className="hero">
                <h1 id="hero-title" className="gradient-text text-glow">{t('title')}</h1>
                <p id="hero-subtitle" className="text-soft" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', maxWidth: '650px', lineHeight: '1.7' }}>
                    {t('subtitle')}
                </p>

                <div id="hero-actions" style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                        id="cta-primary"
                        className="glass-button">
                        {t('cta')} <ArrowRight size={20} />
                    </button>
                    <button id="cta-secondary" className="hover-lift" style={{ padding: '1rem 2.5rem', background: 'transparent', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', textDecoration: 'underline', fontSize: '1.1rem', fontWeight: 500 }}>
                        {t('learnMore')}
                    </button>
                </div>

                <div id="hero-badges" style={{ display: 'flex', gap: '2.5rem', marginTop: '5rem', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                    <div id="badge-global" className="text-soft" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
                        <Globe size={18} strokeWidth={2} color="#f4ece4" /> {t('onlinePresence')}
                    </div>
                    <div id="badge-nomad" className="text-soft" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
                        <Compass size={18} strokeWidth={2} color="#f4ece4" /> {f('nomadFriendly')}
                    </div>
                    <div id="badge-bilingual" className="text-soft" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
                        <Languages size={18} strokeWidth={2} color="#f4ece4" /> {f('bilingual')}
                    </div>
                </div>
            </section>

            {/* ABOUT US PREVIEW */}
            <section id="about-preview-section" className="section" style={{ alignItems: 'flex-start', padding: '10rem 10%' }}>
                <div id="about-preview-card" className="glass-card" style={{ padding: '3rem', borderRadius: '40px', maxWidth: '700px' }}>
                    <span id="about-kicker" style={{ color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.85rem', display: 'block', marginBottom: '1.5rem' }}>SOBRE NOSOTRAS</span>
                    <h2 id="about-title" style={{ fontSize: 'clamp(2.rem, 5vw, 3.5rem)', marginBottom: '2rem', color: 'white', lineHeight: '1.1', fontWeight: 800 }}>{a('title')}</h2>
                    <p id="about-subtitle" className="text-soft" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>{a('subtitle')}</p>
                    <p id="about-description" className="text-soft" style={{ fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.8', opacity: 0.85 }}>{a('description')}</p>
                    <Link id="about-cta-link" href="/conocenos" className="hover-lift" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem' }}>
                        {a('cta')} <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features-section" className="section" style={{ background: 'rgba(0,0,0,0.1)', padding: '10rem 10%' }}>
                <div id="features-container" style={{ maxWidth: '1200px', width: '100%' }}>
                    <h2 id="features-title" className="text-glow" style={{ fontSize: '3rem', marginBottom: '5rem', textAlign: 'center', fontWeight: 900 }}>{f('title')}</h2>
                    <div id="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        <div id="feature-card-nomad" className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
                            <div style={{ background: 'var(--accent-glow)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                <Compass color="white" size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', color: 'white', fontWeight: 700 }}>{f('nomadFriendly')}</h3>
                            <p className="text-soft" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>{f('nomadFriendlyDesc')}</p>
                        </div>
                        <div id="feature-card-bilingual" className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
                            <div style={{ background: 'var(--accent-glow)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                <Languages color="white" size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', color: 'white', fontWeight: 700 }}>{f('bilingual')}</h3>
                            <p className="text-soft" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>{f('bilingualDesc')}</p>
                        </div>
                        <div id="feature-card-flexible" className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
                            <div style={{ background: 'var(--accent-glow)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                <Zap color="white" size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', color: 'white', fontWeight: 700 }}>{f('flexible')}</h3>
                            <p className="text-soft" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>{f('flexibleDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <Pricing />

            {/* BLOG PREVIEW */}
            <section id="blog-preview-section" className="section" style={{ padding: '10rem 10%' }}>
                <div id="blog-preview-container" style={{ maxWidth: '1200px', width: '100%' }}>
                    <div id="blog-preview-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5rem', flexWrap: 'wrap', gap: '2rem' }}>
                        <h2 id="blog-title" className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900 }}>{b('title')}</h2>
                        <Link id="view-all-blog-link" href="/blog" className="hover-lift" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem', borderBottom: '2px solid transparent', transition: 'all 0.3s' }}>Ver todo el blog</Link>
                    </div>
                    <div id="blog-posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {blogPosts?.map((post) => (
                            <div key={post.id} id={`blog-card-${post.id}`} className="glass-card" style={{ padding: '3rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>{new Date(post.created_at).toLocaleDateString(locale)}</span>
                                <h3 style={{ fontSize: '1.5rem', lineHeight: '1.4', color: 'white', fontWeight: 700 }}>{post.title}</h3>
                                <p className="text-soft" style={{ fontSize: '1rem', flexGrow: 1, lineHeight: '1.7' }}>{post.excerpt}</p>
                                <Link id={`read-more-blog-${post.id}`} href={`/blog/${post.slug}`} className="hover-lift" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: 'white',
                                    fontWeight: 700,
                                    marginTop: '1.5rem',
                                    padding: '0.6rem 1.4rem',
                                    background: 'rgba(212, 163, 115, 0.15)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(212, 163, 115, 0.4)',
                                    alignSelf: 'flex-start'
                                }}>
                                    {b('readMore')} <ArrowRight size={16} />
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
