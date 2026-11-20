"use client"

import { useRouter } from "next/navigation"

import { ServiceForm } from "@/components/dashboard/service-form"

export function AddServiceForm() {
  const router = useRouter()

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Add Service</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        New services are reviewed by an admin before customers can see them.
        Free plan vendors can keep up to 3 active services.
      </p>

      <div className="mt-6 max-w-3xl rounded-2xl border bg-white p-6">
        <ServiceForm
          onSaved={() => router.push("/dashboard/vendor/services")}
        />
      </div>
    </div>
  )
}
