import {
  Building2,
  Camera,
  Flower2,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

export const CATEGORIES: { name: string; icon: LucideIcon }[] = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: Building2 },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: UtensilsCrossed },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
]

export const categoryHref = (name: string) =>
  `/services?category=${encodeURIComponent(name)}`
