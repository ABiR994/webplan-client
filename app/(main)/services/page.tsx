import type { Metadata } from "next"
import { Suspense } from "react"

import { ServiceBrowser } from "@/components/services/service-browser"

export const metadata: Metadata = { title: "Browse Services" }

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
            Browse Wedding Services
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Search and filter approved services from trusted vendors to find the
            perfect match for your wedding.
          </p>
        </div>
      </section>
      <Suspense>
        <ServiceBrowser />
      </Suspense>
    </main>
  )
}
