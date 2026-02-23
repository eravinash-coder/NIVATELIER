import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { useParams } from "react-router-dom"
import { interiorProducts } from "./products"
import ScrollScene from "./components/ScrollScene"

export default function ProductPage() {
  const { id } = useParams()
  const product = interiorProducts[id]

  const [bg, setBg] = useState(product.variants[0].bg)

  return (
    <div
      style={{
        height: "300vh",
        background: bg,
        transition: "background 0.6s ease"
      }}
    >
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          top: 0,
          left: 0
        }}
      >
        <Canvas shadows camera={{ position: [0, 1, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <ScrollScene
              product={product}
              setBackground={setBg}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}