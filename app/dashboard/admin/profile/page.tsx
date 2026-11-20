import { redirect } from "next/navigation"

import { ProfileForm } from "@/components/dashboard/profile-form"
import { getSession } from "@/lib/session"

export default async function AdminProfilePage() {
  const session = await getSession()
  if (!session) redirect("/sign-in")

  const { name, email, image, role, businessName } = session.user

  return <ProfileForm user={{ name, email, image, role, businessName }} />
}
