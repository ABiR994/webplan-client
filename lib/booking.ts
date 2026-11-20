import type { BookingStatus } from "@/lib/types"

export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-muted text-muted-foreground",
}

export const BOOKING_FILTERS: ("all" | BookingStatus)[] = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "cancelled",
]

export const formatBookingDate = (value: string) =>
  new Date(
    value.length === 10 ? `${value}T00:00:00` : value
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
