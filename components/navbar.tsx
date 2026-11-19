"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const [open, setOpen] = React.useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const linkClass = (href: string) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary",
      isActive(href) ? "text-primary" : "text-foreground/70"
    )

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={32} height={32} priority />
          <span className="font-heading text-xl font-semibold text-primary">
            WedPlan
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                Sign Up
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-1 border-t px-4 py-3 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href)}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {!isPending && !session ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="lg"
                className="h-10"
                nativeButton={false}
                render={<Link href="/sign-in" onClick={() => setOpen(false)} />}
              >
                Sign In
              </Button>
              <Button
                size="lg"
                className="h-10"
                nativeButton={false}
                render={<Link href="/sign-up" onClick={() => setOpen(false)} />}
              >
                Sign Up
              </Button>
            </div>
          ) : null}
        </nav>
      ) : null}
    </header>
  )
}
