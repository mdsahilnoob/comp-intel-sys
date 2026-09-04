import type { Metadata } from "next"

import { ComparisonChart } from "@/components/charts/comparison-chart"
import { ComparisonSelector } from "@/components/compare/comparison-selector"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/section-heading"
import { EmptyState } from "@/components/shared/empty-state"
import { MetricCard } from "@/components/shared/metric-card"
import { formatCompactCurrency, formatDetailedCurrency } from "@/lib/currency"
import { toSingleValueRecord } from "@/lib/urls"
import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository"
import { getComparisonPageData } from "@/server/services/comparison-service"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Compare compensation" }

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toSingleValueRecord(await searchParams)
  const data = await getComparisonPageData(query)
  const catalog = await getCatalogOptionsFromRepository()
  return <PageContainer className="pb-16 pt-10 sm:pt-14"><SectionHeading eyebrow="Level comparison" title="Put offers on the same grid" description="Compare canonical career levels across companies, roles, and cities. The raw company level always stays visible." /><div className="mt-7"><ComparisonSelector catalog={catalog} entries={data.entries} roleSlug={data.roleSlug} locationSlug={data.locationSlug} /></div>{data.invalidTokens.length > 0 && <p className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">Could not resolve: {data.invalidTokens.join(", ")}. Choose from the catalog below.</p>}{data.entries.length ? <><section className="mt-8 grid gap-3 sm:grid-cols-3">{data.entries.map((entry) => <MetricCard key={entry.selection.companySlug + entry.companyLevelCode} label={`${entry.companyName} ${entry.companyLevelCode}`} value={formatCompactCurrency(entry.metrics.medianTc)} detail={`${entry.metrics.recordCount} records · ${entry.canonicalLevelName}`} />)}</section><section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"><SectionHeading eyebrow="Median total comp" title="Where the packages land" description="Same role and location for each selected level." /><div className="mt-5"><ComparisonChart entries={data.entries} /></div></div><div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"><SectionHeading eyebrow="Breakdown" title="Compensation components" /><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[460px] text-left text-sm"><thead className="border-b border-border text-xs text-muted-foreground"><tr><th className="py-3">Level</th><th className="py-3 text-right">Base</th><th className="py-3 text-right">Stock</th><th className="py-3 text-right">Bonus</th></tr></thead><tbody className="divide-y divide-border/70">{data.entries.map((entry) => <tr key={entry.selection.companySlug + entry.companyLevelCode}><td className="py-3 font-semibold">{entry.companyName} {entry.companyLevelCode}<span className="block text-xs font-normal text-muted-foreground">{entry.canonicalLevelName}</span></td><td className="py-3 text-right" title={formatDetailedCurrency(entry.metrics.baseSalary)}>{formatCompactCurrency(entry.metrics.baseSalary)}</td><td className="py-3 text-right" title={formatDetailedCurrency(entry.metrics.stockAnnual)}>{formatCompactCurrency(entry.metrics.stockAnnual)}</td><td className="py-3 text-right" title={formatDetailedCurrency(entry.metrics.bonusAnnual)}>{formatCompactCurrency(entry.metrics.bonusAnnual)}</td></tr>)}</tbody></table></div></div></section><p className="mt-8 text-xs leading-5 text-muted-foreground">Comparison is directional: canonical mappings are a research aid, not a claim that company ladders or scopes are interchangeable.</p></> : <div className="mt-8"><EmptyState title="Choose at least one level" description="Use the selectors above to build a useful comparison." clearHref="/compare" /></div>}</PageContainer>
}
