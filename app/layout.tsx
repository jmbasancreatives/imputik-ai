import type { Metadata, Viewport } from "next"
import { Manrope, Space_Mono } from "next/font/google"
import "./globals.css"

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" })

export const metadata: Metadata = {
  title: "IMPUTIK AI — Free VA Career Coach",
  description: "A free, open-source, 20-day virtual assistant career program with private BYOK AI coaching.",
  applicationName: "IMPUTIK AI",
  generator: "v0.app",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "IMPUTIK AI" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
}

export const viewport: Viewport = {
  themeColor: "#123f3a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`bg-background ${sans.variable} ${mono.variable}`}><body className="font-sans antialiased">{children}</body></html>
}
