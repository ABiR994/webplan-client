import { CalendarCheck, Lock, ShieldCheck, Tag } from "lucide-react"

import { Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Reviewed Vendors",
    description:
      "Every service is reviewed by our admins before it appears on the platform.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking Requests",
    description:
      "Send your event date and details in one form and track the response.",
  },
  {
    icon: Tag,
    title: "Clear Pricing",
    description:
      "See prices upfront and compare services across categories and locations.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Vendor subscriptions are processed safely through Stripe Checkout.",
  },
]

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
      <SectionHeading
        title="Why Choose WedPlan?"
        subtitle="Everything you need to find, compare and book wedding services with confidence."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 0.1}>
            <div className="h-full rounded-2xl border bg-white p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
