'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, LogOut, Home } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (pathname === '/admin/login') return <>{children}</>

    const navItems = [
        { name: 'Pagos', path: '/admin/dashboard/pagos', icon: <CreditCard size={20} /> },
        { name: 'Terapeutas', path: '/admin/dashboard/terapeutas', icon: <Users size={20} /> },
        { name: 'Servicios', path: '/admin/dashboard/servicios', icon: <LayoutDashboard size={20} /> },
    ]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #eee', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ color: '#4a4a4a', fontSize: '1.5rem', fontWeight: 800 }}>Como en casa</h2>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Panel de Administración</p>
                </div>

                <nav style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={pathname === item.path ? 'glass' : ''}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                color: pathname === item.path ? '#d4a373' : '#666',
                                fontWeight: pathname === item.path ? 600 : 400,
                                textDecoration: 'none'
                            }}
                        >
                            {item.icon} {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                        <Home size={18} /> Ver web
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: '#d9534f',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '0.75rem 0',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flexGrow: 1, padding: '3rem', overflowY: 'auto' }}>
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '2rem', color: '#4a4a4a' }}>
                        {navItems.find(i => i.path === pathname)?.name || 'Admin'}
                    </h1>
                </header>
                {children}
            </main>
        </div>
    )
}
