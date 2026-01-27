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

    // Proteger rutas /admin (teniendo en cuenta localización)
    const isEnAdmin = request.nextUrl.pathname.startsWith('/en/admin')
    const isEsAdmin = request.nextUrl.pathname.startsWith('/es/admin')
    const isAdmin = request.nextUrl.pathname.startsWith('/admin')

    if (isAdmin || isEnAdmin || isEsAdmin) {
        const currentLocale = isEnAdmin ? '/en' : isEsAdmin ? '/es' : ''
        const loginPath = `${currentLocale}/admin/login`
        const dashboardPath = `${currentLocale}/admin/dashboard/pagos`

        // Si no hay usuario y no está en login, redirigir a login
        if (!user && request.nextUrl.pathname !== loginPath) {
            return NextResponse.redirect(new URL(loginPath, request.url))
        }

        // Si hay usuario, verificar rol admin
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin' && request.nextUrl.pathname !== loginPath) {
                // Redirigir al home si no es admin
                return NextResponse.redirect(new URL(`${currentLocale}/`, request.url))
            }

            // Si ya está logueado como admin y está en login, redirigir a dashboard
            if (profile?.role === 'admin' && request.nextUrl.pathname === loginPath) {
                return NextResponse.redirect(new URL(dashboardPath, request.url))
            }
        }
    }

    return res
}
