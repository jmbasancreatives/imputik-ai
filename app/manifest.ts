import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IMPUTIK AI — VA Career Coach",
    short_name: "IMPUTIK AI",
    description: "A free, open-source AI career coach for aspiring virtual assistants.",
    start_url: "/app",
    display: "standalone",
    background_color: "#030817",
    theme_color: "#030817",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
