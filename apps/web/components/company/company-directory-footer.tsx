import Link from "next/link";

export function CompanyDirectoryFooter({ total }: { total: number }) {
  return (
    <section
      aria-labelledby="company-directory-next-step"
      className="mt-16 overflow-hidden rounded-2xl border border-border bg-card/45 p-5 sm:p-7"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-2xl">
          <h2
            id="company-directory-next-step"
            className="font-heading text-lg font-bold tracking-tight"
          >
            Compare the market by employer
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Looking for compensation context? Compare company levels, roles,
            locations, and total compensation in the explorer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/explore"
            className="inline-flex min-h-10 items-center rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            Explore compensation
          </Link>
          <Link
            href="/compare"
            className="inline-flex min-h-10 items-center rounded-lg border border-input px-3.5 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            Compare companies
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span>
          <strong className="font-semibold text-foreground">{total}</strong>{" "}
          matching {total === 1 ? "company" : "companies"}
        </span>
        <span>URL-backed filters</span>
        <span>Illustrative demo catalog</span>
      </div>
    </section>
  );
}
