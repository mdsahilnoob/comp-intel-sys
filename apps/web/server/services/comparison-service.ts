import type {
  CatalogOptions,
  ComparisonEntryData,
  ComparisonEntryInput,
} from "@/server/domain"
import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository"
import { getComparisonStats } from "@/server/repositories/compensation-repository"

export const DEFAULT_COMPARISON_TOKENS = [
  "google-l4",
  "amazon-l5",
  "microsoft-63",
]

export interface ComparisonPageData {
  entries: ComparisonEntryData[]
  invalidTokens: string[]
  roleSlug: string
  locationSlug: string
}

export function serializeComparisonEntry(input: ComparisonEntryInput) {
  return `${input.companySlug}-${input.companyLevelCode.toLowerCase()}`
}

function resolveComparisonToken(
  token: string,
  catalog: CatalogOptions,
  roleSlug: string,
  locationSlug: string,
): ComparisonEntryInput | undefined {
  const normalizedToken = token.trim().toLocaleLowerCase("en-IN")
  const company = catalog.companies.find((candidate) =>
    normalizedToken.startsWith(`${candidate.slug}-`),
  )

  if (!company) {
    return undefined
  }

  const code = normalizedToken.slice(company.slug.length + 1).toLocaleUpperCase("en-IN")
  const companyLevel = catalog.companyLevels.find(
    (candidate) => candidate.companyId === company.id && candidate.code.toUpperCase() === code,
  )

  if (!companyLevel) {
    return undefined
  }

  return {
    companySlug: company.slug,
    companyLevelCode: companyLevel.code,
    roleSlug,
    locationSlug,
  }
}

async function buildComparisonEntry(
  input: ComparisonEntryInput,
  catalog: CatalogOptions,
): Promise<ComparisonEntryData | undefined> {
  const company = catalog.companies.find(
    (candidate) => candidate.slug === input.companySlug,
  )
  const role = catalog.roles.find((candidate) => candidate.slug === input.roleSlug)
  const location = catalog.locations.find(
    (candidate) => candidate.slug === input.locationSlug,
  )
  const companyLevel = catalog.companyLevels.find(
    (candidate) =>
      candidate.companyId === company?.id && candidate.code === input.companyLevelCode,
  )
  const canonicalLevel = catalog.careerLevels.find(
    (candidate) => candidate.id === companyLevel?.careerLevelId,
  )

  if (!company || !role || !location || !companyLevel || !canonicalLevel) {
    return undefined
  }

  const metrics = await getComparisonStats(input)

  return {
    selection: input,
    companyName: company.name,
    roleName: role.name,
    companyLevelCode: companyLevel.code,
    canonicalLevel: canonicalLevel.code,
    canonicalLevelName: canonicalLevel.name,
    locationCity: location.city,
    metrics,
  }
}

export async function getComparisonPageData(query: {
  a?: string
  b?: string
  c?: string
  role?: string
  location?: string
}): Promise<ComparisonPageData> {
  const catalog = await getCatalogOptionsFromRepository()
  const roleSlug = catalog.roles.some((role) => role.slug === query.role)
    ? query.role ?? "software-engineer"
    : "software-engineer"
  const locationSlug = catalog.locations.some(
    (location) => location.slug === query.location,
  )
    ? query.location ?? "bengaluru"
    : "bengaluru"
  const tokens = [query.a, query.b, query.c].filter(
    (token): token is string => Boolean(token),
  )
  const requestedTokens = tokens.length > 0 ? tokens : DEFAULT_COMPARISON_TOKENS
  const invalidTokens: string[] = []
  const resolvedInputs = requestedTokens.flatMap((token) => {
    const input = resolveComparisonToken(token, catalog, roleSlug, locationSlug)
    if (!input) {
      invalidTokens.push(token)
      return []
    }
    return [input]
  })
  const entries = (await Promise.all(
    resolvedInputs.slice(0, 3).map((input) => buildComparisonEntry(input, catalog)),
  )).filter((entry): entry is ComparisonEntryData => Boolean(entry))

  return { entries, invalidTokens, roleSlug, locationSlug }
}
