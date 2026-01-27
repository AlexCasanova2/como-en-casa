
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import { ArrowRight } from 'lucide-react'

export default async function BlogListingPage({ params: { locale } }: { params: { locale: string } }) {
    const b = await getTranslations('Blog')
    const supabase = createClient()

    const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('language', locale)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    return (
        <div id="blog-listing-container" style={{ minHeight: '100vh' }}>
            {/* BLOG HERO */}
            <section id="blog-hero" style={{ padding: '12rem 10% 6rem', textAlign: 'center' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.85rem', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>COMUNIDAD & BIENESTAR</span>
                <h1 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', color: 'white' }}>{b('title')}</h1>
                <p className="text-soft" style={{ maxWidth: '700px', marginInline: 'auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Exploramos la intersección entre la salud mental, la movilidad geográfica y el estilo de vida digital.
                </p>
            </section>

            {/* GRID */}
            <section id="blog-grid-section" style={{ padding: '4rem 10% 10rem' }}>
                <div id="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', maxWidth: '1200px', marginInline: 'auto' }}>
                    {posts?.map((post, index) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} id={`blog-post-card-${post.slug}`} className="glass-card hover-lift" style={{ borderRadius: '40px', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
                            <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                                <Image
                                    src={post.image_url || "/images/blog_header.png"}
                                    alt={post.title}
                                    fill
                                    priority={index < 2}
                                    style={{ objectFit: 'cover', opacity: 0.8 }}
                                />
                                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>
                                    {new Date(post.created_at).toLocaleDateString(locale)}
                                </div>
                            </div>

                            <div style={{ padding: '2.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h2 style={{ fontSize: '1.6rem', color: 'white', fontWeight: 800, lineHeight: '1.3' }}>{post.title}</h2>
                                <p className="text-soft" style={{ fontSize: '1rem', opacity: 0.8, lineHeight: '1.7', flexGrow: 1 }}>
                                    {post.excerpt}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem', marginTop: '1rem' }}>
                                    {b('readMore')} <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>
                    ))}
                    {(!posts || posts.length === 0) && (
                        <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>Próximamente nuevas entradas...</p>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}
