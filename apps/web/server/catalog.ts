import { normalizeCompanyName, normalizeRoleName } from "@/server/normalization/string-normalizer"
import type {
  CatalogCompany,
  CatalogCompanyLevel,
  CatalogCareerLevel,
  CatalogLocation,
  CatalogOptions,
  CatalogRole,
  CareerLevelDefinition,
  CompanyDefinition,
  CompanyLevelDefinition,
  LocationDefinition,
  RoleDefinition,
} from "@/server/domain"

const companyLevel = (
  code: string,
  careerLevelCode: CompanyLevelDefinition["careerLevelCode"],
  minYearsExperience: number,
  maxYearsExperience: number,
  displayName?: string,
): CompanyLevelDefinition => ({
  code,
  careerLevelCode,
  displayName,
  rank: minYearsExperience + maxYearsExperience,
  minYearsExperience,
  maxYearsExperience,
})

const standardLevels = [
  companyLevel("L1", "ENTRY", 0, 2),
  companyLevel("L2", "MID", 2, 5),
  companyLevel("L3", "SENIOR", 5, 9),
  companyLevel("L4", "STAFF", 8, 13),
  companyLevel("L5", "PRINCIPAL", 12, 18),
]

const enterpriseLevels = [
  companyLevel("L2", "ENTRY", 0, 2),
  companyLevel("L3", "MID", 2, 5),
  companyLevel("L4", "SENIOR", 5, 9),
  companyLevel("L5", "STAFF", 8, 13),
  companyLevel("L6", "PRINCIPAL", 12, 18),
]

export const CAREER_LEVEL_DEFINITIONS: CareerLevelDefinition[] = [
  { code: "ENTRY", name: "Entry", rank: 1 },
  { code: "MID", name: "Mid-level", rank: 2 },
  { code: "SENIOR", name: "Senior", rank: 3 },
  { code: "STAFF", name: "Staff", rank: 4 },
  { code: "PRINCIPAL", name: "Principal", rank: 5 },
  { code: "DISTINGUISHED", name: "Distinguished", rank: 6 },
]

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    name: "Software Engineer",
    slug: "software-engineer",
    category: "Engineering",
    aliases: [
      "SWE",
      "SDE",
      "Software Developer",
      "Software Development Engineer",
    ],
  },
  {
    name: "Data Scientist",
    slug: "data-scientist",
    category: "Data",
    aliases: ["Data Science", "Applied Scientist", "ML Scientist"],
  },
  {
    name: "Product Manager",
    slug: "product-manager",
    category: "Product",
    aliases: ["PM", "Product Lead", "Technical Product Manager"],
  },
  {
    name: "Engineering Manager",
    slug: "engineering-manager",
    category: "Engineering",
    aliases: ["EM", "Engineering Lead", "Software Engineering Manager"],
  },
]

export const LOCATION_DEFINITIONS: LocationDefinition[] = [
  { city: "Bengaluru", state: "Karnataka", country: "India", slug: "bengaluru" },
  { city: "Hyderabad", state: "Telangana", country: "India", slug: "hyderabad" },
  { city: "Pune", state: "Maharashtra", country: "India", slug: "pune" },
  { city: "Gurgaon", state: "Haryana", country: "India", slug: "gurgaon" },
  { city: "Mumbai", state: "Maharashtra", country: "India", slug: "mumbai" },
  { city: "Chennai", state: "Tamil Nadu", country: "India", slug: "chennai" },
]

