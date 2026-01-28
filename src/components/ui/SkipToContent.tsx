'use client'

import { useEffect, useRef } from 'react'

export default function SkipToContent() {
    const linkRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        const link = linkRef.current
        if (!link) return

        const handleFocus = () => {
            link.style.left = '1rem'
            link.style.top = '1rem'
        }

        const handleBlur = () => {
            link.style.left = '-9999px'
        }

        link.addEventListener('focus', handleFocus)
        link.addEventListener('blur', handleBlur)

        return () => {
            link.removeEventListener('focus', handleFocus)
            link.removeEventListener('blur', handleBlur)
        }
    }, [])

    return (
        <a
            ref={linkRef}
            href="#main-content"
            className="skip-to-content"
            style={{
                position: 'absolute',
                left: '-9999px',
                zIndex: 999,
                padding: '1rem',
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 600,
            }}
        >
            Saltar al contenido principal
        </a>
    )
}
