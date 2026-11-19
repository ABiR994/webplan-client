import Link from "next/link"

import { Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"
import { API_URL } from "@/lib/api"
import { CATEGORIES, categoryHref } from "@/lib/categories"
import type { CategoryCount } from "@/lib/types"

async function getCategoryCounts() {
  try {
    const res = await fetch(`${API_URL}/services/category-counts`, {
      cache: "no-store",
    })
    if (!res.ok) return {}
    const data: CategoryCount[] = await res.json()
    return Object.fromEntries(data.map((item) => [item._id, item.count]))
  } catch {
    return {}
  }
}

export async function Categories() {
  const counts: Record<string, number> = await getCategoryCounts()

  return (
    <section className="bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          title="Wedding Service Categories"
          subtitle="Explore services by category and find exactly what your wedding needs."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {CATEGORIES.map(({ name, icon: Icon }, index) => (
            <Reveal key={name} delay={(index % 3) * 0.1}>
              <Link
                href={categoryHref(name)}
                className="flex h-full flex-col items-center gap-3 rounded-2xl border bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon aria-hidden className="size-6" />
                </span>
                <span className="font-heading text-base font-semibold sm:text-lg">
                  {name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {counts[name] ?? 0}{" "}
                  {(counts[name] ?? 0) === 1 ? "service" : "services"}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
