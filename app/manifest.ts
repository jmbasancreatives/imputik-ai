import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IMPUTIK AI — VA Career Coach",
    short_name: "IMPUTIK AI",
    description: "A free, open-source AI career coach for aspiring virtual assistants.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e8",
    theme_color: "#123f3a",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
