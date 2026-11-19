import { NextResponse } from "next/server"

const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("image")

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 5MB" },
      { status: 400 }
    )
  }

  const body = new FormData()
  body.append("image", file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    { method: "POST", body }
  )
  const result = await res.json()

  if (!res.ok || !result.success) {
    return NextResponse.json({ error: "Image upload failed" }, { status: 502 })
  }
  return NextResponse.json({ url: result.data.url })
}
