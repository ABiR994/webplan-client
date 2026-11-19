import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center bg-gradient-to-b from-secondary to-white px-4 py-8 sm:py-12">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="" width={36} height={36} priority />
        <span className="font-heading text-2xl font-semibold text-primary">
          WedPlan
        </span>
      </Link>
      <main className="mt-8 w-full max-w-md">{children}</main>
    </div>
  )
}
