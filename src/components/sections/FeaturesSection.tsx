import { Compass, Languages, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import styles from './FeaturesSection.module.css'

export default function FeaturesSection() {
    const f = useTranslations('Features')

    const features = [
        {
            id: 'nomad',
            icon: Compass,
            title: f('nomadFriendly'),
            description: f('nomadFriendlyDesc')
        },
        {
            id: 'bilingual',
            icon: Languages,
            title: f('bilingual'),
            description: f('bilingualDesc')
        },
        {
            id: 'flexible',
            icon: Zap,
            title: f('flexible'),
            description: f('flexibleDesc')
        }
    ]

    return (
        <section className={`section ${styles.section}`}>
            <div className={styles.container}>
                <h2 className={`text-glow ${styles.title}`}>{f('title')}</h2>
                <div className={styles.grid}>
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <article
                                key={feature.id}
                                className={`glass-card ${styles.card}`}
                                aria-labelledby={`feature-${feature.id}-title`}
                            >
                                <div className={styles.iconWrapper} aria-hidden="true">
                                    <Icon color="white" size={32} />
                                </div>
                                <h3 id={`feature-${feature.id}-title`} className={styles.cardTitle}>
                                    {feature.title}
                                </h3>
                                <p className={`text-soft ${styles.cardDescription}`}>
                                    {feature.description}
                                </p>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
