
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params: { locale, id } }: { params: { locale: string, id: string } }): Promise<Metadata> {
    const supabase = createClient()
    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', id)
        .single()

    if (!post) return { title: 'Post no encontrado' }

    return {
        title: `${post.meta_title || post.title} | Como en casa`,
        description: post.meta_description || post.excerpt,
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            images: [post.image_url || '/images/blog_header.png']
        }
    }
}

export default async function BlogPostPage({ params: { id, locale } }: { params: { id: string, locale: string } }) {
    const b = await getTranslations('Blog')
    const supabase = createClient()

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', id)
        .single()

    if (!post) {
        return <div style={{ padding: '15rem', textAlign: 'center' }}>Post no encontrado</div>
    }

    return (
        <div id="blog-post-detail-container" style={{ minHeight: '100vh' }}>
            {/* ARTICLE HEADER */}
            <header id="post-header" style={{ padding: '12rem 0 4rem', maxWidth: '1100px', marginInline: 'auto' }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '2.5rem', textDecoration: 'none' }}>
                    <ArrowLeft size={18} /> Volver al blog
                </Link>

                <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>
                    Psicología & Movilidad
                </span>
                <h1 className="text-glow" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'white', lineHeight: '1.2', marginBottom: '2rem' }}>
                    {post.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', opacity: 0.8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white' }}>C</div>
                        <span style={{ fontWeight: 600 }}>Equipo Como en casa</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} /> {new Date(post.created_at).toLocaleDateString(locale)}
                    </div>
                </div>
            </header>

            {/* FEATURED IMAGE */}
            <div id="post-hero-image" style={{ width: '100%', maxWidth: '1100px', marginInline: 'auto', height: '500px', position: 'relative', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', marginBottom: '5rem' }}>
                <Image
                    src={post.image_url || "/images/blog_header.png"}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* CONTENT */}
            <article id="post-content" style={{ padding: '0 0 10rem', maxWidth: '1100px', marginInline: 'auto' }}>
                <div className="text-soft" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>

                {/* SOCIAL SHARE MOCK */}
                <div style={{ marginTop: '5rem', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Comparte este artículo</span>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="#"><Facebook size={20} /></Link>
                        <Link href="#"><Twitter size={20} /></Link>
                        <Link href="#"><Linkedin size={20} /></Link>
                        <Share2 size={20} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    )
}
