import type { Metadata } from "next"
import { Geist, Playfair_Display } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: { default: "WedPlan", template: "%s | WedPlan" },
  description: "Discover wedding services and book trusted vendors.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        geist.variable,
        playfair.variable
      )}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
