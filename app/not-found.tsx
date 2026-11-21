import Image from "next/image"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-secondary to-white px-4 text-center">
      <Image src="/logo.svg" alt="" width={56} height={56} />
      <p className="mt-6 font-heading text-7xl font-semibold text-primary">
        404
      </p>
      <h1 className="mt-2 font-heading text-2xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={buttonVariants({ size: "lg", className: "h-10" })}
        >
          Back to Home
        </Link>
        <Link
          href="/services"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "h-10",
          })}
        >
          Browse Services
        </Link>
      </div>
    </main>
  )
}
