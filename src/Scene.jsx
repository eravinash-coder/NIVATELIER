//Scene.jsx
import { Canvas } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import Player from "./Player"
import { OrbitControls } from "@react-three/drei"

export default function Scene() {
  const playerRef = useRef()

  return (
    <Canvas shadows camera={{ position: [0, 3, 8], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        intensity={2}
        castShadow
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#EAE6DF" />
      </mesh>

      {/* Player */}
      <Suspense fallback={null}>
        <Player ref={playerRef} position={[0, 0, 0]} />
      </Suspense>

      {/* Optional orbit controls for cinematic camera */}
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  )
}
