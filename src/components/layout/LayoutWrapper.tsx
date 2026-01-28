
'use client'

import { usePathname } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import LoadingScreen from '@/components/ui/LoadingScreen'

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
    ssr: false,
})

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === '/'
    const isAdmin = pathname?.includes('/admin')
    const isDashboard = pathname?.includes('/dashboard')
    const isPublic = !isAdmin && !isDashboard
    const [isLoading, setIsLoading] = useState(isHome)

    useEffect(() => {
        if (isHome) {
            // Simulamos un tiempo mínimo para que la escena 3D cargue sus assets básicos
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 1800)
            return () => clearTimeout(timer)
        } else {
            setIsLoading(false)
        }
    }, [isHome])

    return (
        <>
            {isLoading && <LoadingScreen />}

            <div style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 1s ease-in-out',
                visibility: isLoading ? 'hidden' : 'visible'
            }}>
                {isPublic && <Header />}
                {isHome && (
                    <div className="canvas-container">
                        <Scene />
                    </div>
                )}
                <main className={(isHome && isPublic) ? 'main-content' : ''}>
                    {children}
                </main>
            </div>
        </>
    )
}
