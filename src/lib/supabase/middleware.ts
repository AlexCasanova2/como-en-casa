import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response?: NextResponse) {
    let res = response || NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('ERROR: Missing Supabase URL or Anon Key in environment variables.');
        return res;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    res = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    res.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    res = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    res.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Proteger rutas /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Si no hay usuario y no está en /admin/login, redirigir a login
        if (!user && request.nextUrl.pathname !== '/admin/login') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Si hay usuario, verificar rol admin
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin' && request.nextUrl.pathname !== '/admin/login') {
                // Podríamos redirigir a una página de "no autorizado" o al home
                return NextResponse.redirect(new URL('/', request.url))
            }

            // Si ya está logueado como admin y está en login, redirigir a dashboard
            if (profile?.role === 'admin' && request.nextUrl.pathname === '/admin/login') {
                return NextResponse.redirect(new URL('/admin/dashboard/pagos', request.url))
            }
        }
    }

    return res
}
