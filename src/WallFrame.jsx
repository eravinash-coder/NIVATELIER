// WallFrame.jsx
import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useNavigate } from "react-router-dom"
import * as THREE from "three"
import { useGallery } from "./useGallery"

import { useTexture } from "@react-three/drei"

const FOCUS_DIST = 5
const UNFOCUS_DIST = 7.5

export default function WallFrame({ position, rotation, id = 1, playerRef }) {
  const navigate = useNavigate()
  const group = useRef()
  const { focusedFrame, focus, unfocus } = useGallery()
  const safeId = ((Number(id) - 1) % 10) + 1
  const texture = useTexture(`/products/p${safeId}.jpg`)

  // Configure texture once loaded
  if (texture) {
    texture.anisotropy = 8
    texture.minFilter = THREE.LinearMipMapLinearFilter
  }
  const [hovered, setHovered] = useState(false)
  const isFocused = focusedFrame?.id === safeId

  const getCamTarget = () => {
    const pos = new THREE.Vector3(...position)
    const normal = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(...rotation))
    const camPos = pos.clone().add(normal.multiplyScalar(5.5))
    camPos.y = position[1] + 0.5
    return { camPos, lookAt: new THREE.Vector3(...position) }
  }

  useFrame(() => {
    if (!playerRef?.current || !group.current) return
    const dist = group.current.position.distanceTo(playerRef.current.position)
    const isThis = focusedFrame?.id === safeId
    const otherFocused = focusedFrame && !isThis

    if (dist < FOCUS_DIST && !isThis && !otherFocused) {
      const t = getCamTarget()
      focus({ id: safeId, camPos: t.camPos, lookAt: t.lookAt })
    }
    if (isThis && dist > UNFOCUS_DIST) unfocus()

    const s = isFocused ? 1.06 : hovered ? 1.03 : 1.0
    group.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08)
  })

  const frameColor = isFocused ? "#C8A040" : hovered ? "#A07828" : "#7A5820"
  const emissive = isFocused ? "#5A3A00" : hovered ? "#3A2000" : "#1A0E00"

  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* Shadow backing */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[5.6, 4.2, 0.06]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>

      {/* Outer frame */}
      <mesh
        onClick={() => navigate(`/product/${safeId}`)}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer" }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default" }}
        castShadow receiveShadow
      >
        <boxGeometry args={[5.2, 4.0, 0.3]} />
        <meshStandardMaterial
          color={frameColor}
          emissive={emissive}
          emissiveIntensity={isFocused ? 0.9 : hovered ? 0.6 : 0.4}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Mat board */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[4.7, 3.55, 0.04]} />
        <meshStandardMaterial color="#F5F0E8" roughness={1} />
      </mesh>

      {/* Product image */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[4.3, 3.1]} />
        <meshStandardMaterial
          map={texture}
          transparent={!texture}
          opacity={texture ? 1 : 0}
          side={THREE.FrontSide}
          emissive="#ffffff"
          emissiveIntensity={isFocused ? 0.15 : 0.05}
        />
      </mesh>

      {/* Fallback colored panel if no texture */}
      <mesh position={[0, 0, 0.20]}>
        <planeGeometry args={[4.3, 3.1]} />
        <meshStandardMaterial
          color={`hsl(${safeId * 36}, 40%, 65%)`}
          emissive={`hsl(${safeId * 36}, 40%, 30%)`}
          emissiveIntensity={0.3}
          transparent
          opacity={texture ? 0 : 1}
        />
      </mesh>

      {/* Focus spotlight */}
      {isFocused && (
        <spotLight position={[0, 5, 3]} angle={0.5} penumbra={0.7} intensity={4} color="#FFE8B0" distance={12} castShadow={false} />
      )}
      {hovered && !isFocused && (
        <pointLight position={[0, 0, 2]} intensity={0.7} distance={5} color="#FFD580" />
      )}
    </group>
  )
}