"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Eye, ImageOff, Loader2, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { apiFetch } from "@/lib/api-client"
import { CATEGORIES } from "@/lib/categories"
import { formatPrice, SERVICE_STATUS_STYLES } from "@/lib/service"
import type { AdminService } from "@/lib/types"
import { cn } from "@/lib/utils"

type Result = { key: string; error?: string }
type Action = { service: AdminService; type: "rejected" | "delete" }

const vendorLabel = (service: AdminService) =>
  service.vendor?.businessName || service.vendor?.name || "Vendor unavailable"

export function ManageServices() {
  const [search, setSearch] = React.useState("")
  const [q, setQ] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [attempt, setAttempt] = React.useState(0)
  const [result, setResult] = React.useState<Result | null>(null)
  const [services, setServices] = React.useState<AdminService[]>([])
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [viewing, setViewing] = React.useState<AdminService | null>(null)
  const [action, setAction] = React.useState<Action | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => setQ(search.trim()), 400)
    return () => clearTimeout(timer)
  }, [search])

  const key = `${q}|${status}|${category}|${attempt}`

  React.useEffect(() => {
    let active = true
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (status) params.set("status", status)
    if (category) params.set("category", category)

    apiFetch<AdminService[]>(`/admin/services?${params}`)
      .then((data) => {
        if (!active) return
        setServices(data)
        setResult({ key })
      })
      .catch((error: Error) => {
        if (active) setResult({ key, error: error.message })
      })

    return () => {
      active = false
    }
  }, [q, status, category, key])

  const loading = result?.key !== key

  async function changeStatus(
    service: AdminService,
    next: "approved" | "rejected"
  ) {
    setBusyId(service._id)
    try {
      await apiFetch(`/admin/services/${service._id}/status`, {
        method: "PATCH",
        body: { status: next },
      })
      setServices((current) =>
        current.map((item) =>
          item._id === service._id ? { ...item, status: next } : item
        )
      )
      toast.success(`Service ${next}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      )
    } finally {
      setBusyId(null)
      setAction(null)
    }
  }

  async function deleteService(service: AdminService) {
    setBusyId(service._id)
    try {
      await apiFetch(`/admin/services/${service._id}`, { method: "DELETE" })
      setServices((current) =>
        current.filter((item) => item._id !== service._id)
      )
      toast.success("Service deleted successfully")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      )
    } finally {
      setBusyId(null)
      setAction(null)
    }
  }

  const confirmAction = () => {
    if (!action) return
    if (action.type === "delete") return deleteService(action.service)
    return changeStatus(action.service, "rejected")
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Manage Services</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Review submitted services. Only approved and available services appear
        on the public site.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_14rem]">
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
            className="bg-white pl-9"
          />
        </div>
        <NativeSelect
          aria-label="Filter by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="bg-white"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </NativeSelect>
        <NativeSelect
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="bg-white"
        >
          <option value="">All categories</option>
          {CATEGORIES.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border bg-muted"
            />
          ))
        ) : result?.error ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <p className="text-muted-foreground">{result.error}</p>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 h-10"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Try Again
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <p className="font-heading text-lg font-semibold">
              No services found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <article
              key={service._id}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:w-36">
                {service.images[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.serviceName}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff aria-hidden className="size-6" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-lg font-semibold">
                      {service.serviceName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.category} · {service.location} ·{" "}
                      <span className="font-medium text-primary">
                        {formatPrice(service.price)}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By {vendorLabel(service)}
                      {!service.isActive ? " · Hidden by vendor" : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      SERVICE_STATUS_STYLES[service.status]
                    )}
                  >
                    {service.status}
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="h-9"
                    onClick={() => setViewing(service)}
                  >
                    <Eye aria-hidden />
                    View
                  </Button>
                  {service.status !== "approved" ? (
                    <Button
                      className="h-9"
                      disabled={busyId === service._id}
                      onClick={() => changeStatus(service, "approved")}
                    >
                      {busyId === service._id ? (
                        <Loader2 aria-hidden className="animate-spin" />
                      ) : (
                        <Check aria-hidden />
                      )}
                      Approve
                    </Button>
                  ) : null}
                  {service.status !== "rejected" ? (
                    <Button
                      variant="outline"
                      className="h-9 text-destructive hover:text-destructive"
                      disabled={busyId === service._id}
                      onClick={() => setAction({ service, type: "rejected" })}
                    >
                      <X aria-hidden />
                      Reject
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    className="h-9 text-destructive hover:text-destructive"
                    disabled={busyId === service._id}
                    onClick={() => setAction({ service, type: "delete" })}
                  >
                    <Trash2 aria-hidden />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="max-w-2xl">
          {viewing ? (
            <>
              <DialogTitle>{viewing.serviceName}</DialogTitle>
              <DialogDescription>
                {viewing.category} · {viewing.location} ·{" "}
                {formatPrice(viewing.price)}
              </DialogDescription>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {viewing.images.map((image) => (
                  <div
                    key={image}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary"
                  >
                    <Image
                      src={image}
                      alt={viewing.serviceName}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm whitespace-pre-line text-muted-foreground">
                {viewing.description}
              </p>
              <p className="mt-4 text-sm">
                <span className="font-medium">Vendor:</span>{" "}
                {vendorLabel(viewing)}
                {viewing.vendor?.email ? ` (${viewing.vendor.email})` : ""}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!action}
        onOpenChange={(open) => !open && !busyId && setAction(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>
            {action?.type === "delete"
              ? "Delete this service?"
              : "Reject this service?"}
          </DialogTitle>
          <DialogDescription>
            {action?.type === "delete"
              ? `${action.service.serviceName} will be permanently removed. This cannot be undone.`
              : `${action?.service.serviceName} will be hidden from customers. The vendor can edit and resubmit it.`}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              disabled={!!busyId}
              onClick={() => setAction(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={!!busyId}
              onClick={confirmAction}
            >
              {busyId ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {action?.type === "delete" ? "Delete" : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
