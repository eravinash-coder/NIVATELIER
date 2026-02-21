// Player.jsx
import { forwardRef, useRef, useEffect, useImperativeHandle } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import { useGallery } from "./useGallery"

// Corridor bounds — player can't walk through walls
const BOUND_X = 7.2
const BOUND_Z_MIN = -115
const BOUND_Z_MAX = 0

const Player = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const group = useRef()
  useImperativeHandle(ref, () => group.current)

  const { camera } = useThree()
  const { scene: model, animations } = useGLTF("/models/player.glb")
  const { actions } = useAnimations(animations, group)
  const { focusedFrame } = useGallery()
  const keys = useRef({})
  const currentAction = useRef(null)
  const SPEED = 0.1

  useEffect(() => {
    if (!model) return
    model.scale.setScalar(1.5)
    model.traverse(child => {
      if (child.isMesh && child.material) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = child.material.clone()
        child.material.metalness = 0.0
        child.material.roughness = 0.8
        child.material.emissive = new THREE.Color(0x252525)
        child.material.emissiveIntensity = 0.5
        child.material.needsUpdate = true
      }
    })
  }, [model])

  useEffect(() => {
    const down = e => (keys.current[e.key.toLowerCase()] = true)
    const up   = e => (keys.current[e.key.toLowerCase()] = false)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up) }
  }, [])

  useEffect(() => {
    if (!actions) return
    const idle = actions["Idle"] || Object.values(actions)[0]
    if (idle) { idle.reset().fadeIn(0.3).play(); currentAction.current = idle }
  }, [actions])

  const playAction = (name, fallback = 0) => {
    const next = actions?.[name] || Object.values(actions || {})[fallback]
    if (!next || currentAction.current === next) return
    currentAction.current?.fadeOut(0.2)
    next.reset().fadeIn(0.2).play()
    currentAction.current = next
  }

  // Fixed camera offset — purely world space, never spins
  const CAM_TARGET = useRef(new THREE.Vector3())
  const CAM_LOOKAT = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!group.current) return

    if (focusedFrame) {
      playAction("Idle", 0)
      camera.position.lerp(focusedFrame.camPos, 0.05)
      camera.lookAt(focusedFrame.lookAt)
      return
    }

    const dir = new THREE.Vector3()
    if (keys.current["w"] || keys.current["arrowup"])    dir.z -= 1
    if (keys.current["s"] || keys.current["arrowdown"])  dir.z += 1
    if (keys.current["a"] || keys.current["arrowleft"])  dir.x -= 1
    if (keys.current["d"] || keys.current["arrowright"]) dir.x += 1

    if (dir.length() > 0) {
      dir.normalize()
      const next = group.current.position.clone().addScaledVector(dir, SPEED)
      // Clamp inside corridor walls
      next.x = THREE.MathUtils.clamp(next.x, -BOUND_X, BOUND_X)
      next.z = THREE.MathUtils.clamp(next.z, BOUND_Z_MIN, BOUND_Z_MAX)
      group.current.position.copy(next)
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, Math.atan2(dir.x, dir.z), 0.15
      )
      playAction("Walk", 1)
    } else {
      playAction("Idle", 0)
    }

    // Fixed world-space camera — just above and behind, never rotates
    const p = group.current.position
    CAM_TARGET.current.set(p.x * 0.3, p.y + 5, p.z + 8)
    CAM_LOOKAT.current.set(p.x, p.y + 1.5, p.z)

    camera.position.lerp(CAM_TARGET.current, 0.07)
    camera.lookAt(CAM_LOOKAT.current)
  })

  return (
    <group ref={group} position={position}>
      {model && <primitive object={model} />}
    </group>
  )
})

export default Player