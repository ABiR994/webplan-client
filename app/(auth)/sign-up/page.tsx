"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { apiFetch } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"
import { getDashboardPath, getRedirectParam } from "@/lib/routes"
import { uploadImage } from "@/lib/upload"

export default function SignUpPage() {
  const router = useRouter()

  async function handleSignUp(data: AuthFormData) {
    const { data: result, error } = await authClient.signUp.email({
      name: data.name as string,
      email: data.email,
      password: data.password,
      role: data.role,
    })

    if (error) {
      toast.error(error.message || "Sign up failed. Please try again.")
      return
    }

    if (data.image) {
      try {
        const image = await uploadImage(data.image)
        await apiFetch("/profile", {
          method: "PATCH",
          body: { name: data.name, image },
        })
      } catch {
        toast.error(
          "Account created, but the profile image could not be uploaded. You can add it in Profile Settings."
        )
      }
    }

    toast.success("Account created successfully")
    router.push(getRedirectParam() ?? getDashboardPath(result?.user.role))
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: getRedirectParam() ?? "/dashboard",
    })
    if (error) toast.error(error.message || "Google sign in failed")
  }

  return (
    <AuthForm mode="signup" onSubmit={handleSignUp} onGoogle={handleGoogle} />
  )
}
