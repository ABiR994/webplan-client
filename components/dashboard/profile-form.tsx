"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"
import type { Role } from "@/lib/routes"
import { uploadImage } from "@/lib/upload"

type ProfileUser = {
  name: string
  email: string
  image?: string | null
  role: Role
  businessName?: string | null
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()
  const [name, setName] = React.useState(user.name)
  const [businessName, setBusinessName] = React.useState(
    user.businessName ?? ""
  )
  const [file, setFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)

  const preview = React.useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  )

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const image = file ? await uploadImage(file) : undefined
      await apiFetch("/profile", {
        method: "PATCH",
        body: { name, image, businessName },
      })
      setFile(null)
      authClient.$store.notify("$sessionSignal")
      router.refresh()
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Profile Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update how you appear on WedPlan.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex max-w-xl flex-col gap-5 rounded-2xl border bg-white p-6"
      >
        <div className="flex items-center gap-4">
          <label
            htmlFor="image"
            className="group relative cursor-pointer rounded-full has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50"
          >
            <Avatar className="size-20">
              <AvatarImage src={preview ?? user.image ?? undefined} alt="" />
              <AvatarFallback className="text-2xl">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Camera aria-hidden className="size-4" />
            </span>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <div className="text-sm">
            <p className="font-medium">Profile image</p>
            <p className="text-xs text-muted-foreground">
              JPG or PNG, up to 5MB.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            maxLength={80}
          />
        </div>

        {user.role === "vendor" ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              maxLength={100}
              placeholder="Shown on your services"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled readOnly />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Account role</Label>
          <Input
            id="role"
            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            disabled
            readOnly
          />
        </div>

        <Button type="submit" size="lg" className="h-10" disabled={loading}>
          {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
          Save Changes
        </Button>
      </form>
    </div>
  )
}
