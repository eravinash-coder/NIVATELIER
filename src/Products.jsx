import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import products from "./products"
import ChairExperience from "./components/ChairExperience"
import gsap from "gsap"

export default function Products() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [variantIndex, setVariantIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)
  const [uiVisible, setUiVisible] = useState(false)
  const product = products.find(p => p.id === Number(id))
  const uiRefs = useRef([])

  const tourTimeline = useRef(null)
  const lastActivity = useRef(Date.now())
  const inactivityCheck = useRef(null)

  // Track User Activity and Manage Autoplay Resume
  useEffect(() => {
    const handleActivity = () => {
      lastActivity.current = Date.now()
      if (tourTimeline.current) {
        tourTimeline.current.kill()
        tourTimeline.current = null
      }
    }

    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("mousedown", handleActivity)
    window.addEventListener("keydown", handleActivity)

    inactivityCheck.current = setInterval(() => {
      const idleTime = Date.now() - lastActivity.current
      if (idleTime > 5000 && !tourTimeline.current && uiVisible) {
        startGalleryTour(variantIndex, colorIndex)
      }
    }, 1000)

    return () => {
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("mousedown", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      if (inactivityCheck.current) clearInterval(inactivityCheck.current)
      if (tourTimeline.current) tourTimeline.current.kill()
    }
  }, [uiVisible, variantIndex, colorIndex])

  // Reset color to first when model changes manually
  useEffect(() => {
    if (tourTimeline.current) return
    setColorIndex(0)
  }, [variantIndex])

  const startGalleryTour = (startV = 0, startC = 0) => {
    if (tourTimeline.current) tourTimeline.current.kill()

    tourTimeline.current = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(2, () => {
          if (!tourTimeline.current) startGalleryTour(0, -1)
        })
      }
    })

    const modelPause = 1.6
    const colorPause = 1.0

    product.variants.forEach((v, vIdx) => {
      if (vIdx < startV) return

      v.colors.forEach((c, cIdx) => {
        if (vIdx === startV && cIdx <= startC) return

        const isNewModel = cIdx === 0

        tourTimeline.current.call(() => {
          setVariantIndex(vIdx)
          setColorIndex(cIdx)
        })
          .to({}, { duration: isNewModel ? modelPause : colorPause })
      })
    })
  }

  if (!product) return <div style={{ color: "#000", padding: 40 }}>Product not found</div>

  const currentVariant = product.variants[variantIndex]
  const currentColor = currentVariant.colors[colorIndex]

  const handleArrival = () => {
    setUiVisible(true)
    gsap.fromTo(uiRefs.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        onComplete: startGalleryTour
      }
    )
  }

  return (
    <div style={{
      width: "100vw", height: "100vh", position: "relative", overflow: "hidden",
      backgroundColor: currentColor.bg,
      transition: "background-color 1.2s ease",
      color: "#000", fontFamily: "'Inter', sans-serif"
    }}>
      {/* TEXTURE OVERLAY */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/concrete-wall.png')",
        opacity: 0.05, pointerEvents: "none", zIndex: 1
      }} />

      {/* 3D SCENE */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2 }}>
        <Canvas shadows dpr={[1, 2]}>
          <ChairExperience
            product={product}
            variantIndex={variantIndex}
            colorIndex={colorIndex}
            onArrival={handleArrival}
          />
        </Canvas>
      </div>

      {/* OVERLAY UI */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>

        {/* TOP NAVBAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "all" }}>
          <button
            onClick={() => navigate("/")}
            ref={el => uiRefs.current[0] = el}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, letterSpacing: "0.2em", display: "flex", alignItems: "center", gap: "10px", opacity: 0 }}
          >
            ← BACK TO MUSEUM
          </button>

          <div
            ref={el => uiRefs.current[1] = el}
            style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "0.5em", opacity: 0 }}
          >
            NIV ATELIER
          </div>

          <div style={{ display: "flex", gap: "40px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>COLLECTION</span>
            <span style={{ fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>ABOUT</span>
          </div>
        </div>

        {/* BOTTOM UI */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "all" }}>
          <div style={{ maxWidth: "400px" }}>
            <div
              ref={el => uiRefs.current[2] = el}
              style={{ fontSize: "12px", letterSpacing: "0.3em", marginBottom: "10px", opacity: 0 }}
            >
              SERIES / {currentVariant.name.toUpperCase()}
            </div>
            <h1
              ref={el => uiRefs.current[3] = el}
              style={{ fontSize: "48px", fontWeight: 300, marginBottom: "10px", opacity: 0, textTransform: "uppercase" }}
            >
              {currentVariant.name}
            </h1>
            <p style={{ color: "rgba(0,0,0,0.6)", fontSize: "14px", maxWidth: "340px", marginBottom: "30px", lineHeight: 1.6 }}>
              {currentVariant.description}
            </p>

            {/* MODEL SLIDER INDICATORS */}
            <div
              ref={el => uiRefs.current[4] = el}
              style={{ display: "flex", gap: "20px", marginBottom: "25px", opacity: 0 }}
            >
              {product.variants.map((v, i) => (
                <div
                  key={i}
                  onClick={() => setVariantIndex(i)}
                  style={{
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: "8px"
                  }}
                >
                  <div style={{
                    width: "60px", height: "4px",
                    backgroundColor: variantIndex === i ? "#000" : "rgba(0,0,0,0.1)",
                    transition: "all 0.3s"
                  }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em" }}>0{i + 1}</span>
                </div>
              ))}
            </div>

            {/* COLOR SWITCHER - BELLOW MODEL SWITCHING */}
            <div
              ref={el => uiRefs.current[7] = el}
              style={{ display: "flex", gap: "10px", opacity: 0 }}
            >
              {currentVariant.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setColorIndex(i)}
                  style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    backgroundColor: c.hex, border: colorIndex === i ? "1.5px solid #000" : "1.5px solid transparent",
                    cursor: "pointer", transition: "transform 0.3s",
                    transform: colorIndex === i ? "scale(1.15)" : "scale(1)",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              ref={el => uiRefs.current[5] = el}
              style={{ fontSize: "32px", fontWeight: 500, marginBottom: "20px", opacity: 0 }}
            >
              {["$2,450", "$2,850", "$4,200"][variantIndex]}
            </div>
            <button
              ref={el => uiRefs.current[6] = el}
              style={{
                backgroundColor: "#000", color: "#fff", border: "none",
                padding: "20px 50px", fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.3em", cursor: "pointer", opacity: 0,
                transition: "transform 0.3s"
              }}
              onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)" }}
              onMouseLeave={(e) => { e.target.style.transform = "scale(1)" }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
