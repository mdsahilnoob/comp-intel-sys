import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/layout/section-heading";
import { CompanyDirectory } from "@/components/company/company-directory";
import { CompanyFilters } from "@/components/company/company-filters";
import { CompanyPagination } from "@/components/company/company-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toSingleValueRecord } from "@/lib/urls";
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
    <PageContainer className="pb-16 pt-10 sm:pt-14">
      <SectionHeading
        eyebrow="AI Companies"
        title="Discover companies shaping artificial intelligence."
        description="Explore the labs, infrastructure teams, developer platforms, and products moving the AI ecosystem forward."
      />
      <CompanyFilters query={query} categories={categories} />
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {result.pagination.total.toLocaleString("en-US")}{" "}
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
      <section className="mt-16 border-t border-border/70 pt-8">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Compare the market by employer
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Looking for compensation context? Compare company levels, roles,
          locations, and total compensation in the explorer.
        </p>
        <Link
          href="/explore"
          className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-input px-3.5 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
        >
          Explore compensation →
        </Link>
      </section>
    </PageContainer>
  );
}
