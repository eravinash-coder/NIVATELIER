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
  const [specsVisible, setSpecsVisible] = useState(true)
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

  // Reset color to first when model changes manually; cross-fade specs
  useEffect(() => {
    if (tourTimeline.current) return
    setColorIndex(0)
  }, [variantIndex])

  // Cross-fade specs panel when variant changes
  useEffect(() => {
    setSpecsVisible(false)
    const t = setTimeout(() => setSpecsVisible(true), 300)
    return () => clearTimeout(t)
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

          {/* LEFT COLUMN — series label, name, description */}
          <div style={{ maxWidth: "360px" }}>
            <div
              ref={el => uiRefs.current[2] = el}
              style={{ fontSize: "11px", letterSpacing: "0.32em", marginBottom: "10px", opacity: 0, textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}
            >
              Series / {currentVariant.name}
            </div>
            <h1
              ref={el => uiRefs.current[3] = el}
              style={{ fontSize: "44px", fontWeight: 300, marginBottom: "12px", opacity: 0, textTransform: "uppercase", lineHeight: 1.1 }}
            >
              {currentVariant.name}
            </h1>
            <p
              ref={el => uiRefs.current[4] = el}
              style={{ color: "rgba(0,0,0,0.55)", fontSize: "13px", maxWidth: "300px", lineHeight: 1.7, opacity: 0 }}
            >
              {currentVariant.description}
            </p>
          </div>

          {/* RIGHT COLUMN: specs panel (with colours inside) + price + cart */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "20px" }}>

            {/* SPECIFICATIONS PANEL */}
            <div
              ref={el => uiRefs.current[5] = el}
              style={{ opacity: 0, width: "240px" }}
            >
              <div style={{
                backdropFilter: "blur(16px) saturate(1.5)",
                WebkitBackdropFilter: "blur(16px) saturate(1.5)",
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "4px",
                padding: "22px 22px 18px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
              }}>

                {/* Panel heading */}
                <div style={{
                  fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase",
                  color: "rgba(0,0,0,0.38)", marginBottom: "12px", fontFamily: "'Georgia', serif",
                }}>
                  Specifications
                </div>

                {/* Spec rows */}
                <div style={{ opacity: specsVisible ? 1 : 0, transition: "opacity 0.35s ease" }}>
                  {(currentVariant.specs || []).map((spec, i) => (
                    <div key={i}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "baseline", padding: "6px 0", gap: "8px",
                      }}>
                        <span style={{
                          fontSize: "9.5px", letterSpacing: "0.07em",
                          color: "rgba(0,0,0,0.4)", textTransform: "uppercase", flexShrink: 0,
                        }}>
                          {spec.label}
                        </span>
                        <span style={{
                          fontSize: "10.5px", fontWeight: 600, letterSpacing: "0.03em",
                          color: "rgba(0,0,0,0.8)", textAlign: "right",
                        }}>
                          {spec.value}
                        </span>
                      </div>
                      {i < (currentVariant.specs.length - 1) && (
                        <div style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />
                      )}
                    </div>
                  ))}

                  {/* Divider before colour row */}
                  <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "4px 0" }} />

                  {/* COLOUR ROW inside specs */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "8px 0",
                  }}>
                    <span style={{
                      fontSize: "9.5px", letterSpacing: "0.07em",
                      color: "rgba(0,0,0,0.4)", textTransform: "uppercase",
                    }}>
                      Colour
                    </span>
                    <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                      {currentVariant.colors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setColorIndex(i)}
                          title={c.name}
                          style={{
                            width: colorIndex === i ? "20px" : "16px",
                            height: colorIndex === i ? "20px" : "16px",
                            borderRadius: "50%",
                            backgroundColor: c.hex,
                            border: colorIndex === i ? "2px solid rgba(0,0,0,0.7)" : "1.5px solid rgba(0,0,0,0.12)",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            flexShrink: 0,
                            pointerEvents: "all",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accent gradient line */}
                <div style={{
                  marginTop: "10px", height: "2px",
                  background: `linear-gradient(to right, ${currentColor.hex}, transparent)`,
                  transition: "background 1.2s ease", borderRadius: "1px",
                }} />
              </div>
            </div>

            {/* PRICE */}
            <div
              ref={el => uiRefs.current[6] = el}
              style={{ fontSize: "30px", fontWeight: 500, opacity: 0 }}
            >
              {["$2,450", "$2,850", "$4,200"][variantIndex]}
            </div>

            {/* ADD TO CART */}
            <button
              ref={el => uiRefs.current[7] = el}
              style={{
                backgroundColor: "#000", color: "#fff", border: "none",
                padding: "18px 48px", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.3em", cursor: "pointer", opacity: 0,
                transition: "transform 0.3s", pointerEvents: "all",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)" }}
              onMouseLeave={(e) => { e.target.style.transform = "scale(1)" }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* MODEL SWITCHER — centred at the bottom of the 3D canvas */}
      <div
        ref={el => uiRefs.current[8] = el}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 11,
          display: "flex",
          gap: "32px",
          alignItems: "flex-end",
          opacity: 0,
          pointerEvents: "all",
        }}
      >
        {product.variants.map((v, i) => (
          <button
            key={i}
            onClick={() => setVariantIndex(i)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              padding: 0,
            }}
          >
            {/* Active indicator bar */}
            <div style={{
              width: variantIndex === i ? "52px" : "36px",
              height: "3px",
              backgroundColor: variantIndex === i ? "#000" : "rgba(0,0,0,0.18)",
              borderRadius: "2px",
              transition: "all 0.35s ease",
            }} />
            {/* Variant number */}
            <span style={{
              fontSize: "10px", fontWeight: variantIndex === i ? 800 : 500,
              letterSpacing: "0.15em",
              color: variantIndex === i ? "#000" : "rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
            }}>
              0{i + 1}
            </span>
            {/* Variant name label */}
            <span style={{
              fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase",
              color: variantIndex === i ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.18)",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}>
              {v.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
