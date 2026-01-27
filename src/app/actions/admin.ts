'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Cliente con Service Role para operaciones administrativas (SOLO SERVIDOR)
const getAdminClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error('Variables de entorno de Supabase faltantes (URL o Service Role Key)');
    }

    return createClient(url, serviceRoleKey)
}

export async function createTerapeutaAction(formData: any) {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Verificar que quien llama es ADMIN
    if (!user) throw new Error('No autorizado')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No tienes permisos suficientes')

    const adminClient = getAdminClient()

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
