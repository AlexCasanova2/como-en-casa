'use client'

import { usePathname } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
    ssr: false,
    loading: () => <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6e3', color: '#d4a373' }}>Cargando paz...</div>
})

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === '/'
    const isPublic = !pathname?.includes('/admin')

    return (
        <>
            {isPublic && <Header />}
            {isHome && (
                <div className="canvas-container">
                    <Scene />
                </div>
            )}
            <main className={(isHome && isPublic) ? 'main-content' : ''}>
                {children}
            </main>
        </>
    )
}
