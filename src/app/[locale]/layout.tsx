import type { Metadata } from 'next'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter, Outfit } from 'next/font/google'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

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

export const metadata: Metadata = {
    title: 'Como en casa',
    description: 'Apoyo psicológico para nómadas digitales y ciudadanos globales.',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    viewport: 'width=device-width, initial-scale=1',
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
            <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                <NextIntlClientProvider messages={messages}>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
