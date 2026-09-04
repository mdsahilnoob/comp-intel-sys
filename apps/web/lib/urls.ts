import type { ExplorerFilters, ExplorerSort, SortDirection } from "@/server/domain"

type ExplorerOverrides = Partial<
  ExplorerFilters & { sort: ExplorerSort; direction: SortDirection }
>

export function createExplorerHref(
  filters: ExplorerFilters,
  overrides: ExplorerOverrides = {},
) {
  const next = { ...filters, ...overrides }
  const params = new URLSearchParams()

  const values: Record<string, string | number | undefined> = {
    company: next.company,
    role: next.role,
    level: next.level,
    location: next.location,
    minTc: next.minTc,
    maxTc: next.maxTc,
    minExperience: next.minExperience,
    maxExperience: next.maxExperience,
    sort: next.sort === "totalCompensation" ? undefined : next.sort,
    direction:
      next.direction === "desc" && next.sort === "totalCompensation"
        ? undefined
        : next.direction,
    page: next.page === 1 ? undefined : next.page,
    limit: next.limit === 25 ? undefined : next.limit,
  }

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value))
    }
  }

  const query = params.toString()
  return query ? `/?${query}` : "/"
}

export function toSingleValueRecord(
  values: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  ) as Record<string, string | undefined>
}

export function createComparisonHref(values: {
  a?: string
  b?: string
  c?: string
  role?: string
  location?: string
}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `/compare?${query}` : "/compare"
}
