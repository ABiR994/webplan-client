import Link from "next/link"
import { ArrowLeft, BadgeCheck, MapPin, SearchX } from "lucide-react"

import { BookingPanel } from "@/components/services/booking-panel"
import { ServiceGallery } from "@/components/services/service-gallery"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { API_URL } from "@/lib/api"
import type { ServiceDetails } from "@/lib/types"

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

async function getService(id: string) {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, { cache: "no-store" })
    if (res.ok) return { service: (await res.json()) as ServiceDetails }

    const body = await res.json().catch(() => null)
    return {
      error: body?.message ?? "We couldn't load this service.",
    }
  } catch {
    return { error: "We couldn't reach the server. Please try again shortly." }
  }
}

function ServiceError({ message }: { message: string }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <SearchX aria-hidden className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 font-heading text-2xl font-semibold">
          Service unavailable
        </h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <Link
          href="/services"
          className={buttonVariants({ size: "lg", className: "mt-6 h-10" })}
        >
          Browse Services
        </Link>
      </div>
    </main>
  )
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { service, error } = await getService(id)

  if (!service) return <ServiceError message={error as string} />

  const vendorName = service.vendor?.businessName || service.vendor?.name

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/services"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to services
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <ServiceGallery images={service.images} name={service.serviceName} />

          <section>
            <h2 className="font-heading text-xl font-semibold">
              About this service
            </h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">
              {service.description}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5 rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {service.category}
              </span>
              <h1 className="mt-3 font-heading text-2xl font-semibold">
                {service.serviceName}
              </h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin aria-hidden className="size-4" />
                {service.location}
              </p>
            </div>

            <p className="font-heading text-3xl font-semibold text-primary">
              {priceFormat.format(service.price)}
            </p>

            {vendorName ? (
              <div className="flex items-center gap-3 border-t pt-5">
                <Avatar className="size-11">
                  <AvatarImage src={service.vendor?.image} alt={vendorName} />
                  <AvatarFallback>
                    {vendorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-sm font-medium">
                    <span className="truncate">{vendorName}</span>
                    {service.vendor?.subscriptionPlan === "premium" ? (
                      <BadgeCheck
                        aria-label="Premium vendor"
                        className="size-4 shrink-0 text-primary"
                      />
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">Vendor</p>
                </div>
              </div>
            ) : null}

            <BookingPanel
              serviceId={service._id}
              serviceName={service.serviceName}
              vendorId={service.vendorId}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}
