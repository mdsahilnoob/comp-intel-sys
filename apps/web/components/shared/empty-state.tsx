import { SearchX } from "lucide-react"
import Link from "next/link"


export function EmptyState({
  title,
  description,
  clearHref = "/",
}: {
  title: string
  description: string
  clearHref?: string
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <span className="mb-4 grid size-11 place-items-center rounded-full bg-secondary text-primary">
        <SearchX className="size-5" aria-hidden="true" />
      </span>
      <h2 className="font-heading text-base font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        href={clearHref}
        className="mt-5 inline-flex min-h-9 items-center justify-center rounded-lg border border-input bg-background px-3.5 text-sm font-semibold shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
      >
        Clear filters
      </Link>
    </div>
  )
}
