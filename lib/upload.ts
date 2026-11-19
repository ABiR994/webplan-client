export async function uploadImage(file: File) {
  const body = new FormData()
  body.append("image", file)

  const res = await fetch("/api/upload", { method: "POST", body })
  const data = await res.json()

  if (!res.ok) throw new Error(data.error ?? "Image upload failed")
  return data.url as string
}
