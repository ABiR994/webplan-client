"use client"

import * as React from "react"
import Image from "next/image"
import { CalendarDays, ImageOff, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiFetch } from "@/lib/api-client"
import type { BookingStatus, VendorBooking } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-muted text-muted-foreground",
}

const FILTERS: ("all" | BookingStatus)[] = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "cancelled",
]

const formatDate = (value: string, withYear = true) =>
  new Date(
    value.length === 10 ? `${value}T00:00:00` : value
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
  })

type State = { attempt: number; error?: string }

export function BookingRequests() {
  const [attempt, setAttempt] = React.useState(0)
  const [state, setState] = React.useState<State | null>(null)
  const [bookings, setBookings] = React.useState<VendorBooking[]>([])
  const [filter, setFilter] = React.useState<"all" | BookingStatus>("all")
  const [pending, setPending] = React.useState<{
    booking: VendorBooking
    status: "accepted" | "rejected"
  } | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    let active = true

    apiFetch<VendorBooking[]>("/vendor/bookings")
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

  async function confirmAction() {
    if (!pending) return
    const { booking, status } = pending

    setSaving(true)
    try {
      await apiFetch(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: { status },
      })
      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id ? { ...item, status } : item
        )
      )
      toast.success(`Booking request ${status}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update request"
      )
      setAttempt((value) => value + 1)
    } finally {
      setSaving(false)
      setPending(null)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Booking Requests</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Review requests from customers and accept or reject pending ones.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
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
              className="h-40 animate-pulse rounded-2xl border bg-muted"
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
              No booking requests
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "all"
                ? "Requests from customers will appear here."
                : `You have no ${filter} requests.`}
            </p>
          </div>
        ) : (
          visible.map((booking) => {
            const customerName = booking.customer?.name ?? "Deleted customer"

            return (
              <article
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={booking.customer?.image} alt="" />
                      <AvatarFallback>
                        {customerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{customerName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {booking.customer?.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      STATUS_STYLES[booking.status]
                    )}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {booking.service?.images?.[0] ? (
                      <Image
                        src={booking.service.images[0]}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageOff aria-hidden className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {booking.service?.serviceName ?? "Service removed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.service?.category}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <CalendarDays
                      aria-hidden
                      className="size-4 shrink-0 text-primary"
                    />
                    {formatDate(booking.eventDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin
                      aria-hidden
                      className="size-4 shrink-0 text-primary"
                    />
                    {booking.eventLocation}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  {booking.message || "No message from the customer."}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatDate(booking.createdAt)}
                  </p>
                  {booking.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-9 text-destructive hover:text-destructive"
                        onClick={() =>
                          setPending({ booking, status: "rejected" })
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        className="h-9"
                        onClick={() =>
                          setPending({ booking, status: "accepted" })
                        }
                      >
                        Accept
                      </Button>
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })
        )}
      </div>

      <Dialog
        open={!!pending}
        onOpenChange={(open) => !open && !saving && setPending(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>
            {pending?.status === "accepted" ? "Accept" : "Reject"} this request?
          </DialogTitle>
          <DialogDescription>
            {pending?.booking.customer?.name}&apos;s request for{" "}
            {pending?.booking.service?.serviceName} will be marked as{" "}
            {pending?.status}. This cannot be changed afterwards.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              disabled={saving}
              onClick={() => setPending(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                pending?.status === "rejected" ? "destructive" : "default"
              }
              className="h-9"
              disabled={saving}
              onClick={confirmAction}
            >
              {saving ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {pending?.status === "accepted" ? "Accept" : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
