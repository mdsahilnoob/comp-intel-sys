import Link from "next/link";

import type { AiCompanyQuery } from "@/server/ai-companies";
import { createCompanyHref } from "@/lib/urls";

export function CompanyPagination({
  query,
  totalPages,
}: {
  query: AiCompanyQuery;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(query.page - 3, totalPages - 6));
  const pages = Array.from(
    { length: Math.min(totalPages, 7) },
    (_, index) => start + index,
  );

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-between gap-3"
      aria-label="Company pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page {query.page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {query.page > 1 ? (
          <Link
            href={createCompanyHref(query, { page: query.page - 1 })}
            className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            Previous
          </Link>
        ) : null}
        {pages.map((page) => (
          <Link
            key={page}
            href={createCompanyHref(query, { page })}
            aria-current={page === query.page ? "page" : undefined}
            className={`inline-flex size-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 ${page === query.page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
          >
            {page}
          </Link>
        ))}
        {query.page < totalPages ? (
          <Link
            href={createCompanyHref(query, { page: query.page + 1 })}
            className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
