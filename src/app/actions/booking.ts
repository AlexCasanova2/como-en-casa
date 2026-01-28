'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getBookingOccupancyAction(date: string) {
    const admin = createAdminClient();

    // 1. Obtener total de terapeutas activos
    const { count: totalTherapists } = await admin
        .from('terapeutas')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

    // 2. Obtener citas para ese día
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    const { data: bookedCitas, error } = await admin
        .from('citas')
        .select('fecha_inicio, terapeuta_id')
        .gte('fecha_inicio', startOfDay)
        .lte('fecha_inicio', endOfDay);

    if (error) {
        console.error('Error fetching occupancy:', error);
        return { error: error.message };
    }

    // 3. Agrupar por hora para saber cuántos terapeutas están ocupados
    const occupancy: Record<string, string[]> = {}; // hora -> [ids de terapeutas ocupados]

    bookedCitas?.forEach(cita => {
        const time = new Date(cita.fecha_inicio).toISOString().split('T')[1].substring(0, 5);
        if (!occupancy[time]) occupancy[time] = [];
        occupancy[time].push(cita.terapeuta_id);
    });

    return {
        totalTherapists: totalTherapists || 0,
        occupancy
    };
}
