"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api-client"
import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

type State = { attempt: number; data?: Transaction[]; error?: string }

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
}

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)

export function Transactions() {
  const [attempt, setAttempt] = React.useState(0)
  const [state, setState] = React.useState<State | null>(null)

  React.useEffect(() => {
    let active = true

    apiFetch<Transaction[]>("/admin/transactions")
      .then((data) => active && setState({ attempt, data }))
      .catch(
        (error: Error) => active && setState({ attempt, error: error.message })
      )

    return () => {
      active = false
    }
  }, [attempt])

  const loading = state?.attempt !== attempt
  const transactions = state?.data ?? []

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Transactions</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Subscription payments verified through Stripe. Records are read-only.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : state?.error ? (
          <div className="p-10 text-center">
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
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-heading text-lg font-semibold">
              No transactions yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Payments will appear here when vendors upgrade to Premium.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b bg-secondary/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => {
                const name =
                  transaction.vendor?.businessName ||
                  transaction.vendor?.name ||
                  "Deleted vendor"

                return (
                  <tr key={transaction._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={transaction.vendor?.image} alt="" />
                          <AvatarFallback>
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {transaction.vendor?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{transaction.plan}</td>
                    <td className="px-4 py-3 font-medium">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium capitalize",
                          STATUS_STYLES[transaction.status] ??
                            "bg-amber-100 text-amber-800"
                        )}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-US",
                        { dateStyle: "medium" }
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
