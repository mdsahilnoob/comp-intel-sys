import Link from "next/link";

import {
  AI_COMPANY_STATUSES,
  AI_COUNTRY_OPTIONS,
  type AiCompanyCategory,
  type AiCompanyQuery,
} from "@/server/ai-companies";
import { createCompanyHref } from "@/lib/urls";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CompanyFilters({
  query,
  categories,
}: {
  query: AiCompanyQuery;
  categories: AiCompanyCategory[];
}) {
  const hasFilters = Boolean(
    query.search || query.category || query.country || query.status,
  );

  return (
    <div className="mt-8 space-y-4">
      <form
        action="/companies"
        method="get"
        className="grid gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.75fr))_auto] lg:items-end"
      >
        <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
          Search companies
          <Input
            name="search"
            defaultValue={query.search}
            placeholder="Search companies, products, or capabilities…"
            aria-label="Search companies"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
          Country
          <Select
            name="country"
            defaultValue={query.country ?? ""}
            aria-label="Country"
          >
            <option value="">All countries</option>
            {AI_COUNTRY_OPTIONS.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
          Status
          <Select
            name="status"
            defaultValue={query.status ?? ""}
            aria-label="Status"
          >
            <option value="">All statuses</option>
            {AI_COMPANY_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
          Sort
          <Select name="sort" defaultValue={query.sort} aria-label="Sort">
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="products">Most products</option>
          </Select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 lg:flex-none"
          >
            Apply
          </button>
          {hasFilters ? (
            <Link
              href="/companies"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input px-3 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      <nav
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        aria-label="Company categories"
      >
        <Link
          href={createCompanyHref(query, { category: undefined, page: 1 })}
          aria-current={!query.category ? "page" : undefined}
          className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 ${!query.category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={createCompanyHref(query, {
              category: category.slug,
              page: 1,
            })}
            aria-current={query.category === category.slug ? "page" : undefined}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 ${query.category === category.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
          >
            {category.name}
            <span className="text-[10px] opacity-70">{category.count}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
