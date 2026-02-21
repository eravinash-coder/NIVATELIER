import { useContext } from "react"
import { GalleryContext } from "./GalleryContext"

export function useGallery() {
  return useContext(GalleryContext)
}