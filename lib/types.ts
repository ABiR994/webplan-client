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

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled"

export type VendorBooking = {
  _id: string
  eventDate: string
  eventLocation: string
  message: string
  status: BookingStatus
  createdAt: string
  customer?: { name: string; email: string; image?: string }
  service?: { serviceName: string; category: string; images: string[] }
}

export type CategoryCount = {
  _id: string
  count: number
}
