import { Reveal } from "@/components/motion"

export function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </Reveal>
  )
}
