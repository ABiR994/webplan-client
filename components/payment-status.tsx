"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CircleCheck, CircleX, Loader2 } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { apiFetch } from "@/lib/api-client"

const MAX_ATTEMPTS = 15

type Status = "checking" | "paid" | "timeout" | "error"

export function PaymentStatus() {
  const sessionId = useSearchParams().get("session_id")
  const [status, setStatus] = React.useState<Status>(
    sessionId ? "checking" : "error"
  )

  React.useEffect(() => {
    if (!sessionId) return

    let active = true
    let attempts = 0
    let timer: ReturnType<typeof setTimeout>

    async function check() {
      try {
        const result = await apiFetch<{ status: "paid" | "pending" }>(
          `/payments/status?session_id=${encodeURIComponent(sessionId as string)}`
        )
        if (!active) return
        if (result.status === "paid") return setStatus("paid")
      } catch {
        if (active) return setStatus("error")
        return
      }

      attempts += 1
      if (attempts >= MAX_ATTEMPTS) return setStatus("timeout")
      timer = setTimeout(check, 2000)
    }

    check()

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [sessionId])

  const content = {
    checking: {
      icon: (
        <Loader2 aria-hidden className="size-12 animate-spin text-primary" />
      ),
      title: "Confirming your payment",
      text: "Please wait while we confirm your payment with Stripe.",
    },
    paid: {
      icon: <CircleCheck aria-hidden className="size-12 text-green-600" />,
      title: "Payment successful",
      text: "Your payment was verified and your Premium subscription is active.",
    },
    timeout: {
      icon: <Loader2 aria-hidden className="size-12 text-primary" />,
      title: "Still processing",
      text: "Your payment is taking longer than usual to confirm. Premium will activate automatically once it is verified. Check your subscription page in a minute.",
    },
    error: {
      icon: <CircleX aria-hidden className="size-12 text-destructive" />,
      title: "We couldn't confirm the payment",
      text: "Something went wrong while checking your payment. If you were charged, your Premium plan will still activate once Stripe confirms it.",
    },
  }[status]

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="flex max-w-md flex-col items-center text-center">
        {content.icon}
        <h1 className="mt-4 font-heading text-2xl font-semibold">
          {content.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{content.text}</p>
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ size: "lg", className: "mt-6 h-10" })}
        >
          Go to Subscription
        </Link>
      </div>
    </main>
  )
}
