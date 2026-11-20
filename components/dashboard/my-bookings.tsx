"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Eye, ImageOff, Loader2, MapPin, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiFetch } from "@/lib/api-client"
import {
  BOOKING_FILTERS,
  BOOKING_STATUS_STYLES,
  formatBookingDate,
} from "@/lib/booking"
import type { BookingStatus, CustomerBooking } from "@/lib/types"
import { cn } from "@/lib/utils"

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const vendorName = (booking: CustomerBooking) =>
  booking.vendor?.businessName || booking.vendor?.name || "Vendor unavailable"

type State = { attempt: number; error?: string }

export function MyBookings() {
  const [attempt, setAttempt] = React.useState(0)
  const [state, setState] = React.useState<State | null>(null)
  const [bookings, setBookings] = React.useState<CustomerBooking[]>([])
  const [filter, setFilter] = React.useState<"all" | BookingStatus>("all")
  const [viewing, setViewing] = React.useState<CustomerBooking | null>(null)
  const [cancelling, setCancelling] = React.useState<CustomerBooking | null>(
    null
  )
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    let active = true

    apiFetch<CustomerBooking[]>("/customer/bookings")
      .then((data) => {
        if (!active) return
        setBookings(data)
        setState({ attempt })
      })
      .catch((error: Error) => {
        if (active) setState({ attempt, error: error.message })
      })

    return () => {
      active = false
    }
  }, [attempt])

  const loading = state?.attempt !== attempt
  const visible =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter)

  async function confirmCancel() {
    if (!cancelling) return

    setSaving(true)
    try {
      await apiFetch(`/bookings/${cancelling._id}/cancel`, { method: "PATCH" })
      setBookings((current) =>
        current.map((item) =>
          item._id === cancelling._id ? { ...item, status: "cancelled" } : item
        )
      )
      toast.success("Booking request cancelled")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking"
      )
      setAttempt((value) => value + 1)
    } finally {
      setSaving(false)
      setCancelling(null)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">My Bookings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Track your booking requests and cancel pending ones.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {BOOKING_FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === item
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-white hover:bg-secondary"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl border bg-muted"
            />
          ))
        ) : state?.error ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <p className="text-muted-foreground">{state.error}</p>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 h-10"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Try Again
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <p className="font-heading text-lg font-semibold">
              No bookings found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "all"
                ? "Browse services and send your first booking request."
                : `You have no ${filter} bookings.`}
            </p>
            {filter === "all" ? (
              <Link
                href="/services"
                className={buttonVariants({
                  size: "lg",
                  className: "mt-4 h-10",
                })}
              >
                Browse Services
              </Link>
            ) : null}
          </div>
        ) : (
          visible.map((booking) => (
            <article
              key={booking._id}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:w-36">
                {booking.service?.images?.[0] ? (
                  <Image
                    src={booking.service.images[0]}
                    alt={booking.service.serviceName}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff aria-hidden className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-lg font-semibold">
                      {booking.service?.serviceName ?? "Service removed"}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="size-5">
                        <AvatarImage src={booking.vendor?.image} alt="" />
                        <AvatarFallback className="text-[10px]">
                          {vendorName(booking).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{vendorName(booking)}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      BOOKING_STATUS_STYLES[booking.status]
                    )}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <CalendarDays
                      aria-hidden
                      className="size-4 shrink-0 text-primary"
                    />
                    {formatBookingDate(booking.eventDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin
                      aria-hidden
                      className="size-4 shrink-0 text-primary"
                    />
                    {booking.eventLocation}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatBookingDate(booking.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="h-9"
                      onClick={() => setViewing(booking)}
                    >
                      <Eye aria-hidden />
                      Details
                    </Button>
                    {booking.status === "pending" ? (
                      <Button
                        variant="outline"
                        className="h-9 text-destructive hover:text-destructive"
                        onClick={() => setCancelling(booking)}
                      >
                        <X aria-hidden />
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="max-w-lg">
          {viewing ? (
            <>
              <DialogTitle>Booking details</DialogTitle>
              <DialogDescription>
                {viewing.service?.serviceName ?? "Service removed"}
              </DialogDescription>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{viewing.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Vendor</dt>
                  <dd className="font-medium">{vendorName(viewing)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Event date</dt>
                  <dd className="font-medium">
                    {formatBookingDate(viewing.eventDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Event location</dt>
                  <dd className="font-medium">{viewing.eventLocation}</dd>
                </div>
                {viewing.service ? (
                  <>
                    <div>
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium">
                        {viewing.service.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Service price</dt>
                      <dd className="font-medium">
                        {priceFormat.format(viewing.service.price)}
                      </dd>
                    </div>
                  </>
                ) : null}
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Your message</dt>
                  <dd className="font-medium whitespace-pre-line">
                    {viewing.message || "No message"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Requested on</dt>
                  <dd className="font-medium">
                    {formatBookingDate(viewing.createdAt)}
                  </dd>
                </div>
              </dl>

              {viewing.service ? (
                <Link
                  href={`/services/${viewing.serviceId}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "mt-6 h-9",
                  })}
                >
                  View Service
                </Link>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!cancelling}
        onOpenChange={(open) => !open && !saving && setCancelling(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Cancel this booking request?</DialogTitle>
          <DialogDescription>
            Your request for {cancelling?.service?.serviceName} will be
            cancelled. This cannot be undone.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              disabled={saving}
              onClick={() => setCancelling(null)}
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={saving}
              onClick={confirmCancel}
            >
              {saving ? <Loader2 aria-hidden className="animate-spin" /> : null}
              Cancel Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
