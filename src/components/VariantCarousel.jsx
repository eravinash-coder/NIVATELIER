import { useRef } from "react"
import { useGLTF } from "@react-three/drei"

export default function VariantCarousel({ product }) {
  const { scene } = useGLTF(product.model)

  return (
    <group>
      <primitive object={scene} />
      {/* If there were multiple variants, we would map them here */}
    </group>
  )
}