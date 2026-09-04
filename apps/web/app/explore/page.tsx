import type { Metadata } from "next"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/section-heading"
import { CompensationTable } from "@/components/explorer/compensation-table"
import { ExplorerMetrics } from "@/components/explorer/explorer-metrics"
import { FilterBar } from "@/components/explorer/filter-bar"
import { Pagination } from "@/components/explorer/pagination"
import { EmptyState } from "@/components/shared/empty-state"
import { toSingleValueRecord } from "@/lib/urls"
import { getExplorerPageData } from "@/server/services/compensation-service"
import { parseExplorerQuery } from "@/server/validation/schemas"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Explore compensation" }

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const filters = parseExplorerQuery(toSingleValueRecord(await searchParams))
  const { result, catalog } = await getExplorerPageData(filters)
  const start =
    result.pagination.total === 0
      ? 0
      : (filters.page - 1) * filters.limit + 1
  const end = Math.min(filters.page * filters.limit, result.pagination.total)

  return (
    <PageContainer className="pb-16 pt-10 sm:pt-14">
      <section className="max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          India&apos;s compensation map
        </p>
        <h1 className="max-w-2xl font-heading text-4xl font-bold tracking-[-0.04em] text-balance sm:text-6xl">
          CompGrid
        </h1>
        <p className="mt-4 max-w-2xl font-heading text-xl font-medium leading-8 text-foreground sm:text-2xl">
          Understand what your compensation is really worth across companies,
          levels, roles, and locations.
        </p>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Explore normalized, anonymous compensation data for the Indian
          technology market. Start with the level, then compare the package.
        </p>
      </section>
      <section className="mt-10 grid gap-4 rounded-2xl border border-primary/15 bg-primary/[0.045] p-5 sm:grid-cols-[auto_1fr] sm:items-start sm:p-6">
        <div className="grid size-11 place-items-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">
          01
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold">
            Levels first. Titles second.
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            Company titles are mapped to a shared career ladder so Google L4,
            Amazon L5, and Microsoft 63 can be compared without pretending they
            are identical. Keep the mapping visible, then use the raw company
            level for context.
          </p>
        </div>
      </section>
      <div className="mt-8">
        <FilterBar catalog={catalog} filters={filters} />
      </div>
      <section className="mt-8">
        <SectionHeading
          eyebrow="Market view"
          title="What the current slice says"
          description={`${result.pagination.total.toLocaleString("en-IN")} matching records · ${start}–${end} shown`}
        />
        <div className="mt-4">
          <ExplorerMetrics aggregates={result.aggregates} />
        </div>
      </section>
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Records"
            title="Compensation submissions"
            description="Annual INR values. Hover abbreviated amounts for the full figure."
          />
          <span className="hidden text-xs text-muted-foreground sm:block">
            Sort from any column
          </span>
        </div>
        <div className="mt-4">
          {result.data.length > 0 ? (
            <CompensationTable records={result.data} filters={filters} />
          ) : (
            <EmptyState
              title="No records match those filters"
              description="Try widening the range or clearing one of the filters to see more market data."
            />
          )}
        </div>
        <div className="mt-5">
          <Pagination
            filters={filters}
            totalPages={result.pagination.totalPages}
          />
        </div>
      </section>
      <p className="mt-10 text-xs leading-5 text-muted-foreground">
        Demo mode is active when no database connection is configured. Values
        are deterministic sample records for exploring the product shape, not a
        compensation guarantee.
      </p>
    </PageContainer>
  )
}
