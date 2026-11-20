import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: LucideIcon
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl font-semibold">{value}</p>
      </div>
    </div>
  )
}
