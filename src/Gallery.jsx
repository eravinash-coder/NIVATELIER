// Gallery.jsx
import { Canvas } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useProgress, Html } from "@react-three/drei"
import Player from "./Player"
import WallFrame from "./WallFrame"
import { GalleryProvider } from "./GalleryContext"
import { useGallery } from "./useGallery"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html fullscreen>
      <div style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "#0A0806",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "Georgia, serif",
      }}>
        <div style={{ color: "#C8A040", fontSize: "11px", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 48 }}>
          Gallery
        </div>
        <div style={{ width: "160px", height: "1px", background: "rgba(255,255,255,0.08)", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: progress + "%", background: "linear-gradient(to right, #8B6914, #C8A040)", transition: "width 0.3s ease" }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "0.25em", marginTop: 16, fontFamily: "monospace" }}>
          {Math.round(progress)}%
        </div>
      </div>
    </Html>
  )
}

const FRAMES = [
  { id: 1, position: [-7.4, 2.5, -4], rotation: [0, Math.PI / 2, 0] },
  { id: 2, position: [7.4, 2.5, -14], rotation: [0, -Math.PI / 2, 0] },
  { id: 3, position: [-7.4, 2.5, -24], rotation: [0, Math.PI / 2, 0] },
  { id: 4, position: [7.4, 2.5, -34], rotation: [0, -Math.PI / 2, 0] },
  { id: 5, position: [-7.4, 2.5, -44], rotation: [0, Math.PI / 2, 0] },
  { id: 6, position: [7.4, 2.5, -54], rotation: [0, -Math.PI / 2, 0] },
  { id: 7, position: [-7.4, 2.5, -64], rotation: [0, Math.PI / 2, 0] },
  { id: 8, position: [7.4, 2.5, -74], rotation: [0, -Math.PI / 2, 0] },
  { id: 9, position: [-7.4, 2.5, -84], rotation: [0, Math.PI / 2, 0] },
  { id: 10, position: [7.4, 2.5, -94], rotation: [0, -Math.PI / 2, 0] },
]

// Corridor: from z=8 (entrance) to z=-104 (back)
// Center z = (8 + -104) / 2 = -48, length = 112
const CZ = -48   // center z of corridor
const CL = 112   // corridor length

function FocusOverlay() {
  const { focusedFrame } = useGallery()
  const navigate = useNavigate()
  if (!focusedFrame) return null
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10,
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 60px",
        background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        pointerEvents: "all",
      }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
            No. {String(focusedFrame.id).padStart(2, "0")}
          </div>
          <div style={{ color: "#F5F0E8", fontSize: "28px", fontWeight: 300, marginBottom: 6 }}>
            Artwork {focusedFrame.id}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Gallery Collection · 2024</div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Walk away to continue
          </span>
          <button
            onClick={() => navigate(`/product/${focusedFrame.id}`)}
            style={{
              background: "transparent", border: "1px solid rgba(200,160,64,0.7)",
              color: "#C8A040", padding: "12px 28px", fontSize: "12px",
              letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={e => e.target.style.background = "rgba(200,160,64,0.12)"}
            onMouseLeave={e => e.target.style.background = "transparent"}
          >View Piece →</button>
        </div>
      </div>
    </div>
  )
}

function GalleryScene() {
  const playerRef = useRef()

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      camera={{ position: [0, 5, -2], fov: 60 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      style={{ height: "100vh", background: "#1A1410" }}
    >
      {/* LIGHTS - Reduced for performance */}
      <ambientLight intensity={1.5} />
      <hemisphereLight args={["#FFF5E4", "#2A1A08", 1.5]} />
      {Array.from({ length: 6 }, (_, i) => (
        <pointLight
          key={i}
          position={[0, 8, 8 - (i * 22)]}
          intensity={2.5}
          distance={45}
          color="#FFF8F0"
          decay={1.5}
        />
      ))}
      {/* WallFrame internal lights handle the highlights */}

      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CZ]} receiveShadow>
        <planeGeometry args={[16, CL]} />
        <meshStandardMaterial color="#C8BEA8" roughness={0.35} />
      </mesh>

      {/* CEILING */}
      <mesh position={[0, 9, CZ]}>
        <boxGeometry args={[16, 0.4, CL]} />
        <meshStandardMaterial color="#EEEAE2" roughness={1} />
      </mesh>

      {/* LEFT WALL */}
      <mesh position={[-8, 4.5, CZ]}>
        <boxGeometry args={[0.4, 9, CL]} />
        <meshStandardMaterial color="#E8E2D6" roughness={0.9} />
      </mesh>

      {/* RIGHT WALL */}
      <mesh position={[8, 4.5, CZ]}>
        <boxGeometry args={[0.4, 9, CL]} />
        <meshStandardMaterial color="#E8E2D6" roughness={0.9} />
      </mesh>

      {/* BACK WALL */}
      <mesh position={[0, 4.5, -104]}>
        <boxGeometry args={[16, 9, 0.4]} />
        <meshStandardMaterial color="#E0DAD0" roughness={0.9} />
      </mesh>

      {/* ENTRANCE WALL */}
      <mesh position={[0, 4.5, 8]}>
        <boxGeometry args={[16, 9, 0.4]} />
        <meshStandardMaterial color="#E0DAD0" roughness={0.9} />
      </mesh>

      {/* Ceiling light strips */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0, 8.8, -(i * 10) - 2]}>
          <boxGeometry args={[0.25, 0.05, 5]} />
          <meshStandardMaterial emissive="#FFFDE0" emissiveIntensity={2} color="#FFFDE0" />
        </mesh>
      ))}

      {/* FRAMES */}
      <Suspense fallback={<Loader />}>
        {FRAMES.map(f => (
          <WallFrame key={f.id} id={f.id} position={f.position} rotation={f.rotation} playerRef={playerRef} />
        ))}
      </Suspense>

      {/* PLAYER */}
      <Suspense fallback={null}>
        <Player ref={playerRef} position={[0, 0, -2]} />
      </Suspense>
    </Canvas>
  )
}

export default function Gallery() {
  return (
    <GalleryProvider>
      <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <GalleryScene />
        <div style={{
          position: "fixed", top: 28, left: 32, zIndex: 10,
          color: "rgba(255,255,255,0.35)", fontSize: "11px",
          letterSpacing: "0.22em", textTransform: "uppercase",
          fontFamily: "'Georgia', serif", lineHeight: 2, pointerEvents: "none",
        }}>
          <div>W A S D</div>
          <div style={{ fontSize: "10px", opacity: 0.6 }}>to move</div>
        </div>
        <FocusOverlay />
      </div>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { overflow: hidden; }`}</style>
    </GalleryProvider>
  )
}