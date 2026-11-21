import { Suspense } from "react"

import { PaymentStatus } from "@/components/payment-status"

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentStatus />
    </Suspense>
  )
}
