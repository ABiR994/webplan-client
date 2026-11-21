import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getDashboardPath, type Role } from "@/lib/routes"

export async function getSession() {
  const requestHeaders = await headers()

  try {
    return await auth.api.getSession({ headers: requestHeaders })
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return auth.api.getSession({ headers: requestHeaders })
  }
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
