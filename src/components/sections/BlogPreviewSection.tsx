import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import styles from './BlogPreviewSection.module.css'

interface BlogPost {
    id: string
    title: string
    excerpt: string
    slug: string
    created_at: string
}

interface BlogPreviewSectionProps {
    blogPosts: BlogPost[] | null
    locale: string
}

export default function BlogPreviewSection({ blogPosts, locale }: BlogPreviewSectionProps) {
    const b = useTranslations('Blog')

    if (!blogPosts || blogPosts.length === 0) {
        return null
    }

    return (
        <section className={`section ${styles.section}`}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={`text-glow ${styles.title}`}>{b('title')}</h2>
                    <Link
                        href="/blog"
                        className={`hover-lift ${styles.viewAllLink}`}
                        aria-label="Ver todos los artículos del blog"
                    >
                        Ver todo el blog
                    </Link>
                </div>
                <div className={styles.grid}>
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className={`glass-card ${styles.card}`}
                            aria-labelledby={`blog-title-${post.id}`}
                        >
                            <time
                                className={styles.date}
                                dateTime={post.created_at}
                            >
                                {new Date(post.created_at).toLocaleDateString(locale)}
                            </time>
                            <h3 id={`blog-title-${post.id}`} className={styles.cardTitle}>
                                {post.title}
                            </h3>
                            <p className={`text-soft ${styles.excerpt}`}>
                                {post.excerpt}
                            </p>
                            <Link
                                href={`/blog/${post.slug}`}
                                className={`hover-lift ${styles.readMore}`}
                                aria-label={`Leer más sobre ${post.title}`}
                            >
                                {b('readMore')} <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
