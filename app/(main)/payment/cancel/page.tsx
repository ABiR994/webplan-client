import Link from "next/link"
import { CircleX } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export default function PaymentCancelPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="flex max-w-md flex-col items-center text-center">
        <CircleX aria-hidden className="size-12 text-destructive" />
        <h1 className="mt-4 font-heading text-2xl font-semibold">
          Payment cancelled
        </h1>
        <p className="mt-2 text-muted-foreground">
          No charge was made. You can upgrade to Premium whenever you are ready.
        </p>
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ size: "lg", className: "mt-6 h-10" })}
        >
          Back to Subscription
        </Link>
      </div>
    </main>
  )
}
