import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/layout/section-heading";
import { CompanyDirectory } from "@/components/company/company-directory";
import { CompanyDirectoryFooter } from "@/components/company/company-directory-footer";
import { CompaniesSearch } from "@/components/company/companies-search";
import { CompanyPagination } from "@/components/company/company-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toSingleValueRecord } from "@/lib/urls";
import {
  AI_COMPANY_STATUSES,
  AI_COUNTRY_OPTIONS,
} from "@/server/ai-companies";
import {
  getAiCompanyCategories,
  getAiCompanyDirectory,
} from "@/server/services/company-service";
import { companiesQuerySchema } from "@/server/validation/schemas";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "AI Companies",
  description:
    "Discover companies building the AI ecosystem across labs, tools, infrastructure, and robotics.",
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = companiesQuerySchema.safeParse(toSingleValueRecord(params));
  const query = parsed.success ? parsed.data : companiesQuerySchema.parse({});
  const [result, categories] = await Promise.all([
    getAiCompanyDirectory(query),
    getAiCompanyCategories(),
  ]);

  return (
    <PageContainer className="pb-16 pt-6 sm:pt-10">
      <div className="mb-8 max-w-3xl">
        <CompaniesSearch
          query={query}
          categories={categories}
          countryOptions={AI_COUNTRY_OPTIONS}
          statusOptions={AI_COMPANY_STATUSES}
        />
      </div>
      <SectionHeading
        eyebrow="AI Companies"
        title="Discover companies shaping artificial intelligence."
        description="Explore the labs, infrastructure teams, developer platforms, and products moving the AI ecosystem forward."
      />
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {result.pagination.total.toLocaleString("en-US")} {" "}
          {result.pagination.total === 1 ? "company" : "companies"}
        </p>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Demo ecosystem catalog
        </p>
      </div>
      <div className="mt-4">
        {result.data.length ? (
          <CompanyDirectory companies={result.data} />
        ) : (
          <EmptyState
            title="No companies found"
            description="Try another category or clear your filters."
            clearHref="/companies"
          />
        )}
      </div>
      <CompanyPagination
        query={query}
        totalPages={result.pagination.totalPages}
      />
      <CompanyDirectoryFooter total={result.pagination.total} />
    </PageContainer>
  );
}
