import { Reveal } from "@/components/motion"
import { SectionHeading } from "@/components/section-heading"

const STEPS = [
  {
    title: "Browse and Compare",
    description:
      "Search wedding services by name, category or location and compare options.",
  },
  {
    title: "Send a Booking Request",
    description:
      "Pick your event date, add a message and send your request to the vendor.",
  },
  {
    title: "Get Confirmed",
    description:
      "Track the vendor's response from your dashboard and get ready to celebrate.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          title="How WedPlan Works"
          subtitle="Three simple steps from first idea to confirmed booking."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ title, description }, index) => (
            <Reveal key={title} delay={index * 0.15}>
              <div className="h-full rounded-2xl border bg-white p-6 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary font-heading text-xl font-semibold text-primary-foreground">
                  {index + 1}
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
      </div>
    </section>
  )
}
