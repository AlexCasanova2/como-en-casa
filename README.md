# Como en Casa - Plataforma de Terapia Online

Bienvenido al repositorio de **Como en Casa**, una plataforma moderna de gestión de terapias construida con Next.js, Supabase y Stripe.

## 🚀 Últimas Mejoras y Actualizaciones (Enero 2026)

Se han realizado mejoras significativas en el panel de administración para mejorar la robustez y la experiencia de usuario.

### 📊 Dashboard Administrativo (Nuevo)
- **Vista de Resumen**: Nueva página de aterrizaje con estadísticas clave (sesiones, ingresos, terapeutas).
- **Control de Reservas**: Visualización inmediata de las últimas sesiones compradas y su estado de pago.
- **Acceso Multirrol**:
  - **Admins**: Visión global de toda la plataforma.
  - **Terapeutas**: Acceso restringido a sus propias estadísticas y próximas citas.
- **Middleware de Seguridad**: Actualizado para permitir el acceso a terapeutas y gestionar redirecciones inteligentes tras el login.

### 🛠️ Corrección de Errores y Robustez
- **Gestión de Terapeutas**: Corregido el error que impedía actualizar el nombre y perfil de los terapeutas debido a políticas RLS (Row Level Security). Ahora se utiliza una **Server Action** con privilegios administrativos.
- **Edición de Horarios**:
  - Solucionada la pérdida de foco en los seletores de hora mediante el uso de identificadores estables (`tempId`).
  - Implementado el guardado persistente de disponibilidad semanal mediante acciones de servidor.
- **Optimización de Bundling**: Refactorización del cliente de Supabase administrativo para evitar errores de compilación (`vendor-chunks`) en entornos de servidor de Next.js.
- **Notificaciones**: Reemplazo de alertas nativas por un componente de **Toast** personalizado para una experiencia más fluida.

---

## 🛠️ Stack Tecnológico
- **Frontend**: Next.js 14 (App Router), React, Lucide React, Framer Motion.
- **Backend/Base de Datos**: Supabase (PostgreSQL, Auth, RLS).
- **Internacionalización**: `next-intl`.
- **Pagos**: Stripe API.
- **Despliegue**: Preparado para producción (ver `PRODUCTION.md`).

## 📁 Estructura del Proyecto (Admin)
- `src/app/[locale]/admin/dashboard/page.tsx`: Página principal de estadísticas.
- `src/app/actions/admin.ts`: Lógica de servidor para operaciones administrativas protegidas.
- `src/lib/supabase/admin.ts`: Cliente de Supabase con Service Role (uso exclusivo en servidor).

## 📄 Notas Adicionales
Para más detalles sobre correcciones específicas, consulta:
- `BUG-FIX-TERAPEUTAS.md`: Detalle técnico sobre la solución de políticas RLS.
- `MEJORAS-IMPLEMENTADAS.md`: Historial de mejoras visuales y funcionales.
