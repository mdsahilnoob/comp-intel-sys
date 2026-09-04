import * as React from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning"

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-transparent text-muted-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
