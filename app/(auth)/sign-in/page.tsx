"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { getDashboardPath } from "@/lib/routes"

export default function SignInPage() {
  const router = useRouter()

  async function handleSignIn(data: AuthFormData) {
    const { data: result, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    })

    if (error) {
      toast.error(error.message || "Invalid email or password")
      return
    }

    toast.success("Signed in successfully")
    router.push(getDashboardPath(result?.user.role))
    router.refresh()
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
    if (error) toast.error(error.message || "Google sign in failed")
  }

  return (
    <AuthForm mode="signin" onSubmit={handleSignIn} onGoogle={handleGoogle} />
  )
}
