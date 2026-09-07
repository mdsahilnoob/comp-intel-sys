import { Button } from "@/components/ui/button"
import { ShieldCheckIcon } from "@/components/ui/shield-check"

export function ErrorPanel({
  title = "This view could not load",
  description = "Try refreshing the page. If the issue continues, check the database configuration.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-10 text-center">
      <ShieldCheckIcon size={24} className="size-6 text-destructive" aria-hidden="true" />
      <h2 className="mt-3 font-heading text-base font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {onRetry ? <Button type="button" variant="outline" size="sm" className="mt-5" onClick={onRetry}>Try again</Button> : null}
    </div>
  )
}
