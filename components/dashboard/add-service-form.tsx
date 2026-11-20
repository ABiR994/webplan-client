"use client"

import * as React from "react"
import Image from "next/image"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api-client"
import { CATEGORIES } from "@/lib/categories"
import { uploadImage } from "@/lib/upload"

const MAX_IMAGES = 4

export function AddServiceForm() {
  const [files, setFiles] = React.useState<File[]>([])
  const [loading, setLoading] = React.useState(false)

  const previews = React.useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  )

  React.useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    event.target.value = ""

    setFiles((current) => {
      const merged = [...current, ...selected]
      if (merged.length > MAX_IMAGES) {
        toast.error(`You can upload up to ${MAX_IMAGES} images`)
      }
      return merged.slice(0, MAX_IMAGES)
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (files.length === 0) {
      toast.error("Please upload at least one service image")
      return
    }

    setLoading(true)
    try {
      let images: string[]
      try {
        images = await Promise.all(files.map(uploadImage))
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Image upload failed"
        )
      }

      await apiFetch("/services", {
        method: "POST",
        body: {
          serviceName: data.get("serviceName"),
          category: data.get("category"),
          description: data.get("description"),
          price: data.get("price"),
          location: data.get("location"),
          images,
        },
      })

      toast.success("Service submitted. It will be visible once approved.")
      form.reset()
      setFiles([])
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add service"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Add Service</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        New services are reviewed by an admin before customers can see them.
        Free plan vendors can keep up to 3 active services.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid max-w-3xl gap-5 rounded-2xl border bg-white p-6 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="serviceName">Service name</Label>
          <Input
            id="serviceName"
            name="serviceName"
            required
            minLength={3}
            maxLength={100}
            placeholder="Cinematic Wedding Photography"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <NativeSelect id="category" name="category" required defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            required
            min={1}
            max={1000000}
            step="any"
            placeholder="450"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            required
            minLength={2}
            maxLength={100}
            placeholder="Dhaka"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            minLength={20}
            maxLength={2000}
            className="min-h-32"
            placeholder="Describe what is included, your experience and how booking works."
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="images">Service images</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map((src, index) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border"
              >
                <Image
                  src={src}
                  alt={`Selected image ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() =>
                    setFiles((current) => current.filter((_, i) => i !== index))
                  }
                  className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X aria-hidden className="size-3.5" />
                </button>
              </div>
            ))}

            {files.length < MAX_IMAGES ? (
              <label
                htmlFor="images"
                className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:bg-secondary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50"
              >
                <ImagePlus aria-hidden className="size-6" />
                <span className="text-xs">Add image</span>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFiles}
                />
              </label>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Upload 1 to {MAX_IMAGES} images, up to 5MB each. The first image is
            the cover.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-10 sm:col-span-2"
          disabled={loading}
        >
          {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
          Submit Service
        </Button>
      </form>
    </div>
  )
}
