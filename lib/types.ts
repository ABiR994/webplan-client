export type Service = {
  _id: string
  serviceName: string
  category: string
  price: number
  location: string
  images: string[]
  vendor?: {
    name: string
    businessName?: string
    image?: string
    subscriptionPlan?: "free" | "premium"
  }
}

export type CategoryCount = {
  _id: string
  count: number
}
