import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-border/80 bg-card/45">
      <div className="site-footer-inner mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-9 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="footer-brand font-semibold text-foreground">CompGrid</p>
            <p className="mt-2 max-w-xs leading-5">CompGrid — Compensation Intelligence.</p>
            <p className="mt-1 max-w-xs leading-5">Synthetic demo compensation data for engineering evaluation.</p>
          </div>
          <nav className="flex max-w-md flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
            <Link className="transition-colors hover:text-foreground" href="/explore">Explore</Link>
            <Link className="transition-colors hover:text-foreground" href="/companies">Companies</Link>
            <Link className="transition-colors hover:text-foreground" href="/compare">Compare</Link>
            <Link className="transition-colors hover:text-foreground" href="/submit">Submit</Link>
            <Link className="transition-colors hover:text-foreground" href="/methodology">Methodology</Link>
            <Link className="transition-colors hover:text-foreground" href="/research">Research</Link>
          </nav>
        </div>
        <p className="border-t border-border/70 pt-4">All landing page figures are illustrative and synthetic.</p>
      </div>
    </footer>
  )
}
