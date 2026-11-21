"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiFetch } from "@/lib/api-client"
import type { AdminUserDetails } from "@/lib/types"

type State = { id: string; user?: AdminUserDetails; error?: string }

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" })

export function UserDetailsDialog({
  userId,
  onClose,
}: {
  userId: string | null
  onClose: () => void
}) {
  const [state, setState] = React.useState<State | null>(null)

  React.useEffect(() => {
    if (!userId) return
    let active = true

    apiFetch<AdminUserDetails>(`/admin/users/${userId}`)
      .then((user) => active && setState({ id: userId, user }))
      .catch(
        (error: Error) =>
          active && setState({ id: userId, error: error.message })
      )

    return () => {
      active = false
    }
  }, [userId])

  const loading = !state || state.id !== userId
  const user = loading ? undefined : state?.user

  const rows: [string, React.ReactNode][] = user
    ? [
        [
          "Role",
          <span key="r" className="capitalize">
            {user.role}
          </span>,
        ],
        ["Status", user.isBlocked ? "Blocked" : "Active"],
        ["Joined", formatDate(user.createdAt)],
        ...(user.role === "vendor"
          ? ([
              ["Business name", user.businessName || "Not set"],
              [
                "Subscription",
                <span key="s" className="capitalize">
                  {user.subscriptionPlan ?? "free"}
                  {user.subscriptionExpiresAt
                    ? ` (until ${formatDate(user.subscriptionExpiresAt)})`
                    : ""}
                </span>,
              ],
              ["Total services", user.stats.totalServices ?? 0],
              [
                "Booking requests received",
                user.stats.totalBookingRequests ?? 0,
              ],
            ] as [string, React.ReactNode][])
          : []),
        ...(user.role === "customer"
          ? ([["Total bookings", user.stats.totalBookings ?? 0]] as [
              string,
              React.ReactNode,
            ][])
          : []),
      ]
    : []

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle>User details</DialogTitle>
        <DialogDescription>Account information and activity.</DialogDescription>

        {loading ? (
          <div className="mt-5 h-48 animate-pulse rounded-xl bg-muted" />
        ) : user ? (
          <div className="mt-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarImage src={user.image} alt="" />
                <AvatarFallback className="text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="mt-5 text-sm text-destructive">{state?.error}</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
