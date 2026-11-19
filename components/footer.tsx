import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/social-icons"

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
]

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://x.com", label: "X", icon: XIcon },
  {
    href: "https://www.linkedin.com/in/salem-nur-abir/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
]

const CONTACT = {
  email: "salemnurabir2@gmail.com",
  phone: "+8801730992604",
}

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex w-fit items-center gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} />
            <span className="font-heading text-xl font-semibold text-primary">
              WedPlan
            </span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Discover trusted wedding vendors, compare services and book
            everything for your big day in one place.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border bg-white text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold">Quick Links</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold">Contact Us</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail aria-hidden className="size-4 shrink-0 text-primary" />
                <span className="break-all">{CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone aria-hidden className="size-4 shrink-0 text-primary" />
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} WedPlan. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
