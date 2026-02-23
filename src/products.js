const products = [
  {
    id: 1,
    name: "Designer Seating",
    variants: [
      {
        name: "Lounge Series",
        model: "/models/chair/chair.glb",
        scale: [3, 3, 3],
        offset: -1.5,
        rotation: [0, 0, 0],
        text: "REPOSE",
        description: "The classic lounge silhouette in premium Nappa Leather.",
        accent: "#C8A040",
        colors: [
          { name: "Nappa Tan", hex: "#d4a76a", bg: "#f5f1eb", textColor: "#8b6a40" },
          { name: "Onyx Black", hex: "#1a1a1a", bg: "#e5e5e5", textColor: "#333333" },
          { name: "Slate Grey", hex: "#7a7a7a", bg: "#d1d1d1", textColor: "#444444" }
        ],
        specs: [
          { label: "Width", value: "86 cm" },
          { label: "Depth", value: "92 cm" },
          { label: "Height", value: "78 cm" },
          { label: "Seat Height", value: "42 cm" },
          { label: "Weight", value: "18 kg" },
          { label: "Material", value: "Nappa Leather" },
          { label: "Frame", value: "Solid Walnut" },
          { label: "Filling", value: "High-Density Foam" },
          { label: "Origin", value: "Italy" },
          { label: "Warranty", value: "5 Years" }
        ]
      },
      {
        name: "Executive Flow",
        model: "/models/chair/high-poly_pbr_office_chair.glb",
        scale: [0.04, 0.04, 0.04],
        offset: -1.5,
        rotation: [0, Math.PI, 0],
        text: "STRIDE",
        description: "High-level ergonomics meet brutalist geometry for the modern office.",
        accent: "#4ade80",
        colors: [
          { name: "Pitch Black", hex: "#121212", bg: "#1a1a1b", textColor: "#444444" },
          { name: "Steel Blue", hex: "#2c3e50", bg: "#ebf2f6", textColor: "#2c3e50" },
          { name: "Cool Silver", hex: "#bdc3c7", bg: "#f7f9f9", textColor: "#7f8c8d" }
        ],
        specs: [
          { label: "Width", value: "68 cm" },
          { label: "Depth", value: "70 cm" },
          { label: "Height", value: "110–122 cm" },
          { label: "Seat Height", value: "46–58 cm" },
          { label: "Weight", value: "24 kg" },
          { label: "Material", value: "Mesh & PU Leather" },
          { label: "Base", value: "Aluminium 5-Star" },
          { label: "Mechanism", value: "Synchro-Tilt" },
          { label: "Armrests", value: "4D Adjustable" },
          { label: "Warranty", value: "10 Years" }
        ]
      },
      {
        name: "Concept Alpha",
        model: "/models/chair/chair (2).glb",
        scale: [1.5, 1.5, 1.5],
        offset: -1.5,
        rotation: [0, Math.PI / 2, 0],
        text: "AURORA",
        description: "Experimental organic curves crafted for natural comfort.",
        accent: "#34d399",
        colors: [
          { name: "Forest", hex: "#1a3d2f", bg: "#0a1a15", textColor: "#1e4d3b" },
          { name: "Sunset", hex: "#b33939", bg: "#f7e1e1", textColor: "#822727" },
          { name: "Imperial", hex: "#474787", bg: "#e1e1f7", textColor: "#2c2c54" }
        ],
        specs: [
          { label: "Width", value: "74 cm" },
          { label: "Depth", value: "80 cm" },
          { label: "Height", value: "82 cm" },
          { label: "Seat Height", value: "44 cm" },
          { label: "Weight", value: "14 kg" },
          { label: "Material", value: "Moulded Fibreglass" },
          { label: "Base", value: "Brushed Brass" },
          { label: "Filling", value: "Latex Cushion" },
          { label: "Edition", value: "Limited — 200 pcs" },
          { label: "Warranty", value: "3 Years" }
        ]
      }
    ]
  }
]

export default products