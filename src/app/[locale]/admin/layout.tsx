'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, LogOut, Home, BookOpen, Package } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    const isLoginPage = pathname?.endsWith('/admin/login')

    if (isLoginPage) return <div id="admin-login-wrapper">{children}</div>

    const navItems = [
        { name: 'Inicio', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Pagos', path: '/admin/dashboard/pagos', icon: <CreditCard size={20} /> },
        { name: 'Blog', path: '/admin/dashboard/blog', icon: <BookOpen size={20} /> },
        { name: 'Terapeutas', path: '/admin/dashboard/terapeutas', icon: <Users size={20} /> },
        { name: 'Servicios', path: '/admin/dashboard/servicios', icon: <Package size={20} /> },
    ]

    return (
        <div id="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <aside id="admin-sidebar" style={{ width: '280px', background: 'white', borderRight: '1px solid #eee', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div id="sidebar-logo" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ color: '#4a4a4a', fontSize: '1.5rem', fontWeight: 800 }}>Como en casa</h2>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Panel de Administración</p>
                </div>

                <nav id="sidebar-nav" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            id={`nav-item-${item.name.toLowerCase()}`}
                            className={pathname?.includes(item.path) ? 'glass' : ''}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                color: pathname?.includes(item.path) ? '#d4a373' : '#666',
                                fontWeight: pathname?.includes(item.path) ? 600 : 400,
                                textDecoration: 'none'
                            }}
                        >
                            {item.icon} {item.name}
                        </Link>
                    ))}
                </nav>

                <div id="sidebar-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link id="view-web-link" href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                        <Home size={18} /> Ver web
                    </Link>
                    <button
                        id="logout-button"
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
            <main id="admin-main-content" style={{ flexGrow: 1, padding: '3rem', overflowY: 'auto' }}>
                <header id="admin-content-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 id="page-title" style={{ fontSize: '2rem', color: '#4a4a4a' }}>
                        {navItems.find(i => pathname?.includes(i.path))?.name || 'Admin'}
                    </h1>
                </header>
                <div id="admin-child-content">
                    {children}
                </div>
            </main>
        </div>
    )
}
