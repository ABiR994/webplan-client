import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/session"

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireRole("customer")

  return (
    <DashboardShell role="customer" user={user}>
      {children}
    </DashboardShell>
  )
}
