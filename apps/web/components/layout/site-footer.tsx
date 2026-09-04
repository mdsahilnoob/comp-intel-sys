import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/45">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span className="font-semibold text-foreground">CompGrid</span> ·
          Understand what your compensation is really worth.
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
          <Link className="transition-colors hover:text-foreground" href="/methodology">
            Methodology
          </Link>
          <Link className="transition-colors hover:text-foreground" href="/research">
            Competitor research
          </Link>
          <Link className="transition-colors hover:text-foreground" href="/submit">
            Submit data
          </Link>
        </nav>
      </div>
    </footer>
  )
}
