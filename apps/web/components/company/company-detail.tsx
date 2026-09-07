import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import {
  getAiCountryLabel,
  getAiStatusLabel,
  type AiCompanyDetailData,
} from "@/server/ai-companies";
import { CompanyCard } from "@/components/company/company-card";
import { CompanyLogo } from "@/components/company/company-logo";
import { ProductCard } from "@/components/company/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function MetadataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="size-3.5 text-primary" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 font-heading text-base font-bold">{value}</p>
    </div>
  );
}

export function CompanyDetail({ company }: { company: AiCompanyDetailData }) {
  return (
    <PageContainer className="pb-16 pt-10 sm:pt-14">
      <Link
        href="/companies"
        className="inline-flex min-h-9 items-center text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
      >
        ← All companies
      </Link>

      <header className="mt-7 flex flex-col gap-6 border-b border-border/70 pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
          <CompanyLogo
            name={company.name}
            logoUrl={company.logoUrl}
            className="size-16 rounded-2xl text-lg sm:size-20"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {company.categories.map((category) => (
                <Badge key={category.slug} variant="outline">
                  {category.name}
                </Badge>
              ))}
              {company.featured ? <Badge>Featured</Badge> : null}
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
              {company.name}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{company.city}</span>
              <span aria-hidden="true">·</span>
              <span>{getAiCountryLabel(company.country)}</span>
              <span aria-hidden="true">·</span>
              <span>{getAiStatusLabel(company.status)}</span>
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {company.description}
            </p>
          </div>
        </div>
        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-input px-3.5 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
          >
            Visit website
            <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
          </a>
        ) : null}
      </header>

      <section
        className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Company metadata"
      >
        <MetadataItem
          icon={CalendarDays}
          label="Founded"
          value={String(company.foundedYear)}
        />
        <MetadataItem
          icon={MapPin}
          label="Location"
          value={`${company.city}, ${getAiCountryLabel(company.country)}`}
        />
        <MetadataItem
          icon={ShieldCheck}
          label="Status"
          value={getAiStatusLabel(company.status)}
        />
        <MetadataItem
          icon={Package}
          label="Products"
          value={String(company.productCount)}
        />
      </section>

      <section className="mt-12" aria-labelledby="company-overview">
        <h2
          id="company-overview"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          Overview
        </h2>
        <Card className="mt-4">
          <CardContent className="p-5 sm:p-6">
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {company.description} The profile brings together the company’s
              core products, capabilities, and place in the wider AI ecosystem.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12" aria-labelledby="company-products">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="company-products"
              className="font-heading text-2xl font-bold tracking-tight"
            >
              Products &amp; tools
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A compact view of what this company makes and ships.
            </p>
          </div>
          <Badge variant="outline">{company.products.length} listed</Badge>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {company.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="company-capabilities">
        <h2
          id="company-capabilities"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          Capabilities
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {company.capabilities.map((capability) => (
            <Badge key={capability} variant="secondary">
              {capability}
            </Badge>
          ))}
        </div>
      </section>

      {company.relatedCompanies.length ? (
        <section className="mt-12" aria-labelledby="related-companies">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2
                id="related-companies"
                className="font-heading text-2xl font-bold tracking-tight"
              >
                Related companies
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                More companies working in adjacent parts of the ecosystem.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {company.relatedCompanies.map((related) => (
              <CompanyCard key={related.id} company={related} />
            ))}
          </div>
        </section>
      ) : null}
    </PageContainer>
  );
}
