
import { redirect } from '@/i18n/routing'

export default function DashboardRootPage() {
    redirect({ href: '/admin/dashboard/pagos', locale: 'es' })
}
