"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Ban, Home, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { DASHBOARD_NAV, ROLE_LABEL } from "@/lib/dashboard-nav"
import type { Role } from "@/lib/routes"
import { cn } from "@/lib/utils"

type ShellUser = {
  name: string
  email: string
  image?: string | null
  role: Role
  isBlocked?: boolean | null
}

export function DashboardShell({
  role,
  user,
  children,
}: {
  role: Role
  user: ShellUser
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const items = DASHBOARD_NAV[role]
  const base = items[0].href

  const isActive = (href: string) =>
    href === base ? pathname === base : pathname.startsWith(href)

  return (
    <div className="min-h-svh bg-muted/30 lg:grid lg:grid-cols-[16rem_1fr]">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform lg:sticky lg:top-0 lg:h-svh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link href="/" className="flex h-16 items-center gap-2 border-b px-5">
          <Image src="/logo.svg" alt="" width={30} height={30} />
          <span className="font-heading text-xl font-semibold text-primary">
            WedPlan
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-secondary text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <Home aria-hidden className="size-4" />
            Back to Website
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-lg"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden />
            </Button>
            <h1 className="font-heading text-lg font-semibold">
              {ROLE_LABEL[role]}
            </h1>
          </div>
          <UserMenu user={user} />
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {user.isBlocked ? (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-8 text-center">
              <Ban aria-hidden className="mx-auto size-10 text-destructive" />
              <h2 className="mt-4 font-heading text-xl font-semibold">
                Account blocked
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your account has been blocked by an admin, so dashboard features
                are unavailable.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
