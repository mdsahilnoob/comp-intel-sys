import Link from "next/link"

import { createExplorerHref } from "@/lib/urls"
import type { ExplorerFilters } from "@/server/domain"

export function Pagination({ filters, totalPages }: { filters: ExplorerFilters; totalPages: number }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1)
  return <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Pagination"><p className="text-sm text-muted-foreground">Page {filters.page} of {totalPages}</p><div className="flex items-center gap-1">{filters.page > 1 && <Link className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium hover:bg-secondary" href={createExplorerHref(filters, { page: filters.page - 1 })}>Previous</Link>}{pages.map((page) => <Link key={page} aria-current={page === filters.page ? "page" : undefined} className={`inline-flex size-10 items-center justify-center rounded-lg text-sm font-semibold ${page === filters.page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`} href={createExplorerHref(filters, { page })}>{page}</Link>)}{filters.page < totalPages && <Link className="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium hover:bg-secondary" href={createExplorerHref(filters, { page: filters.page + 1 })}>Next</Link>}</div></nav>
}
