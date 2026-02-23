import { createContext, useState } from "react"

export const GalleryContext = createContext(null)

export function GalleryProvider({ children }) {
  const [focusedFrame, setFocusedFrame] = useState(null)
  const focus   = (data) => setFocusedFrame(data)
  const unfocus = ()     => setFocusedFrame(null)

  return (
    <GalleryContext.Provider value={{ focusedFrame, focus, unfocus }}>
      {children}
    </GalleryContext.Provider>
  )
}