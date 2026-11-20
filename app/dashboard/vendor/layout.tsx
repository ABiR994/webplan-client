import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/session"

export default async function VendorLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireRole("vendor")

  return (
    <DashboardShell role="vendor" user={user}>
      {children}
    </DashboardShell>
  )
}