export const COMPANY_DEFINITIONS: CompanyDefinition[] = [
  {
    name: "Google",
    slug: "google",
    industry: "Technology",
    website: "https://google.com",
    tier: 5,
    aliases: ["Google LLC", "Google India", "Google India Pvt Ltd", "Google Inc"],
    levels: [
      companyLevel("L3", "ENTRY", 0, 2),
      companyLevel("L4", "MID", 2, 5),
      companyLevel("L5", "SENIOR", 5, 9),
      companyLevel("L6", "STAFF", 8, 13),
      companyLevel("L7", "PRINCIPAL", 12, 18),
    ],
  },
  {
    name: "Amazon",
    slug: "amazon",
    industry: "Technology",
    website: "https://amazon.com",
    tier: 5,
    aliases: ["Amazon India", "Amazon Development Centre India"],
    levels: [
      companyLevel("L4", "ENTRY", 0, 2),
      companyLevel("L5", "MID", 2, 5),
      companyLevel("L6", "SENIOR", 5, 9),
      companyLevel("L7", "STAFF", 8, 13),
      companyLevel("L8", "PRINCIPAL", 12, 18),
    ],
  },
  {
    name: "Meta",
    slug: "meta",
    industry: "Technology",
    website: "https://meta.com",
    tier: 5,
    aliases: ["Meta Platforms", "Facebook", "Facebook India"],
    levels: [
      companyLevel("E3", "ENTRY", 0, 2),
      companyLevel("E4", "MID", 2, 5),
      companyLevel("E5", "SENIOR", 5, 9),
      companyLevel("E6", "STAFF", 8, 13),
      companyLevel("E7", "PRINCIPAL", 12, 18),
    ],
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    industry: "Technology",
    website: "https://microsoft.com",
    tier: 5,
    aliases: ["Microsoft India", "Microsoft Corporation"],
    levels: [
      companyLevel("59", "ENTRY", 0, 2),
      companyLevel("60", "ENTRY", 1, 3),
      companyLevel("61", "MID", 2, 5),
      companyLevel("62", "SENIOR", 5, 9),
      companyLevel("63", "MID", 3, 7, "Software Engineer II"),
      companyLevel("64", "STAFF", 8, 13),
      companyLevel("65", "PRINCIPAL", 12, 18),
    ],
  },
  {
    name: "Apple",
    slug: "apple",
    industry: "Technology",
    website: "https://apple.com",
    tier: 5,
    aliases: ["Apple India", "Apple Inc"],
    levels: enterpriseLevels,
  },
  {
    name: "Uber",
    slug: "uber",
    industry: "Mobility",
    website: "https://uber.com",
    tier: 4,
    aliases: ["Uber India", "Uber Technologies"],
    levels: standardLevels,
  },
  {
    name: "Atlassian",
    slug: "atlassian",
    industry: "Technology",
    website: "https://atlassian.com",
    tier: 4,
    aliases: ["Atlassian India"],
    levels: enterpriseLevels,
  },
  {
    name: "Adobe",
    slug: "adobe",
    industry: "Technology",
    website: "https://adobe.com",
    tier: 4,
    aliases: ["Adobe India", "Adobe Systems"],
    levels: standardLevels,
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    industry: "Enterprise software",
    website: "https://salesforce.com",
    tier: 4,
    aliases: ["Salesforce India"],
    levels: enterpriseLevels,
  },
  {
    name: "Oracle",
    slug: "oracle",
    industry: "Enterprise software",
    website: "https://oracle.com",
    tier: 3,
    aliases: ["Oracle India", "Oracle Corporation"],
    levels: standardLevels,
  },
  {
    name: "Flipkart",
    slug: "flipkart",
    industry: "E-commerce",
    website: "https://flipkart.com",
    tier: 4,
    aliases: ["Flipkart India"],
    levels: standardLevels,
  },
  {
    name: "Razorpay",
    slug: "razorpay",
    industry: "Fintech",
    website: "https://razorpay.com",
    tier: 4,
    aliases: ["Razorpay Software"],
    levels: standardLevels,
  },
  {
    name: "PhonePe",
    slug: "phonepe",
    industry: "Fintech",
    website: "https://phonepe.com",
    tier: 4,
    aliases: ["PhonePe India"],
    levels: standardLevels,
  },
  {
    name: "Swiggy",
    slug: "swiggy",
    industry: "Consumer technology",
    website: "https://swiggy.com",
    tier: 3,
    aliases: ["Swiggy India"],
    levels: standardLevels,
  },
  {
    name: "Zomato",
    slug: "zomato",
    industry: "Consumer technology",
    website: "https://zomato.com",
    tier: 3,
    aliases: ["Zomato India", "Eternal"],
    levels: standardLevels,
  },
  {
    name: "Meesho",
    slug: "meesho",
    industry: "E-commerce",
    website: "https://meesho.com",
    tier: 3,
    aliases: ["Meesho India"],
    levels: standardLevels,
  },
  {
    name: "CRED",
    slug: "cred",
    industry: "Fintech",
    website: "https://cred.club",
    tier: 3,
    aliases: ["CRED India", "Dreamplug"],
    levels: standardLevels,
  },
  {
    name: "Freshworks",
    slug: "freshworks",
    industry: "Enterprise software",
    website: "https://freshworks.com",
    tier: 3,
    aliases: ["Freshworks India", "Freshdesk"],
    levels: standardLevels,
  },
  {
    name: "Walmart",
    slug: "walmart",
    industry: "Retail technology",
    website: "https://walmart.com",
    tier: 4,
    aliases: ["Walmart Global Tech", "Walmart Labs"],
    levels: enterpriseLevels,
  },
  {
    name: "Intuit",
    slug: "intuit",
    industry: "Fintech software",
    website: "https://intuit.com",
    tier: 4,
    aliases: ["Intuit India"],
    levels: enterpriseLevels,
  },
]

let catalogCache: CatalogOptions | undefined

export function getCatalogOptions(): CatalogOptions {
  if (catalogCache) {
    return catalogCache
  }

  const careerLevels: CatalogCareerLevel[] = CAREER_LEVEL_DEFINITIONS.map(
    (definition, index) => ({ ...definition, id: 200 + index }),
  )
  const careersByCode = new Map(careerLevels.map((level) => [level.code, level]))
  const companies: CatalogCompany[] = COMPANY_DEFINITIONS.map(
    (definition, index) => ({ ...definition, id: index + 1 }),
  )
  const roles: CatalogRole[] = ROLE_DEFINITIONS.map((definition, index) => ({
    ...definition,
    id: 100 + index,
  }))
  const locations: CatalogLocation[] = LOCATION_DEFINITIONS.map(
    (definition, index) => ({ ...definition, id: 300 + index }),
  )
  const companyLevels: CatalogCompanyLevel[] = companies.flatMap((company) =>
    company.levels.map((definition, index) => ({
      ...definition,
      id: 1_000 + company.id * 100 + index,
      companyId: company.id,
      careerLevelId: careersByCode.get(definition.careerLevelCode)?.id ?? 200,
    })),
  )

  catalogCache = { companies, roles, careerLevels, companyLevels, locations }
  return catalogCache
}

export function resolveDemoCompany(input: string, catalog = getCatalogOptions()) {
  const normalizedInput = normalizeCompanyName(input)

  return catalog.companies.find(
    (company) =>
      normalizeCompanyName(company.name) === normalizedInput ||
      company.aliases.some(
        (alias) => normalizeCompanyName(alias) === normalizedInput,
      ),
  )
}

export function resolveDemoRole(input: string, catalog = getCatalogOptions()) {
  const normalizedInput = normalizeRoleName(input)

  return catalog.roles.find(
    (role) =>
      normalizeRoleName(role.name) === normalizedInput ||
      role.aliases.some((alias) => normalizeRoleName(alias) === normalizedInput),
  )
}
