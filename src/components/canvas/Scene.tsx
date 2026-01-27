'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Float, ContactShadows, RoundedBox, Sparkles, SpotLight } from '@react-three/drei'
import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

/** 
 * TEXTURA DE TELA SUAVE 
 */
const useFabricTexture = () => {
    return useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const context = canvas.getContext('2d')!
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, 512, 512)
        for (let i = 0; i < 20000; i++) {
            const x = Math.random() * 512
            const y = Math.random() * 512
            const opacity = Math.random() * 0.05
            context.fillStyle = `rgba(0,0,0,${opacity})`
            context.fillRect(x, y, 1, 4)
        }
        const texture = new THREE.CanvasTexture(canvas)
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(2, 2)
        return texture
    }, [])
}

const Sofa = ({ fabricMap }: { fabricMap: THREE.CanvasTexture }) => {
    return (
        <group position={[0, -0.4, 0]}>
            <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
                <group>
                    <RoundedBox args={[3, 0.6, 1.4]} radius={0.2} smoothness={4} castShadow receiveShadow>
                        <meshPhysicalMaterial map={fabricMap} color="#ffffff" roughness={0.85} bumpMap={fabricMap} bumpScale={0.01} />
                    </RoundedBox>
                    <RoundedBox args={[3, 1.2, 0.4]} radius={0.3} smoothness={4} position={[0, 0.6, -0.5]} castShadow>
                        <meshPhysicalMaterial map={fabricMap} color="#ffffff" roughness={0.85} bumpMap={fabricMap} bumpScale={0.01} />
                    </RoundedBox>
                    <group position={[-1.6, 0.3, 0.1]}>
                        <RoundedBox args={[0.4, 0.8, 1.4]} radius={0.2} smoothness={4} castShadow>
                            <meshPhysicalMaterial map={fabricMap} color="#ffffff" roughness={0.85} />
                        </RoundedBox>
                    </group>
                    <group position={[1.6, 0.3, 0.1]}>
                        <RoundedBox args={[0.4, 0.8, 1.4]} radius={0.2} smoothness={4} castShadow>
                            <meshPhysicalMaterial map={fabricMap} color="#ffffff" roughness={0.85} />
                        </RoundedBox>
                    </group>
                </group>
            </Float>
            {[[-1.2, -0.5, 0.5], [1.2, -0.5, 0.5], [-1.2, -0.5, -0.5], [1.2, -0.5, -0.5]].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <cylinderGeometry args={[0.05, 0.02, 0.4]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            ))}
        </group>
    )
}

const Lamp = () => {
    const lightRef = useRef<THREE.SpotLight>(null!)

    return (
        <group position={[-2.4, -0.7, -0.2]}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
                <meshPhysicalMaterial color="#ffffff" />
            </mesh>

            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 3, 16]} />
                <meshPhysicalMaterial color="#ffffff" />
            </mesh>

            <group position={[0, 2.95, 0]}>
                <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.2, 0.025, 16, 32, Math.PI / 2]} />
                    <meshPhysicalMaterial color="#ffffff" />
                </mesh>

                <group position={[0.38, -0.05, 0]}>
                    <mesh castShadow>
                        <sphereGeometry args={[0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                        <meshPhysicalMaterial color="#ffffff" side={THREE.DoubleSide} emissive="#ffaa00" emissiveIntensity={0.1} />
                    </mesh>
                    <mesh position={[0, -0.1, 0]}>
                        <sphereGeometry args={[0.13, 16, 16]} />
                        <meshBasicMaterial color="#ffcc33" />
                    </mesh>

                    <SpotLight
                        ref={lightRef}
                        position={[0, 0.1, 0]}
                        target-position={[0, -5, 0]}
                        distance={15}
                        angle={0.6}
                        attenuation={5}
                        anglePower={5}
                        intensity={10}
                        color="#ffaa00"
                        castShadow
                    />

                    {/* CONO DE LUZ CORREGIDO: Parte estrecha arriba, parte ancha abajo */}
                    <mesh position={[0, -1.5, 0]}>
                        <cylinderGeometry args={[0.05, 1.5, 3, 32, 1, true]} />
                        <meshBasicMaterial
                            color="#ffaa00"
                            transparent
                            opacity={0.035}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                </group>
            </group>
        </group>
    )
}

const Content = () => {
    const groupRef = useRef<THREE.Group>(null!)
    const fabricMap = useFabricTexture()
    const [scroll, setScroll] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight))
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useFrame((state) => {
        const targetRotationX = (state.mouse.y * Math.PI) * 0.005
        const targetRotationY = (state.mouse.x * Math.PI) * 0.005
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetRotationX, 0.05)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05)

        const targetZ = scroll * 3.5
        const targetX = 3 - (scroll * 1.5)
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05)
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
    })

    return (
        <group ref={groupRef} position={[3, -1.2, 0]} scale={1.4}>
            <Sofa fabricMap={fabricMap} />
            <Lamp />
        </group>
    )
}

export default function Scene() {
    return (
        <Canvas
            shadows
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping
            }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.5, 10], fov: 32 }}
        >
            <color attach="background" args={['#7a5448']} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 0]} intensity={0.2} color="#fdf6e3" />

            <Suspense fallback={null}>
                <Content />
                <Sparkles count={150} scale={[12, 12, 12]} size={2.5} speed={0.5} opacity={0.3} color="#ffcc33" />
                <ContactShadows position={[0, -2.8, 0]} opacity={0.3} scale={25} blur={2.2} far={4} />
            </Suspense>
        </Canvas>
    )
}
