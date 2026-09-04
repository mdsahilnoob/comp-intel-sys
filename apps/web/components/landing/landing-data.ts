export type HeroSample = {
  id: string
  company: string
  mark: string
  level: string
  canonicalLevel: string
  location: string
  total: number
  base: number
  stock: number
  bonus: number
  percentile: number
  trend: number[]
}

export const heroSamples: HeroSample[] = [
  {
    id: "google-l4",
    company: "Google",
    mark: "G",
    level: "L4",
    canonicalLevel: "MID",
    location: "Bengaluru",
    total: 73,
    base: 46,
    stock: 20,
    bonus: 7,
    percentile: 62,
    trend: [44, 49, 48, 57, 55, 65, 73],
  },
  {
    id: "amazon-l5",
    company: "Amazon",
    mark: "A",
    level: "L5",
    canonicalLevel: "MID",
    location: "Bengaluru",
    total: 61,
    base: 39,
    stock: 15,
    bonus: 7,
    percentile: 55,
    trend: [39, 44, 42, 49, 48, 55, 61],
  },
  {
    id: "meta-e4",
    company: "Meta",
    mark: "M",
    level: "E4",
    canonicalLevel: "MID",
    location: "Bengaluru",
    total: 86,
    base: 52,
    stock: 26,
    bonus: 8,
    percentile: 71,
    trend: [51, 56, 58, 64, 67, 78, 86],
  },
  {
    id: "microsoft-63",
    company: "Microsoft",
    mark: "▦",
    level: "63",
    canonicalLevel: "MID",
    location: "Bengaluru",
    total: 54,
    base: 36,
    stock: 12,
    bonus: 6,
    percentile: 48,
    trend: [32, 36, 37, 43, 42, 49, 54],
  },
]

export const tickerItems = [
  "Google L4 · ₹73L",
  "Amazon L5 · ₹61L",
  "Meta E4 · ₹86L",
  "Microsoft 63 · ₹54L",
  "Atlassian P40 · ₹65L",
  "Uber L4 · ₹79L",
  "Razorpay SDE II · ₹52L",
]

export type BreakdownSample = {
  id: string
  company: string
  level: string
  total: number
  base: number
  stock: number
  bonus: number
}

export const breakdownSamples: BreakdownSample[] = [
  { id: "google", company: "Google", level: "L4", total: 73, base: 46, stock: 20, bonus: 7 },
  { id: "amazon", company: "Amazon", level: "L5", total: 61, base: 39, stock: 15, bonus: 7 },
  { id: "meta", company: "Meta", level: "E4", total: 86, base: 52, stock: 26, bonus: 8 },
]

export const comparisonCompanies = [
  { company: "Google", level: "L4", total: 73, base: 46, stock: 20, bonus: 7, p75: 92, experience: "4–7 yrs" },
  { company: "Amazon", level: "L5", total: 61, base: 39, stock: 15, bonus: 7, p75: 79, experience: "4–8 yrs" },
  { company: "Microsoft", level: "63", total: 54, base: 36, stock: 12, bonus: 6, p75: 70, experience: "3–7 yrs" },
]

export const careerProgression = [
  { level: "ENTRY", value: 35, scope: "Owns a well-defined slice" },
  { level: "MID", value: 60, scope: "Ships independently" },
  { level: "SENIOR", value: 90, scope: "Leads a system" },
  { level: "STAFF", value: 130, scope: "Sets technical direction" },
  { level: "PRINCIPAL", value: 180, scope: "Shapes the organization" },
]

export const pipelineStages = [
  "Normalize Company",
  "Normalize Role",
  "Resolve Level",
  "Normalize Location",
  "Calculate TC",
  "Deduplicate",
]

export const dashboardRows = [
  { company: "Google", level: "L4", canonical: "MID", total: 73, mix: "63 / 27 / 10" },
  { company: "Meta", level: "E4", canonical: "MID", total: 86, mix: "60 / 30 / 10" },
  { company: "Amazon", level: "L5", canonical: "MID", total: 61, mix: "64 / 25 / 11" },
  { company: "Microsoft", level: "63", canonical: "MID", total: 54, mix: "67 / 22 / 11" },
  { company: "Atlassian", level: "P40", canonical: "MID", total: 65, mix: "62 / 28 / 10" },
]

export const levelMappings = [
  ["Google", "L4"],
  ["Amazon", "L5"],
  ["Meta", "E4"],
  ["Microsoft", "63"],
]

export const featureModules = [
  {
    eyebrow: "LEVEL NORMALIZATION",
    title: "Titles vary. Scope travels.",
    body: "Compare company-specific levels through a consistent career framework while keeping the raw level visible.",
    type: "levels",
  },
  {
    eyebrow: "COMPENSATION STRUCTURE",
    title: "See what the number is made of.",
    body: "Base salary, annualized equity, and bonus become legible before they become one total.",
    type: "composition",
  },
  {
    eyebrow: "MARKET DISTRIBUTION",
    title: "Position, not just average.",
    body: "Use median and percentiles to understand where an offer sits in the market slice.",
    type: "distribution",
  },
  {
    eyebrow: "DATA NORMALIZATION",
    title: "Messy inputs, cleaner comparisons.",
    body: "Normalize company, role, level, and location names before a record reaches the grid.",
    type: "normalization",
  },
] as const
