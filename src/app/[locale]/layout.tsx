import type { Metadata, Viewport } from 'next'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter, Outfit } from 'next/font/google'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import SkipToContent from '@/components/ui/SkipToContent'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    const title = locale === 'es'
        ? 'Como en casa - Terapia Online para Nómadas Digitales'
        : 'Como en casa - Online Therapy for Digital Nomads'

    const description = locale === 'es'
        ? 'Apoyo psicológico online para nómadas digitales y ciudadanos globales. Terapia bilingüe (ES/EN) adaptada a tu estilo de vida.'
        : 'Online psychological support for digital nomads and global citizens. Bilingual therapy (ES/EN) adapted to your lifestyle.'

    return {
        title,
        description,
        keywords: locale === 'es'
            ? 'terapia online, psicología, nómadas digitales, terapia bilingüe, salud mental'
            : 'online therapy, psychology, digital nomads, bilingual therapy, mental health',
        authors: [{ name: 'Como en casa' }],
        openGraph: {
            title,
            description,
            type: 'website',
            locale: locale === 'es' ? 'es_ES' : 'en_US',
            siteName: 'Como en casa',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Verificamos que el locale sea válido
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Obtener mensajes para el provider
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${inter.variable} ${outfit.variable}`}>
            <head>
                {/* Preconnect a Google Fonts para mejor performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                {/* Skip to main content link para accesibilidad */}
                <SkipToContent />

                <NextIntlClientProvider messages={messages}>
                    <LayoutWrapper>
                        <main id="main-content">
                            {children}
                        </main>
                    </LayoutWrapper>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
