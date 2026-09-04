import { cn } from "@/lib/utils"

function Divider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("h-px w-full bg-border", className)} />
}

export { Divider }
