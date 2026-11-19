"use client"

import * as React from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"

export function ServiceGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [selected, setSelected] = React.useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <ImageOff aria-hidden className="size-10" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={images[selected]}
          alt={`${name} - image ${selected + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === selected}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors",
                index === selected
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
