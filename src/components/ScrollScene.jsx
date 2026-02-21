import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import VariantCarousel from "./VariantCarousel"

export default function ScrollScene({ product }) {

  const group = useRef()
  const gltf = useGLTF(product.model)

  // R3F handles basic cleanup of instances. 
  // Manual disposal of shared assets (gltf.scene) can lead to errors when re-navigating.

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.002
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <group ref={group}>
        <VariantCarousel product={product} />
      </group>
    </>
  )
}