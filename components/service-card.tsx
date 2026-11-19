import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, MapPin } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import type { Service } from "@/lib/types"

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function ServiceCard({ service }: { service: Service }) {
  const vendorName = service.vendor?.businessName || service.vendor?.name

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {service.images[0] ? (
          <Image
            src={service.images[0]}
            alt={service.serviceName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 font-heading text-lg font-semibold">
          {service.serviceName}
        </h3>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-primary">
            {priceFormat.format(service.price)}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin aria-hidden className="size-4" />
            {service.location}
          </span>
        </div>

        {vendorName ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="size-6">
              <AvatarImage src={service.vendor?.image} alt={vendorName} />
              <AvatarFallback className="text-xs">
                {vendorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{vendorName}</span>
            {service.vendor?.subscriptionPlan === "premium" ? (
              <BadgeCheck
                aria-label="Premium vendor"
                className="size-4 shrink-0 text-primary"
              />
            ) : null}
          </div>
        ) : null}

        <Link
          href={`/services/${service._id}`}
          className={buttonVariants({ className: "mt-auto h-10 w-full" })}
        >
          View Details
        </Link>
      </div>
    </article>
  )
}
