"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { API_URL } from "@/lib/api"
import { CATEGORIES } from "@/lib/categories"
import type { Service } from "@/lib/types"

const SORT_OPTIONS = [
  { value: "", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

type Result = { key: string; services: Service[]; error: boolean }

export function ServiceBrowser() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""
  const location = searchParams.get("location") ?? ""
  const sort = searchParams.get("sort") ?? ""
  const queryString = searchParams.toString()

  const [search, setSearch] = React.useState(q)
  const [locations, setLocations] = React.useState<string[]>([])
  const [result, setResult] = React.useState<Result | null>(null)
  const [retry, setRetry] = React.useState(0)

  const updateParams = React.useCallback(
    (changes: Record<string, string>) => {
      const params = new URLSearchParams(window.location.search)
      Object.entries(changes).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      const next = params.toString()
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    },
    [router, pathname]
  )

  React.useEffect(() => {
    if (search.trim() === q) return
    const timer = setTimeout(() => updateParams({ q: search.trim() }), 400)
    return () => clearTimeout(timer)
  }, [search, q, updateParams])

  React.useEffect(() => {
    fetch(`${API_URL}/services/locations`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setLocations)
      .catch(() => setLocations([]))
  }, [])

  const requestKey = `${queryString}#${retry}`

  React.useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_URL}/services?${queryString}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed")
        return res.json()
      })
      .then((services: Service[]) =>
        setResult({ key: requestKey, services, error: false })
      )
      .catch((error) => {
        if (error.name === "AbortError") return
        setResult({ key: requestKey, services: [], error: true })
      })

    return () => controller.abort()
  }, [queryString, requestKey])

  const loading = result?.key !== requestKey
  const hasFilters = Boolean(q || category || location || sort)
  const locationOptions =
    location && !locations.includes(location)
      ? [location, ...locations]
      : locations

  function clearFilters() {
    setSearch("")
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Search services by name"
            placeholder="Search services by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        <NativeSelect
          aria-label="Filter by category"
          value={category}
          onChange={(event) => updateParams({ category: event.target.value })}
        >
          <option value="">All categories</option>
          {CATEGORIES.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          aria-label="Filter by location"
          value={location}
          onChange={(event) => updateParams({ location: event.target.value })}
        >
          <option value="">All locations</option>
          {locationOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          aria-label="Sort services"
          value={sort}
          onChange={(event) => updateParams({ sort: event.target.value })}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-10"
          disabled={!hasFilters && !search}
          onClick={clearFilters}
        >
          <X aria-hidden />
          Clear
        </Button>
      </div>

      <p aria-live="polite" className="mt-6 mb-4 text-sm text-muted-foreground">
        {loading
          ? "Loading services..."
          : result?.error
            ? ""
            : `${result?.services.length ?? 0} ${
                result?.services.length === 1 ? "service" : "services"
              } found`}
      </p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-2xl border bg-muted"
            />
          ))}
        </div>
      ) : result?.error ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground">
            We couldn&apos;t load services right now.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="mt-4 h-10"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try Again
          </Button>
        </div>
      ) : result.services.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-heading text-lg font-semibold">
            No services found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or adjust your filters.
          </p>
          {hasFilters ? (
            <Button
              variant="outline"
              size="lg"
              className="mt-4 h-10"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
