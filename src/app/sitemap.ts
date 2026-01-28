import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://comoencasa-terapia.vercel.app' // Cambiar por el dominio real
    const locales = ['es', 'en']
    const routes = ['', '/conocenos', '/blog', '/admin/dashboard']

    const entries = routes.flatMap((route) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    )

    return entries
}
