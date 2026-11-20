import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Package,
  PlusCircle,
  Receipt,
  ShieldCheck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react"

import type { Role } from "@/lib/routes"

export type NavItem = { href: string; label: string; icon: LucideIcon }

const vendor = "/dashboard/vendor"
const customer = "/dashboard/customer"
const admin = "/dashboard/admin"

export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  vendor: [
    { href: vendor, label: "Overview", icon: LayoutDashboard },
    { href: `${vendor}/services`, label: "My Services", icon: Package },
    { href: `${vendor}/add-service`, label: "Add Service", icon: PlusCircle },
    {
      href: `${vendor}/bookings`,
      label: "Booking Requests",
      icon: CalendarCheck,
    },
    { href: `${vendor}/subscription`, label: "Subscription", icon: CreditCard },
    { href: `${vendor}/profile`, label: "Profile Settings", icon: UserCog },
  ],
  customer: [
    { href: customer, label: "Overview", icon: LayoutDashboard },
    { href: `${customer}/bookings`, label: "My Bookings", icon: ClipboardList },
    { href: `${customer}/profile`, label: "Profile Settings", icon: UserCog },
  ],
  admin: [
    { href: admin, label: "Overview", icon: LayoutDashboard },
    { href: `${admin}/users`, label: "Manage Users", icon: Users },
    { href: `${admin}/services`, label: "Manage Services", icon: ShieldCheck },
    { href: `${admin}/transactions`, label: "Transactions", icon: Receipt },
    { href: `${admin}/profile`, label: "Profile Settings", icon: UserCog },
  ],
}

export const ROLE_LABEL: Record<Role, string> = {
  vendor: "Vendor Dashboard",
  customer: "Customer Dashboard",
  admin: "Admin Dashboard",
}
