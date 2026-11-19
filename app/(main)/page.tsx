import { Suspense } from "react"

import { Categories } from "@/components/home/categories"
import {
  FeaturedServices,
  FeaturedServicesSkeleton,
} from "@/components/home/featured-services"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { WhyChoose } from "@/components/home/why-choose"

export default function Page() {
  return (
    <main className="flex-1">
      <Hero />
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
            <FeaturedServicesSkeleton />
          </section>
        }
      >
        <FeaturedServices />
      </Suspense>
      <Suspense>
        <Categories />
      </Suspense>
      <WhyChoose />
      <HowItWorks />
    </main>
  )
}
