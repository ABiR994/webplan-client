"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { getDashboardPath } from "@/lib/routes"
import { uploadImage } from "@/lib/upload"

export default function SignUpPage() {
  const router = useRouter()

  async function handleSignUp(data: AuthFormData) {
    let image: string | undefined
    if (data.image) {
      try {
        image = await uploadImage(data.image)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Image upload failed"
        )
        return
      }
    }

    const { data: result, error } = await authClient.signUp.email({
      name: data.name as string,
      email: data.email,
      password: data.password,
      role: data.role,
      image,
    })

    if (error) {
      toast.error(error.message || "Sign up failed. Please try again.")
      return
    }

    toast.success("Account created successfully")
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
    <AuthForm mode="signup" onSubmit={handleSignUp} onGoogle={handleGoogle} />
  )
}
