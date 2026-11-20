import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getDashboardPath, type Role } from "@/lib/routes"

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireRole(role: Role) {
  const session = await getSession()
  if (!session) redirect("/sign-in")
  if (session.user.role !== role) {
    redirect(getDashboardPath(session.user.role))
  }

  const { id, name, email, image, isBlocked } = session.user
  return { id, name, email, image, role, isBlocked }
}
