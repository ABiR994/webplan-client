export const PREMIUM_PRICE = 19

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "Maximum 3 active services",
      "Basic vendor dashboard",
      "Booking request management",
    ],
  },
  premium: {
    name: "Premium",
    price: PREMIUM_PRICE,
    features: [
      "Unlimited active services",
      "Premium Vendor badge",
      "All Free plan features",
    ],
  },
}
