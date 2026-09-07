import { ArrowUpRight, Package } from "lucide-react";
import Link from "next/link";

import {
  getAiCategoryLabel,
  getAiCountryLabel,
  getAiStatusLabel,
  type AiCompanyDirectoryEntry,
} from "@/server/ai-companies";
import { CompanyLogo } from "@/components/company/company-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CompanyCard({ company }: { company: AiCompanyDirectoryEntry }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <CardHeader className="gap-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyLogo name={company.name} logoUrl={company.logoUrl} />
            <div className="min-w-0">
              <h2 className="truncate font-heading text-lg font-bold tracking-tight">
                {company.name}
              </h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {company.categories[0]?.name ?? getAiCategoryLabel("ai-lab")} ·{" "}
                {getAiCountryLabel(company.country)}
              </p>
            </div>
          </div>
          {company.featured ? <Badge>Featured</Badge> : null}
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {company.description}
        </p>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4 pt-0">
        <div className="flex flex-wrap gap-1.5">
          {company.capabilities.slice(0, 3).map((capability) => (
            <Badge key={capability} variant="outline">
              {capability}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Package className="size-3.5" aria-hidden="true" />
            {company.productCount}{" "}
            {company.productCount === 1 ? "product" : "products"}
          </span>
          <span>{getAiStatusLabel(company.status)}</span>
        </div>
        <Link
          href={`/companies/${company.slug}`}
          className="inline-flex min-h-10 items-center justify-between rounded-lg border border-border px-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
        >
          View company
          <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
