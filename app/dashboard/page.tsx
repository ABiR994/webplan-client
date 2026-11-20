import { redirect } from "next/navigation"

import { getDashboardPath } from "@/lib/routes"
import { getSession } from "@/lib/session"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/sign-in")

  redirect(getDashboardPath(session.user.role))
}
