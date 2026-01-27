import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
    title: 'Como en casa',
    description: 'Apoyo psicológico para nómadas digitales y ciudadanos globales.',
}

import LayoutWrapper from '@/components/layout/LayoutWrapper'

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
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
