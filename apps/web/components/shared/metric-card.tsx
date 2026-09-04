import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function MetricCard({
  label,
  value,
  detail,
  icon,
  emphasized = false,
}: {
  label: string
  value: string
  detail?: string
  icon?: ReactNode
  emphasized?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5",
        emphasized && "border-primary/30 bg-primary/[0.045]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        {icon ? <span className="text-primary">{icon}</span> : null}
      </div>
      <p className="mt-3 font-heading text-xl font-bold tracking-tight sm:text-2xl">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  )
}
