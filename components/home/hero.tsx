import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/hero.svg"
        alt=""
        fill
        priority
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/80 via-white/40 to-transparent md:from-white/50" />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-primary uppercase">
              Wedding planning made simple
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 font-heading text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl">
              Plan Your Dream Wedding, All in One Place
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Discover trusted photographers, venues, florists, caterers and
              more. Compare services and send booking requests in minutes.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link
              href="/services"
              className={buttonVariants({
                size: "lg",
                className: "mt-8 h-12 px-6 text-base",
              })}
            >
              Explore Wedding Services
              <ArrowRight aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
