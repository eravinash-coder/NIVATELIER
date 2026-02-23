import React, { useRef, useEffect, useState, useMemo } from "react"
import { useGLTF, Text, Float, ContactShadows, Environment, PerspectiveCamera, useProgress, Html, Center } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import * as THREE from "three"

// Component for an individual Model to handle its own loading and transitions
function ModelItem({ modelPath, active, targetScale, targetOffset, targetRotation, color, onLoaded }) {
    const { scene } = useGLTF(modelPath)
    const groupRef = useRef()
    const [visible, setVisible] = useState(active)

    // Clone scene to avoid shared state
    const clonedScene = useMemo(() => scene.clone(), [scene])

    useEffect(() => {
        if (clonedScene) {
            clonedScene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                    child.material = child.material.clone()
                }
            })
            onLoaded?.()
        }
    }, [clonedScene])

    // Handle color updates
    useEffect(() => {
        if (clonedScene && active) {
            clonedScene.traverse((child) => {
                if (child.isMesh) {
                    gsap.to(child.material.color, {
                        r: new THREE.Color(color).r,
                        g: new THREE.Color(color).g,
                        b: new THREE.Color(color).b,
                        duration: 1
                    })
                }
            })
        }
    }, [color, active, clonedScene])

    useEffect(() => {
        if (!groupRef.current) return

        if (active) {
            setVisible(true)
            gsap.to(groupRef.current.position, {
                y: targetOffset,
                z: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            gsap.to(groupRef.current.scale, {
                x: targetScale[0], y: targetScale[1], z: targetScale[2],
                duration: 0.8,
                ease: "back.out(1.2)"
            })
            gsap.to(groupRef.current.rotation, {
                x: targetRotation[0],
                y: targetRotation[1],
                z: targetRotation[2],
                duration: 0.8,
                ease: "power3.out"
            })
        } else {
            gsap.to(groupRef.current.position, {
                y: -10,
                duration: 0.6,
                ease: "power3.in",
                onComplete: () => setVisible(false)
            })
            gsap.to(groupRef.current.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.6
            })
        }
    }, [active, targetScale, targetOffset, targetRotation])

    return (
        <group ref={groupRef} visible={visible} scale={[0, 0, 0]} position={[0, -10, 0]}>
            <Center top>
                <primitive object={clonedScene} />
            </Center>
        </group>
    )
}

export default function ChairExperience({ product, variantIndex, colorIndex, onArrival }) {
    const rRef = useRef()
    const [arrived, setArrived] = useState(false)

    const currentVariant = product.variants[variantIndex]
    const currentColor = currentVariant.colors[colorIndex]

    // Phase 1: Entry Animation
    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setArrived(true)
                onArrival?.()
            }
        })

        gsap.set(rRef.current.scale, { x: 1, y: 1, z: 1 })

        tl.to(rRef.current.scale, {
            x: 1.25,
            y: 1.25,
            z: 1.25,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.5
        })
            .to(rRef.current, {
                opacity: 0.1,
                duration: 1.5,
                ease: "power2.out"
            }, "-=1.2")
    }, [])

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

            {/* BACKGROUND TEXT - DYNAMIC FROM PRODUCT DATA */}
            <Text
                ref={rRef}
                position={[0, 1.1, -5]}
                fontSize={2.3}
                color={currentColor.textColor}
                anchorX="center"
                anchorY="middle"
                opacity={0.8}
                transparent
            >
                {currentVariant.text}
            </Text>

            {/* MULTIPLE MODELS AS SLIDER */}
            <Float speed={arrived ? 1.5 : 0} rotationIntensity={0.5} floatIntensity={0.5}>
                {product.variants.map((v, i) => (
                    <ModelItem
                        key={i}
                        modelPath={v.model}
                        active={variantIndex === i}
                        targetScale={v.scale}
                        targetOffset={v.offset}
                        targetRotation={v.rotation}
                        color={i === variantIndex ? currentColor.hex : "#ffffff"}
                        onLoaded={() => i === 0 && !arrived && onArrival?.()}
                    />
                ))}
            </Float>

            <ContactShadows
                position={[0, -2, 0]}
                opacity={0.4}
                scale={20}
                blur={2.4}
                far={4.5}
            />
        </>
    )
}
