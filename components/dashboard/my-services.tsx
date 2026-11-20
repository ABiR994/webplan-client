"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, ImageOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ServiceForm } from "@/components/dashboard/service-form"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiFetch } from "@/lib/api-client"
import type { VendorService } from "@/lib/types"
import { cn } from "@/lib/utils"

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
} as const

function getVisibility(service: VendorService) {
  if (service.status === "rejected") return "Rejected. Edit and resubmit."
  if (service.status === "pending") return "Waiting for admin approval"
  return service.isActive ? "Visible to customers" : "Hidden by you"
}

function Cover({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:w-36">
      {src ? (
        <Image
          src={src}
          alt={alt}
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
  )
}

type State = { attempt: number; services?: VendorService[]; error?: string }

export function MyServices() {
  const [attempt, setAttempt] = React.useState(0)
  const [state, setState] = React.useState<State | null>(null)
  const [services, setServices] = React.useState<VendorService[]>([])
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [viewing, setViewing] = React.useState<VendorService | null>(null)
  const [editing, setEditing] = React.useState<VendorService | null>(null)
  const [deleting, setDeleting] = React.useState<VendorService | null>(null)

  React.useEffect(() => {
    let active = true

    apiFetch<VendorService[]>("/vendor/services")
      .then((data) => {
        if (!active) return
        setServices(data)
        setState({ attempt })
      })
      .catch((error: Error) => {
        if (active) setState({ attempt, error: error.message })
      })

    return () => {
      active = false
    }
  }, [attempt])

  const loading = state?.attempt !== attempt

  async function toggleAvailability(service: VendorService) {
    setBusyId(service._id)
    try {
      await apiFetch(`/services/${service._id}/availability`, {
        method: "PATCH",
        body: { isActive: !service.isActive },
      })
      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      )
      toast.success(
        service.isActive ? "Service marked unavailable" : "Service is available"
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      )
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    setBusyId(deleting._id)
    try {
      await apiFetch(`/services/${deleting._id}`, { method: "DELETE" })
      setServices((current) =>
        current.filter((item) => item._id !== deleting._id)
      )
      toast.success("Service deleted successfully")
      setDeleting(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold">My Services</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your services and check their approval status.
          </p>
        </div>
        <Link
          href="/dashboard/vendor/add-service"
          className={buttonVariants({ size: "lg", className: "h-10" })}
        >
          <Plus aria-hidden />
          Add Service
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border bg-muted"
            />
          ))
        ) : state?.error ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <p className="text-muted-foreground">{state.error}</p>
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
              No services yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first service to start receiving booking requests.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <article
              key={service._id}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row"
            >
              <Cover src={service.images[0]} alt={service.serviceName} />

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-lg font-semibold">
                      {service.serviceName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.category} · {service.location} ·{" "}
                      <span className="font-medium text-primary">
                        {priceFormat.format(service.price)}
                      </span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      STATUS_STYLES[service.status]
                    )}
                  >
                    {service.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {getVisibility(service)}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={service.isActive}
                    aria-label={`Availability for ${service.serviceName}`}
                    disabled={busyId === service._id}
                    onClick={() => toggleAvailability(service)}
                    className={cn(
                      "relative mr-2 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
                      service.isActive ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
                        service.isActive && "translate-x-5"
                      )}
                    />
                  </button>
                  <Button
                    variant="outline"
                    className="h-9"
                    onClick={() => setViewing(service)}
                  >
                    <Eye aria-hidden />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9"
                    onClick={() => setEditing(service)}
                  >
                    <Pencil aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 text-destructive hover:text-destructive"
                    onClick={() => setDeleting(service)}
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
                {priceFormat.format(viewing.price)}
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
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{viewing.status}</span> ·{" "}
                {getVisibility(viewing)}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-w-2xl">
          {editing ? (
            <>
              <DialogTitle>Edit service</DialogTitle>
              <DialogDescription>
                A rejected service is sent for review again after you save it.
              </DialogDescription>
              <div className="mt-5">
                <ServiceForm
                  service={editing}
                  onSaved={(saved) => {
                    setServices((current) =>
                      current.map((item) =>
                        item._id === saved._id ? { ...item, ...saved } : item
                      )
                    )
                    setEditing(null)
                  }}
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Delete this service?</DialogTitle>
          <DialogDescription>
            {deleting?.serviceName} will be permanently removed. This cannot be
            undone.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              onClick={() => setDeleting(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-9"
              disabled={busyId === deleting?._id}
              onClick={confirmDelete}
            >
              {busyId === deleting?._id ? (
                <Loader2 aria-hidden className="animate-spin" />
              ) : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
