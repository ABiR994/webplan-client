"use client"

import * as React from "react"
import { Check, Crown, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api-client"
import { PLANS } from "@/lib/plans"
import { cn } from "@/lib/utils"

type Subscription = {
  plan: "free" | "premium"
  expiresAt: string | null
  canManage: boolean
}

type State = { attempt: number; data?: Subscription; error?: string }

export function SubscriptionPlans() {
  const [attempt, setAttempt] = React.useState(0)
  const [state, setState] = React.useState<State | null>(null)
  const [redirecting, setRedirecting] = React.useState(false)

  React.useEffect(() => {
    let active = true

    apiFetch<Subscription>("/payments/subscription")
      .then((data) => active && setState({ attempt, data }))
      .catch(
        (error: Error) => active && setState({ attempt, error: error.message })
      )

    return () => {
      active = false
    }
  }, [attempt])

  const loading = state?.attempt !== attempt
  const subscription = state?.data

  async function redirectTo(path: string) {
    setRedirecting(true)
    try {
      const { url } = await apiFetch<{ url: string }>(path, { method: "POST" })
      window.location.href = url
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
      setRedirecting(false)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Subscription</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose the plan that fits your business.
      </p>

      {loading ? (
        <div className="mt-6 grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl border bg-muted" />
          <div className="h-80 animate-pulse rounded-2xl border bg-muted" />
        </div>
      ) : state?.error || !subscription ? (
        <div className="mt-6 rounded-2xl border border-dashed bg-white p-10 text-center">
          <p className="text-muted-foreground">{state?.error}</p>
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
        <div className="mt-6 grid max-w-3xl gap-6 sm:grid-cols-2">
          {(["free", "premium"] as const).map((key) => {
            const plan = PLANS[key]
            const isCurrent = subscription.plan === key

            return (
              <div
                key={key}
                className={cn(
                  "flex flex-col rounded-2xl border bg-white p-6",
                  isCurrent && "border-primary ring-1 ring-primary"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-heading text-xl font-semibold">
                    {key === "premium" ? (
                      <Crown aria-hidden className="size-5 text-primary" />
                    ) : null}
                    {plan.name}
                  </h3>
                  {isCurrent ? (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                      Current plan
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 font-heading text-3xl font-semibold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / month
                  </span>
                </p>

                <ul className="mt-5 flex flex-1 flex-col gap-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-primary"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {key === "premium" ? (
                  subscription.plan === "premium" ? (
                    <div className="mt-6 flex flex-col gap-3">
                      {subscription.expiresAt ? (
                        <p className="text-xs text-muted-foreground">
                          Active until{" "}
                          {new Date(subscription.expiresAt).toLocaleDateString(
                            "en-US",
                            { dateStyle: "medium" }
                          )}
                        </p>
                      ) : null}
                      {subscription.canManage ? (
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-10"
                          disabled={redirecting}
                          onClick={() => redirectTo("/payments/portal-session")}
                        >
                          {redirecting ? (
                            <Loader2 aria-hidden className="animate-spin" />
                          ) : null}
                          Manage Subscription
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="mt-6 h-10"
                      disabled={redirecting}
                      onClick={() =>
                        redirectTo("/payments/create-checkout-session")
                      }
                    >
                      {redirecting ? (
                        <Loader2 aria-hidden className="animate-spin" />
                      ) : null}
                      Upgrade to Premium
                    </Button>
                  )
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
