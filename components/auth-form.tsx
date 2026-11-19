"use client"

import * as React from "react"
import Link from "next/link"
import {
  Camera,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Store,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Role } from "@/lib/routes"

export type AuthMode = "signin" | "signup"

export type AuthFormData = {
  email: string
  password: string
  name?: string
  role?: Exclude<Role, "admin">
  image?: File | null
}

const COPY = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to manage your wedding plans.",
    submit: "Sign In",
    footer: "New to WedPlan?",
    linkHref: "/sign-up",
    linkLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "Join WedPlan to book or offer wedding services.",
    submit: "Create Account",
    footer: "Already have an account?",
    linkHref: "/sign-in",
    linkLabel: "Sign in",
  },
} as const

const ROLES: {
  value: NonNullable<AuthFormData["role"]>
  label: string
  hint: string
  icon: LucideIcon
}[] = [
  {
    value: "customer",
    label: "Customer",
    hint: "Find and book services",
    icon: Heart,
  },
  { value: "vendor", label: "Vendor", hint: "List your services", icon: Store },
]

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

export function AuthForm({
  mode,
  onSubmit,
  onGoogle,
}: {
  mode: AuthMode
  onSubmit: (data: AuthFormData) => Promise<void>
  onGoogle: () => Promise<void>
}) {
  const copy = COPY[mode]
  const isSignup = mode === "signup"

  const [values, setValues] = React.useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    role: "customer",
    image: null,
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const preview = React.useMemo(
    () => (values.image ? URL.createObjectURL(values.image) : null),
    [values.image]
  )

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const setField =
    (field: "email" | "password" | "name") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      if (field === "password") setPasswordError(null)
    }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSignup && !PASSWORD_RULE.test(values.password)) {
      setPasswordError(
        "Use at least 6 characters with one uppercase and one lowercase letter"
      )
      return
    }

    setLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await onGoogle()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-semibold">{copy.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignup ? (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">I am a</legend>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ value, label, hint, icon: Icon }) => {
                  const selected = values.role === value
                  return (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50",
                        selected
                          ? "border-primary bg-secondary text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={selected}
                        onChange={() =>
                          setValues((prev) => ({ ...prev, role: value }))
                        }
                        className="sr-only"
                      />
                      <Icon aria-hidden className="size-5" />
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs text-muted-foreground">
                        {hint}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="flex items-center gap-4">
              <label
                htmlFor="image"
                className="relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed bg-muted text-muted-foreground hover:bg-secondary"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <Camera aria-hidden className="size-5" />
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      image: event.target.files?.[0] ?? null,
                    }))
                  }
                />
              </label>
              <div className="text-sm">
                <p className="font-medium">Profile image</p>
                <p className="text-xs text-muted-foreground">
                  Optional. JPG or PNG, up to 5MB.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={values.name}
                onChange={setField("name")}
                placeholder="Jane Doe"
              />
            </div>
          </>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={setField("email")}
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              maxLength={72}
              value={values.password}
              onChange={setField("password")}
              placeholder={isSignup ? "Create a password" : "Your password"}
              aria-invalid={passwordError ? true : undefined}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="size-4" />
              ) : (
                <Eye aria-hidden className="size-4" />
              )}
            </button>
          </div>
          {passwordError ? (
            <p role="alert" className="text-xs text-destructive">
              {passwordError}
            </p>
          ) : isSignup ? (
            <p className="text-xs text-muted-foreground">
              At least 6 characters, with uppercase and lowercase letters.
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-2 h-10"
          disabled={loading}
        >
          {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
          {copy.submit}
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10"
          disabled={loading}
          onClick={handleGoogle}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {copy.footer}{" "}
        <Link
          href={copy.linkHref}
          className="font-medium text-primary hover:underline"
        >
          {copy.linkLabel}
        </Link>
      </p>
    </div>
  )
}
