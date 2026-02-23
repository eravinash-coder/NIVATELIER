// import { Routes, Route } from "react-router-dom"
// import Gallery from "./Gallery"
// import Product from "./Product"

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Gallery />} />
//       <Route path="/product/:id" element={<Product />} />
//     </Routes>
//   )
// }
import { Routes, Route } from "react-router-dom"
import Gallery from "./Gallery"
import Products from "./Products.jsx"   

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/product/:id" element={<Products />} />
    </Routes>
  )
}