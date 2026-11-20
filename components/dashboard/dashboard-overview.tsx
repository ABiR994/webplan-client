"use client"

import * as React from "react"
import {
  Clock,
  CircleCheck,
  CircleX,
  ClipboardList,
  Crown,
  Package,
  ShieldCheck,
  Store,
  Receipt,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"

import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api-client"
import type { Role } from "@/lib/routes"

type Stat = { key: string; label: string; icon: LucideIcon }

const STATS: Record<Role, Stat[]> = {
  vendor: [
    { key: "totalServices", label: "Total Services", icon: Package },
    { key: "activeServices", label: "Active Services", icon: CircleCheck },
    { key: "pendingRequests", label: "Pending Booking Requests", icon: Clock },
    {
      key: "acceptedBookings",
      label: "Accepted Bookings",
      icon: ClipboardList,
    },
    { key: "plan", label: "Current Subscription Plan", icon: Crown },
  ],
  customer: [
    {
      key: "totalBookings",
      label: "Total Booking Requests",
      icon: ClipboardList,
    },
    { key: "pending", label: "Pending Bookings", icon: Clock },
    { key: "accepted", label: "Accepted Bookings", icon: CircleCheck },
    { key: "rejected", label: "Rejected Bookings", icon: CircleX },
  ],
  admin: [
    { key: "totalUsers", label: "Total Registered Users", icon: Users },
    { key: "totalVendors", label: "Total Vendors", icon: Store },
    { key: "totalCustomers", label: "Total Customers", icon: UserRound },
    { key: "totalServices", label: "Total Services", icon: Package },
    { key: "pendingServices", label: "Pending Services", icon: ShieldCheck },
    { key: "totalTransactions", label: "Total Transactions", icon: Receipt },
  ],
}

type State = {
  key: number
  data?: Record<string, string | number>
  error?: string
}

export function DashboardOverview({ role }: { role: Role }) {
  const [attempt, setAttempt] = React.useState(0)
  const [state, setState] = React.useState<State | null>(null)

  React.useEffect(() => {
    let active = true

    apiFetch<Record<string, string | number>>("/overview")
      .then((data) => active && setState({ key: attempt, data }))
      .catch(
        (error: Error) =>
          active && setState({ key: attempt, error: error.message })
      )

    return () => {
      active = false
    }
  }, [attempt])

  const loading = state?.key !== attempt
  const stats = STATS[role]

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Overview</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A quick look at your activity on WedPlan.
      </p>

      {state?.error && !loading ? (
        <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center">
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
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? stats.map(({ key }) => (
                <div
                  key={key}
                  className="h-24 animate-pulse rounded-2xl border bg-muted"
                />
              ))
            : stats.map(({ key, label, icon }) => {
                const value = state?.data?.[key] ?? 0
                return (
                  <StatCard
                    key={key}
                    label={label}
                    icon={icon}
                    value={
                      key === "plan"
                        ? String(value).charAt(0).toUpperCase() +
                          String(value).slice(1)
                        : value
                    }
                  />
                )
              })}
        </div>
      )}
    </div>
  )
}
