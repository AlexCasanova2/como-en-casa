
import { getTranslations } from 'next-intl/server'
import Footer from '@/components/layout/Footer'
import ContactClient from './ContactClient'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Contact' });
    return {
        title: `${t('title')} | Como en casa`,
        description: t('subtitle')
    };
}

export default function ContactoPage() {
    return (
        <div id="contacto-page-container" style={{ minHeight: '100vh' }}>
            <ContactClient />
            <Footer />
        </div>
    )
}
