"use client"

import Link from "next/link"
import { CalendarCheck } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

export function BookingPanel({
  serviceId,
  vendorId,
}: {
  serviceId: string
  vendorId: string
}) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <div className="h-11 animate-pulse rounded-lg bg-muted" />
  }

  if (!session) {
    return (
      <Link
        href={`/sign-in?redirect=/services/${serviceId}`}
        className={buttonVariants({ size: "lg", className: "h-11 w-full" })}
      >
        Sign In to Book
      </Link>
    )
  }

  const { role, isBlocked, id } = session.user

  if (isBlocked) {
    return (
      <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
        Your account is blocked, so you can&apos;t submit booking requests.
      </p>
    )
  }

  if (role === "customer") {
    return (
      <Button size="lg" className="h-11 w-full" disabled>
        <CalendarCheck aria-hidden />
        Request Booking
      </Button>
    )
  }

  const message =
    role === "vendor" && id === vendorId
      ? "This is your own service, so you can't book it."
      : role === "vendor"
        ? "Vendors can't submit booking requests. Use a customer account to book."
        : "Admins can't submit customer booking requests."

  return (
    <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
      {message}
    </p>
  )
}
