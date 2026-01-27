import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
    ssr: false,
    loading: () => <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6e3', color: '#d4a373' }}>Cargando paz...</div>
})

import Header from '@/components/layout/Header'

export const metadata: Metadata = {
    title: 'Como En Casa | Next.js + Three.js Landing',
    description: 'Premium landing page for digital nomads with 3D animations and Next.js 14',
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

    // Obtener mensajes para el provider (opcional si solo usas server components, pero útil para componentes de cliente)
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    <div className="canvas-container">
                        <Scene />
                    </div>
                    <main className="main-content">
                        {children}
                    </main>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
