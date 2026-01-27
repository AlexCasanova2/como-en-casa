
import { redirect } from '@/i18n/routing'

export default function AdminRootPage() {
    // Redirigir por defecto al dashboard de pagos
    redirect({ href: '/admin/dashboard/pagos', locale: 'es' })
}
