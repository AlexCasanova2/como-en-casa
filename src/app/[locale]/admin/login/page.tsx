'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // El middleware se encargará de la redirección y validación de rol
        // Pero forzamos un refresh para que el middleware actúe sobre la nueva sesión
        router.refresh()
        router.push('/admin/dashboard/pagos')
    }

    return (
        <div className="hero" style={{ minHeight: '100vh', background: '#fdf6e3' }}>
            <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px', borderRadius: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#4a4a4a' }}>Admin Login</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#6b705c' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#6b705c' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #ddd', background: 'white' }}
                        />
                    </div>
                    {error && <p style={{ color: '#d9534f', fontSize: '0.9rem' }}>{error}</p>}
                    <button
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            borderRadius: '50px',
                            border: 'none',
                            background: '#4a4a4a',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Entrando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    )
}
