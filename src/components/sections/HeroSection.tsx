'use client'

import { ArrowRight, Globe, Compass, Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'
import styles from './HeroSection.module.css'

export default function HeroSection() {
    const t = useTranslations('Index')
    const f = useTranslations('Features')

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <section id="hero-section" className={`hero ${styles.hero}`}>
            <h1 id="hero-title" className="gradient-text text-glow">
                {t('title')}
            </h1>
            <p id="hero-subtitle" className={`text-soft ${styles.subtitle}`}>
                {t('subtitle')}
            </p>

            <div id="hero-actions" className={styles.actions}>
                <button
                    id="cta-primary"
                    className="glass-button"
                    onClick={() => scrollToSection('pricing')}
                    aria-label={t('cta')}
                >
                    {t('cta')} <ArrowRight size={20} />
                </button>
                <button
                    id="cta-secondary"
                    className={`hover-lift ${styles.secondaryCta}`}
                    onClick={() => scrollToSection('about-preview-section')}
                    aria-label={t('learnMore')}
                >
                    {t('learnMore')}
                </button>
            </div>

            <div id="hero-badges" className={styles.badges}>
                <div className={`text-soft ${styles.badge}`}>
                    <Globe size={18} strokeWidth={2} color="#f4ece4" aria-hidden="true" />
                    {t('onlinePresence')}
                </div>
                <div className={`text-soft ${styles.badge}`}>
                    <Compass size={18} strokeWidth={2} color="#f4ece4" aria-hidden="true" />
                    {f('nomadFriendly')}
                </div>
                <div className={`text-soft ${styles.badge}`}>
                    <Languages size={18} strokeWidth={2} color="#f4ece4" aria-hidden="true" />
                    {f('bilingual')}
                </div>
            </div>
        </section>
    )
}
