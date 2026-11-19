"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, UserCog } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { getDashboardPath, getProfilePath } from "@/lib/routes"

type MenuUser = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

export function UserMenu({ user }: { user: MenuUser }) {
  const router = useRouter()

  async function handleLogout() {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error(error.message || "Logout failed")
      return
    }
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex items-center gap-3 px-2.5 py-2">
          <Avatar className="size-10">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={getDashboardPath(user.role)} />}>
          <LayoutDashboard aria-hidden />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={getProfilePath(user.role)} />}>
          <UserCog aria-hidden />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive"
        >
          <LogOut aria-hidden />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
