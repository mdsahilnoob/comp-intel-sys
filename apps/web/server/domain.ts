import type { AnalyticsSummary } from "@/server/analytics/statistics"

export type CareerLevelCode =
  | "ENTRY"
  | "MID"
  | "SENIOR"
  | "STAFF"
  | "PRINCIPAL"
  | "DISTINGUISHED"

export interface CompanyDefinition {
  name: string
  slug: string
  industry: string
  website: string
  tier: number
  aliases: string[]
  levels: CompanyLevelDefinition[]
}

export interface RoleDefinition {
  name: string
  slug: string
  category: string
  aliases: string[]
}

export interface CareerLevelDefinition {
  code: CareerLevelCode
  name: string
  rank: number
}

export interface CompanyLevelDefinition {
  code: string
  careerLevelCode: CareerLevelCode
  displayName?: string
  rank: number
  minYearsExperience: number
  maxYearsExperience: number
}

export interface LocationDefinition {
  city: string
  state: string
  country: string
  slug: string
}

export interface CatalogCompany extends CompanyDefinition {
  id: number
}

export interface CatalogRole extends RoleDefinition {
  id: number
}

export interface CatalogCareerLevel extends CareerLevelDefinition {
  id: number
}

export interface CatalogCompanyLevel extends CompanyLevelDefinition {
  id: number
  companyId: number
  careerLevelId: number
}

export interface CatalogLocation extends LocationDefinition {
  id: number
}

export interface CompensationRecord {
  id: number
  company: { id: number; name: string; slug: string }
  role: { id: number; name: string; slug: string }
  companyLevel: {
    id: number
    code: string
    careerLevel: { code: CareerLevelCode; name: string; rank: number }
  }
  location: { id: number; city: string; slug: string }
  baseSalary: number
  stockAnnual: number
  bonusAnnual: number
  totalCompensation: number
  currency: string
  yearsExperience: number
  compensationYear: number
  verified: boolean
  source: string
  createdAt: string
}

export interface CatalogOptions {
  companies: CatalogCompany[]
  roles: CatalogRole[]
  careerLevels: CatalogCareerLevel[]
  companyLevels: CatalogCompanyLevel[]
  locations: CatalogLocation[]
}

export interface ExplorerFilters {
  company?: string
  role?: string
  level?: CareerLevelCode
  location?: string
  minTc?: number
  maxTc?: number
  minExperience?: number
  maxExperience?: number
  sort: ExplorerSort
  direction: SortDirection
  page: number
  limit: number
}

export type ExplorerSort =
  | "totalCompensation"
  | "baseSalary"
  | "stockAnnual"
  | "bonusAnnual"
  | "yearsExperience"
  | "createdAt"

export type SortDirection = "asc" | "desc"

export interface ExplorerResult {
  data: CompensationRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  aggregates: {
    count: number
    average: number | null
    median: number | null
    p25: number | null
    p50: number | null
    p75: number | null
    p90: number | null
    min: number | null
    max: number | null
  }
}

export interface CompanyDirectoryEntry {
  id: number
  name: string
  slug: string
  industry: string | null
  recordCount: number
  medianSoftwareEngineerTc: number | null
}

export interface CompanyLevelAnalytics {
  levelCode: string
  displayName: string | null
  canonicalLevel: CareerLevelCode
  canonicalLevelName: string
  canonicalRank: number
  baseSalary: number | null
  stockAnnual: number | null
  bonusAnnual: number | null
  medianTc: number | null
  recordCount: number
}

export interface CompanyDetailData {
  company: {
    id: number
    name: string
    slug: string
    industry: string | null
    website: string | null
  }
  recordCount: number
  summary: {
    totalCompensation: AnalyticsSummary
    baseSalary: AnalyticsSummary
    stockAnnual: AnalyticsSummary
    bonusAnnual: AnalyticsSummary
  }
  levels: CompanyLevelAnalytics[]
  selectedRole: string
  selectedLocation: string | null
}

export interface ComparisonEntryInput {
  companySlug: string
  companyLevelCode: string
  roleSlug: string
  locationSlug: string
}

export interface ComparisonEntryData {
  selection: ComparisonEntryInput
  companyName: string
  roleName: string
  companyLevelCode: string
  canonicalLevel: CareerLevelCode
  canonicalLevelName: string
  locationCity: string
  metrics: {
    baseSalary: number | null
    stockAnnual: number | null
    bonusAnnual: number | null
    medianTc: number | null
    p75Tc: number | null
    recordCount: number
    minExperience: number | null
    maxExperience: number | null
  }
}

export interface SubmissionResult {
  id: number
  fingerprint: string
  company: { id: number; name: string; slug: string }
  role: { id: number; name: string; slug: string }
  companyLevel: {
    id: number
    code: string
    canonicalLevel: CareerLevelCode
    canonicalLevelName: string
  }
  location: { id: number; city: string; slug: string }
  baseSalary: number
  stockAnnual: number
  bonusAnnual: number
  totalCompensation: number
  currency: string
  yearsExperience: number
  compensationYear: number
  source: string
}
