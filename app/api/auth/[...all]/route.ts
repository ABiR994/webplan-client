import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

const handler = toNextJsHandler(auth)

export const { POST } = handler

export async function GET(request: Request) {
  const response = await handler.GET(request.clone())
  if (response.status < 500) return response

  await new Promise((resolve) => setTimeout(resolve, 500))
  return handler.GET(request)
}
