import { API_URL } from "@/lib/api"
import { authClient } from "@/lib/auth-client"

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { data, error } = await authClient.token()
  if (error || !data?.token) throw new Error("Please sign in to continue")

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const result = await res.json().catch(() => null)
  if (!res.ok) throw new Error(result?.message ?? "Something went wrong")
  return result as T
}
