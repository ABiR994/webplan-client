"use client"

import * as React from "react"
import { Ban, Eye, Loader2, Search, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { UserDetailsDialog } from "@/components/dashboard/user-details-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { apiFetch } from "@/lib/api-client"
import type { AdminUser } from "@/lib/types"
import { cn } from "@/lib/utils"

type Result = { key: string; users: AdminUser[]; error?: string }

export function ManageUsers() {
  const [search, setSearch] = React.useState("")
  const [q, setQ] = React.useState("")
  const [role, setRole] = React.useState("")
  const [attempt, setAttempt] = React.useState(0)
  const [result, setResult] = React.useState<Result | null>(null)
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [viewingId, setViewingId] = React.useState<string | null>(null)
  const [target, setTarget] = React.useState<AdminUser | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setQ(search.trim()), 400)
    return () => clearTimeout(timer)
  }, [search])

  const key = `${q}|${role}|${attempt}`

  React.useEffect(() => {
    let active = true
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (role) params.set("role", role)

    apiFetch<AdminUser[]>(`/admin/users?${params}`)
      .then((data) => {
        if (!active) return
        setUsers(data)
        setResult({ key, users: data })
      })
      .catch((error: Error) => {
        if (active) setResult({ key, users: [], error: error.message })
      })

    return () => {
      active = false
    }
  }, [q, role, key])

  const loading = result?.key !== key

  async function confirmToggle() {
    if (!target) return
    const isBlocked = !target.isBlocked

    setSaving(true)
    try {
      await apiFetch(`/admin/users/${target._id}/block`, {
        method: "PATCH",
        body: { isBlocked },
      })
      setUsers((current) =>
        current.map((user) =>
          user._id === target._id ? { ...user, isBlocked } : user
        )
      )
      toast.success(isBlocked ? "User blocked" : "User unblocked")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      )
    } finally {
      setSaving(false)
      setTarget(null)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold">Manage Users</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        View registered users and block or unblock accounts.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Search users by name or email"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-white pl-9"
          />
        </div>
        <NativeSelect
          aria-label="Filter by role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="bg-white"
        >
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </NativeSelect>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : result?.error ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">{result.error}</p>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 h-10"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Try Again
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-heading text-lg font-semibold">No users found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or role filter.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b bg-secondary/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={user.image} alt="" />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      )}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="h-9"
                        onClick={() => setViewingId(user._id)}
                      >
                        <Eye aria-hidden />
                        View
                      </Button>
                      {user.role !== "admin" ? (
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9",
                            !user.isBlocked &&
                              "text-destructive hover:text-destructive"
                          )}
                          onClick={() => setTarget(user)}
                        >
                          {user.isBlocked ? (
                            <ShieldCheck aria-hidden />
                          ) : (
                            <Ban aria-hidden />
                          )}
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserDetailsDialog
        userId={viewingId}
        onClose={() => setViewingId(null)}
      />

      <Dialog
        open={!!target}
        onOpenChange={(open) => !open && !saving && setTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>
            {target?.isBlocked ? "Unblock" : "Block"} this user?
          </DialogTitle>
          <DialogDescription>
            {target?.isBlocked
              ? `${target.name} will be able to use WedPlan again.`
              : `${target?.name} will no longer be able to use protected features such as bookings and dashboards.`}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              className="h-9"
              disabled={saving}
              onClick={() => setTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant={target?.isBlocked ? "default" : "destructive"}
              className="h-9"
              disabled={saving}
              onClick={confirmToggle}
            >
              {saving ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {target?.isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
