'use server'

import { cookies } from 'next/headers'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createTerapeutaAction(formData: any) {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Verificar que quien llama es ADMIN
    if (!user) throw new Error('No autorizado')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No tienes permisos suficientes')

    const adminClient = createAdminClient()

    // 2. Crear usuario en Auth
    const { data: newUser, error: authError } = await adminClient.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
            full_name: formData.full_name,
            role: 'admin' // Como pidió el usuario, le damos rol admin
        }
    })

    if (authError) throw new Error(authError.message)

    // 3. Crear registro en tabla terapeutas
    // El trigger on_auth_user_created ya habrá creado el perfil en la tabla 'profiles'
    const { error: terapeutaError } = await adminClient
        .from('terapeutas')
        .insert({
            id: newUser.user.id,
            bio: formData.bio,
            experience_years: formData.experience_years,
            specialties: formData.specialties,
            is_active: true
        })

    if (terapeutaError) {
        // Si falla la tabla terapeutas, borramos el usuario para no dejar basura
        await adminClient.auth.admin.deleteUser(newUser.user.id)
        throw new Error(terapeutaError.message)
    }

    return { success: true, userId: newUser.user.id }
}

export async function updateTerapeutaAction(formData: any) {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Verificar que quien llama es ADMIN
    if (!user) throw new Error('No autorizado')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No tienes permisos suficientes')

    const adminClient = createAdminClient()

    // 2. Actualizar tabla terapeutas
    const { error: terapeutaError } = await adminClient
        .from('terapeutas')
        .update({
            bio: formData.bio,
            experience_years: formData.experience_years,
            specialties: formData.specialties,
            is_active: formData.is_active
        })
        .eq('id', formData.id)

    if (terapeutaError) throw new Error(terapeutaError.message)

    // 3. Actualizar nombre en tabla profiles
    const { error: profileError } = await adminClient
        .from('profiles')
        .update({
            full_name: formData.full_name
        })
        .eq('id', formData.id)

    if (profileError) throw new Error(profileError.message)

    return { success: true }
}

export async function saveScheduleAction(terapeutaId: string, schedule: any[]) {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Verificar que quien llama es ADMIN
    if (!user) throw new Error('No autorizado')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No tienes permisos suficientes')

    const adminClient = createAdminClient()

    // 2. Borrar horarios actuales
    const { error: deleteError } = await adminClient
        .from('disponibilidad_semanal')
        .delete()
        .eq('terapeuta_id', terapeutaId)

    if (deleteError) throw new Error(deleteError.message)

    // 3. Insertar nuevos (si hay)
    if (schedule.length > 0) {
        const { error: insertError } = await adminClient
            .from('disponibilidad_semanal')
            .insert(
                schedule.map(s => ({
                    terapeuta_id: terapeutaId,
                    dia_semana: s.dia_semana,
                    hora_inicio: s.hora_inicio,
                    hora_fin: s.hora_fin
                }))
            )

        if (insertError) throw new Error(insertError.message)
    }

    return { success: true }
}

export async function getDashboardOverviewAction() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('No autorizado')

    // Obtener perfil del usuario actual
    const { data: userProfile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()

    if (!userProfile) throw new Error('Perfil no encontrado')

    const isAdmin = userProfile.role === 'admin'
    const adminClient = createAdminClient()

    // 1. Obtener Reservas Recientes
    let bookingsQuery = adminClient
        .from('sesiones_compradas')
        .select(`
            *,
            servicios(name, price_cents),
            profiles:user_id(full_name),
            terapeuta:terapeuta_id(profiles(full_name))
        `)
        .order('created_at', { ascending: false })

    if (!isAdmin) {
        bookingsQuery = bookingsQuery.eq('terapeuta_id', user.id)
    }

    const { data: bookings, error: bookingsError } = await bookingsQuery.limit(5)

    // 2. Estadísticas
    // Si es admin, total revenue de todas las sesiones pagadas
    let totalRevenue = 0
    let totalSessions = 0

    if (isAdmin) {
        const { data: allPaid } = await adminClient
            .from('sesiones_compradas')
            .select('servicios(price_cents)')
            .eq('status', 'paid')

        totalRevenue = allPaid?.reduce((acc: number, curr: any) => acc + (curr.servicios?.price_cents || 0), 0) || 0

        const { count } = await adminClient.from('sesiones_compradas').select('*', { count: 'exact', head: true })
        totalSessions = count || 0
    } else {
        // Si es terapeuta, solo sus sesiones
        const { data: mySessions } = await adminClient
            .from('sesiones_compradas')
            .select('servicios(price_cents)')
            .eq('terapeuta_id', user.id)
            .eq('status', 'paid')

        totalRevenue = mySessions?.reduce((acc: number, curr: any) => acc + (curr.servicios?.price_cents || 0), 0) || 0
        totalSessions = mySessions?.length || 0
    }

    const { count: therapistsCount } = await adminClient.from('terapeutas').select('*', { count: 'exact', head: true })

    return {
        isAdmin,
        userName: userProfile.full_name,
        recentBookings: bookings || [],
        stats: {
            totalRevenue: totalRevenue / 100,
            totalSessions,
            totalTherapists: therapistsCount || 0
        }
    }
}
