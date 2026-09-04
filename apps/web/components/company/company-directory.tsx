import Link from "next/link"

import { formatCompactCurrency, formatDetailedCurrency } from "@/lib/currency"
import type { CompanyDirectoryEntry } from "@/server/domain"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CompanyDirectory({ companies }: { companies: CompanyDirectoryEntry[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{companies.map((company) => <Card key={company.id} className="transition-transform hover:-translate-y-0.5"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle><Link href={`/companies/${company.slug}`} className="hover:text-primary">{company.name}</Link></CardTitle><p className="mt-1 text-sm text-muted-foreground">{company.industry ?? "Technology"}</p></div><Badge variant="outline">{company.recordCount.toLocaleString("en-IN")} rows</Badge></div></CardHeader><CardContent><div className="flex items-end justify-between gap-3 border-t border-border/70 pt-4"><div><p className="text-xs text-muted-foreground">Software engineer median</p><p className="mt-1 font-heading text-xl font-bold text-primary" title={formatDetailedCurrency(company.medianSoftwareEngineerTc)}>{formatCompactCurrency(company.medianSoftwareEngineerTc)}</p></div><Link href={`/companies/${company.slug}`} className="text-sm font-semibold text-primary hover:underline">View profile →</Link></div></CardContent></Card>)}</div>
}
