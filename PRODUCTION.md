# COMO EN CASA - Checklist de Producción

## 1. Variables de Entorno (Vercel)
Asegúrate de configurar estas variables en el panel de Vercel:

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Clave pública de producción.
- `STRIPE_SECRET_KEY`: Clave secreta de producción.
- `STRIPE_WEBHOOK_SECRET`: Se obtiene tras configurar el webhook en el dashboard de Stripe apuntando a `https://tu-dominio.com/api/webhooks/stripe`.

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anon para el cliente.
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio para el middleware y webhooks (mantener secreta).

### App
- `NEXT_PUBLIC_API_URL`: `https://tu-dominio.com/api`

## 2. Optimizaciones Three.js Realizadas
- [x] **DPR Limitado:** Restringido a 1.5 para evitar sobrecarga en pantallas 4K/Retina.
- [x] **Power Preference:** Configurado en `high-performance`.
- [x] **Lazy Loading:** El Canvas no bloquea la carga del HTML inicial.
- [x] **Antialias Dinámico:** Activado solo donde es necesario.

## 3. SEO & UX Internacional
- [x] **Canonical Tags:** Configurados automáticamente por Next.js.
- [x] **Alternate Hreflang:** Manejado por `next-intl`.
- [x] **Timezone Detection:** Implementado en el cliente para nomad-friendly UX.

## 4. Comandos de Construcción
- Build: `npm run build`
- Start: `npm start`
- Lint: `npm run lint`

## 5. Pruebas Finales
1. Verificar flujo de pago en modo `test` de Stripe.
2. Comprobar que el middleware redirige correctamente a `/admin/login` si no hay sesión.
3. Validar que el 3D no bloquea el scroll en móviles.
