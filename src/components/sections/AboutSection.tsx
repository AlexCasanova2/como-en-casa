import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import styles from './AboutSection.module.css'

export default function AboutSection() {
    const a = useTranslations('About')

    return (
        <section id="about-preview-section" className={`section ${styles.section}`}>
            <div className={`glass-card ${styles.card}`}>
                <span className={styles.kicker}>SOBRE NOSOTRAS</span>
                <h2 className={styles.title}>{a('title')}</h2>
                <p className={`text-soft ${styles.subtitle}`}>{a('subtitle')}</p>
                <p className={`text-soft ${styles.description}`}>{a('description')}</p>
                <Link
                    href="/conocenos"
                    className={`hover-lift ${styles.cta}`}
                    aria-label={`${a('cta')} - Conoce más sobre nuestro equipo`}
                >
                    {a('cta')} <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </div>
        </section>
    )
}
