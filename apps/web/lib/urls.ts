import type {
  ExplorerFilters,
  ExplorerSort,
  SortDirection,
} from "@/server/domain";
import type { AiCompanyQuery } from "@/server/ai-companies";

type ExplorerOverrides = Partial<
  ExplorerFilters & { sort: ExplorerSort; direction: SortDirection }
>;

export function createExplorerHref(
  filters: ExplorerFilters,
  overrides: ExplorerOverrides = {},
) {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

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
  };

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `/explore?${query}` : "/explore";
}

export function toSingleValueRecord(
  values: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  ) as Record<string, string | undefined>;
}

export function createComparisonHref(values: {
  a?: string;
  b?: string;
  c?: string;
  role?: string;
  location?: string;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/compare?${query}` : "/compare";
}

type CompanyHrefValues = Partial<
  Pick<
    AiCompanyQuery,
    "search" | "category" | "country" | "status" | "sort" | "page" | "limit"
  >
>;

export function createCompanyHref(
  values: CompanyHrefValues,
  overrides: CompanyHrefValues = {},
) {
  const next = { ...values, ...overrides };
  const params = new URLSearchParams();
  const entries: Record<string, string | number | undefined> = {
    search: next.search,
    category: next.category,
    country: next.country,
    status: next.status,
    sort: next.sort === "popular" ? undefined : next.sort,
    page: next.page === 1 ? undefined : next.page,
    limit: next.limit === 24 ? undefined : next.limit,
  };

  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `/companies?${query}` : "/companies";
}
