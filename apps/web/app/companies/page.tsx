import type { Metadata } from "next"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/section-heading"
import { CompanyDirectory } from "@/components/company/company-directory"
import { EmptyState } from "@/components/shared/empty-state"
import { Input } from "@/components/ui/input"
import { getCompanyDirectory } from "@/server/services/company-service"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Company directory" }

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ search?: string | string[] }> }) {
  const params = await searchParams
  const search = Array.isArray(params.search) ? params.search[0] : params.search
  const companies = await getCompanyDirectory(search)
  return <PageContainer className="pb-16 pt-10 sm:pt-14"><SectionHeading eyebrow="Company directory" title="Compare the market by employer" description="Company pages keep raw levels visible while showing a shared career-level mapping." /><form className="mt-7 flex max-w-xl gap-2" method="get"><label className="sr-only" htmlFor="company-search">Search companies</label><Input id="company-search" name="search" defaultValue={search} placeholder="Search Google, fintech, e-commerce…" /><button className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90" type="submit">Search</button></form><div className="mt-8">{companies.length ? <CompanyDirectory companies={companies} /> : <EmptyState title="No companies found" description="Try a company name, slug, or industry." clearHref="/companies" />}</div></PageContainer>
}
