'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Video, ShieldCheck, User } from 'lucide-react'
import Link from 'next/link'
import styles from './SessionPage.module.css'

export default function SessionPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const [cita, setCita] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [iframeLoading, setIframeLoading] = useState(true)
    const [userName, setUserName] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchCitaAndUser = async () => {
            // Fetch cita info
            const { data: citaData } = await supabase
                .from('citas')
                .select('*, terapeutas(profiles(full_name)), servicios(name)')
                .eq('id', id)
                .single()

            if (citaData) {
                setCita(citaData)

                // Check current user to set display name if client
                const { data: { user } } = await supabase.auth.getUser()
                if (user && user.id === citaData.user_id) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', user.id)
                        .single()

                    if (profile) setUserName(profile.full_name)
                }
            }
            setLoading(false)
        }
        fetchCitaAndUser()
    }, [id])

    if (loading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner} />
                <div className={styles.loadingText}>Preparando tu sesión privada</div>
                <div className={styles.loadingSub}>Estableciendo conexión segura...</div>
            </div>
        )
    }

    if (!cita) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.loadingText}>Sesión no encontrada</div>
                <div className={styles.loadingSub}>No pudimos recuperar la información de esta cita.</div>
                <Link href="/dashboard" className={styles.exitBtn} style={{ marginTop: '2rem' }}>
                    Volver al Dashboard
                </Link>
            </div>
        )
    }

    const roomName = `comoencasa-session-${cita.id.substring(0, 8)}`
    // Añadimos parámetros extra para forzar la entrada directa sin clics intermedios
    const jitsiUrlBase = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.prejoinConfig.enabled=false&config.requireDisplayName=false&config.disableDeepLinking=true&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`
    const jitsiUrl = userName ? `${jitsiUrlBase}&userInfo.displayName="${encodeURIComponent(userName)}"` : jitsiUrlBase

    return (
        <div className={styles.sessionContainer}>
            <header className={styles.header}>
                <div className={styles.therapistInfo}>
                    <div className={styles.avatar}>
                        {cita.terapeutas?.profiles?.avatar_url ? (
                            <img src={cita.terapeutas.profiles.avatar_url} alt={cita.terapeutas.profiles.full_name} className={styles.avatarImg} />
                        ) : (
                            <User size={24} color="#94a3b8" />
                        )}
                    </div>
                    <div className={styles.textGroup}>
                        <h1 className={styles.title}>{cita.servicios?.name}</h1>
                        <div className={styles.status}>
                            <div className={styles.statusDot} />
                            En vivo con {cita.terapeutas?.profiles?.full_name}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className={styles.badge}>
                        <ShieldCheck size={16} color="#22c55e" />
                        Encriptación de punto a punto
                    </div>
                    <button onClick={() => router.back()} className={styles.exitBtn}>
                        <ArrowLeft size={18} /> Salir
                    </button>
                </div>
            </header>

            <div className={styles.iframeWrapper}>
                {iframeLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner} />
                        <div className={styles.loadingText}>Conectando sala...</div>
                        <div className={styles.loadingSub}>Un momento, por favor.</div>
                    </div>
                )}
                <iframe
                    src={jitsiUrl}
                    allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
                    className={styles.iframe}
                    onLoad={() => setIframeLoading(false)}
                />
            </div>
        </div>
    )
}
