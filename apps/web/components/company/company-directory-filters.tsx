import Link from "next/link";

import type {
  AiCompanyCategory,
  AiCompanyCountryCode,
  AiCompanyQuery,
} from "@/server/ai-companies";

const selectClassName =
  "h-10 min-w-40 rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15";

export function CompanyDirectoryFilters({
  query,
  categories,
  countryOptions,
}: {
  query: AiCompanyQuery;
  categories: AiCompanyCategory[];
  countryOptions: ReadonlyArray<{
    code: AiCompanyCountryCode;
    label: string;
  }>;
}) {
  return (
    <form
      action="/companies"
      method="get"
      aria-label="Company directory filters"
      className="flex flex-wrap items-center gap-2"
    >
      {query.search ? (
        <input type="hidden" name="search" value={query.search} />
      ) : null}
      <label>
        <span className="sr-only">Company category filter</span>
        <select
          name="category"
          defaultValue={query.category ?? ""}
          aria-label="Company category filter"
          className={selectClassName}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Country filter</span>
        <select
          name="country"
          defaultValue={query.country ?? ""}
          aria-label="Country filter"
          className={selectClassName}
        >
          <option value="">All countries</option>
          {countryOptions.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
      >
        Apply filters
      </button>
      <Link
        href={
          query.search
            ? `/companies?search=${encodeURIComponent(query.search)}`
            : "/companies"
        }
        className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
      >
        Clear
      </Link>
    </form>
  );
}
