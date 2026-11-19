import Link from "next/link"

import { Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { ServiceCard } from "@/components/service-card"
import { buttonVariants } from "@/components/ui/button"
import { API_URL } from "@/lib/api"
import type { Service } from "@/lib/types"

async function getFeaturedServices(): Promise<Service[]> {
  const res = await fetch(`${API_URL}/services/featured`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load services")
  return res.json()
}

export function FeaturedServicesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-96 animate-pulse rounded-2xl border bg-muted"
        />
      ))}
    </div>
  )
}

export async function FeaturedServices() {
  let services: Service[] = []
  let failed = false

  try {
    services = await getFeaturedServices()
  } catch {
    failed = true
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
      <SectionHeading
        title="Featured Wedding Services"
        subtitle="Hand-picked, approved services from vendors ready to make your day special."
      />

      {failed ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          We couldn&apos;t load services right now. Please try again shortly.
        </p>
      ) : services.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No services are available yet. Check back soon.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service._id} delay={(index % 3) * 0.1}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-10",
              })}
            >
              View All Services
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
