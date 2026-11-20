import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/session"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireRole("admin")

  return (
    <DashboardShell role="admin" user={user}>
      {children}
    </DashboardShell>
  )
}
