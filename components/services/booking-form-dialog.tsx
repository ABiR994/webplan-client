"use client"

import * as React from "react"
import { CalendarCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api-client"

function getTomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

export function BookingFormDialog({
  serviceId,
  serviceName,
}: {
  serviceId: string
  serviceName: string
}) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    setLoading(true)
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: {
          serviceId,
          eventDate: form.get("eventDate"),
          eventLocation: form.get("eventLocation"),
          message: form.get("message"),
        },
      })
      toast.success("Booking request sent to the vendor")
      setOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send request"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="h-11 w-full" />}>
        <CalendarCheck aria-hidden />
        Request Booking
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Request a booking</DialogTitle>
        <DialogDescription>{serviceName}</DialogDescription>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="eventDate">Event date</Label>
            <Input
              id="eventDate"
              name="eventDate"
              type="date"
              min={getTomorrow()}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="eventLocation">Event location</Label>
            <Input
              id="eventLocation"
              name="eventLocation"
              minLength={2}
              maxLength={200}
              required
              placeholder="Venue name and city"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Additional message</Label>
            <Textarea
              id="message"
              name="message"
              maxLength={1000}
              placeholder="Tell the vendor about your event (optional)"
            />
          </div>
          <Button type="submit" size="lg" className="h-10" disabled={loading}>
            {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
            Send Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
