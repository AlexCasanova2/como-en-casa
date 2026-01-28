'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Calendar, User, LogOut, Home, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './DashboardLayout.module.css'

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) router.push('/admin/login')
            setUser(user)
        }
        checkUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const navItems = [
        { name: 'Mis Citas', path: '/dashboard', icon: <Calendar size={20} /> },
        { name: 'Mi Perfil', path: '/dashboard/perfil', icon: <User size={20} /> },
        { name: 'Mensajes', path: '/dashboard/mensajes', icon: <MessageSquare size={20} /> },
    ]

    return (
        <div className={styles.layoutContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brandInfo}>
                    <h2>Mi Espacio</h2>
                    <p>Como en casa</p>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === (`/${pathname.split('/')[1]}${item.path}`) || pathname?.endsWith(item.path);
                        // Simplificación para detectar ruta activa considerando el locale
                        const active = pathname?.includes(item.path) && (item.path !== '/dashboard' || pathname?.endsWith('/dashboard'));

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles.navItem} ${active ? styles.activeNavItem : ''}`}
                            >
                                {item.icon} {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.footerLink}>
                        <Home size={18} /> Volver a la web
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}
