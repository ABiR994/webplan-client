import type { ReactNode } from "react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
