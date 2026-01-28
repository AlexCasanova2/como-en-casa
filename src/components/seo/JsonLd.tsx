'use client'

export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MedicalOrganization',
        'name': 'Como en Casa - Terapia Online',
        'description': 'Plataforma de apoyo psicológico online para nómadas digitales y ciudadanos globales. Terapia bilingüe adaptada a tu estilo de vida.',
        'url': 'https://comoencasa-terapia.vercel.app',
        'logo': 'https://comoencasa-terapia.vercel.app/logo.png', // Ajustar ruta
        'sameAs': [
            'https://www.instagram.com/comoencasa',
            'https://www.linkedin.com/company/comoencasa'
        ],
        'medicalSpecialty': 'Psychiatry'
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
