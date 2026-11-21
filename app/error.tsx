"use client"

import Link from "next/link"
import { TriangleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <TriangleAlert aria-hidden className="size-12 text-destructive" />
      <h1 className="mt-4 font-heading text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again, or head back to the home
        page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" className="h-10" onClick={reset}>
          Try Again
        </Button>
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "h-10",
          })}
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
