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

export type ServiceDetails = Service & {
  description: string
  vendorId: string
  createdAt: string
}

export type VendorService = {
  _id: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  status: "pending" | "approved" | "rejected"
  isActive: boolean
  createdAt: string
}

export type CategoryCount = {
  _id: string
  count: number
}
