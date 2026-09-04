import { formatCompactCurrency, formatDetailedCurrency } from "@/lib/currency"
import type { ExplorerResult } from "@/server/domain"
import { MetricCard } from "@/components/shared/metric-card"

export function ExplorerMetrics({ aggregates }: { aggregates: ExplorerResult["aggregates"] }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Matching records" value={aggregates.count.toLocaleString("en-IN")} detail="Anonymous submissions" /><MetricCard label="Median total comp" value={formatCompactCurrency(aggregates.median)} detail={formatDetailedCurrency(aggregates.median)} /><MetricCard label="P25 — P75" value={`${formatCompactCurrency(aggregates.p25)} — ${formatCompactCurrency(aggregates.p75)}`} detail="Middle half of the market" /><MetricCard label="P90 total comp" value={formatCompactCurrency(aggregates.p90)} detail="Upper market signal" /></div>
}
