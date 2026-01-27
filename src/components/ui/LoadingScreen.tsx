
'use client'

import { useState, useEffect } from 'react'

export default function LoadingScreen() {
    return (
        <div id="global-loader" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#7a5448',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem'
        }}>
            {/* Logo o Icono Central Animado */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid rgba(212, 163, 115, 0.2)',
                borderTop: '2px solid #d4a373',
                animation: 'spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
            }} />

            <div style={{ textAlign: 'center' }}>
                <h2 style={{
                    color: '#fdf6e3',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    margin: 0,
                    opacity: 0.8
                }}>
                    Como en casa
                </h2>
                <p className="text-soft" style={{
                    fontSize: '0.9rem',
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                }}>
                    Preparando tu refugio...
                </p>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
