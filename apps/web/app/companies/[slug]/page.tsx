import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { CompanyDetail } from "@/components/company/company-detail";
import { LevelChart } from "@/components/charts/level-chart";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/layout/section-heading";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatDetailedCurrency } from "@/lib/currency";
import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository";
import {
  getAiCompanyDetail,
  getCompanyDetail,
} from "@/server/services/company-service";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    role?: string | string[];
    location?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const aiCompany = await getAiCompanyDetail(slug);
    if (aiCompany) {
      return {
        title: `${aiCompany.name} AI company profile`,
        description: aiCompany.description,
      };
    }
    const data = await getCompanyDetail(slug);
    return { title: `${data.company.name} compensation` };
  } catch {
    return { title: "Company profile" };
  }
}

export default async function CompanyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const aiCompany = await getAiCompanyDetail(slug);
  if (aiCompany) {
    return <CompanyDetail company={aiCompany} />;
  }

  const query = await searchParams;
  const role = Array.isArray(query.role) ? query.role[0] : query.role;
  const location = Array.isArray(query.location)
    ? query.location[0]
    : query.location;
  let detail;
  try {
    detail = await getCompanyDetail(
      slug,
      role || "software-engineer",
      location,
    );
  } catch {
    notFound();
  }
  const catalog = await getCatalogOptionsFromRepository();
  if (!detail) notFound();
  const roles = catalog.roles;
  return (
    <PageContainer className="pb-16 pt-10 sm:pt-14">
      <Link
        href="/companies"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← All companies
      </Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-4xl font-bold tracking-[-0.035em]">
              {detail.company.name}
            </h1>
            <Badge>{detail.company.industry ?? "Technology"}</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            A focused compensation view for {detail.selectedRole.toLowerCase()}{" "}
            in {detail.selectedLocation ?? "all locations"}.{" "}
            {detail.recordCount.toLocaleString("en-IN")} records currently
            match.
          </p>
        </div>
        {detail.company.website && (
          <a
            href={detail.company.website}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Company website ↗
          </a>
        )}
      </div>
      <form
        className="mt-8 grid gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        method="get"
      >
        <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
          Role
          <select
            name="role"
            defaultValue={role || "software-engineer"}
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {roles.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground">
          Location
          <select
            name="location"
            defaultValue={location || ""}
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All locations</option>
            {catalog.locations.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.city}
              </option>
            ))}
          </select>
        </label>
        <button
          className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          type="submit"
        >
          Update view
        </button>
      </form>
      <section className="mt-10">
        <SectionHeading
          eyebrow="Signal"
          title="Package distribution"
          description="Median and percentile context help prevent one offer from becoming the whole story."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Median total comp"
            value={formatCompactCurrency(
              detail.summary.totalCompensation.median,
            )}
            detail={formatDetailedCurrency(
              detail.summary.totalCompensation.median,
            )}
          />
          <MetricCard
            label="P25 total comp"
            value={formatCompactCurrency(detail.summary.totalCompensation.p25)}
            detail="Lower quartile"
          />
          <MetricCard
            label="P75 total comp"
            value={formatCompactCurrency(detail.summary.totalCompensation.p75)}
            detail="Upper quartile"
          />
          <MetricCard
            label="Records"
            value={detail.recordCount.toLocaleString("en-IN")}
            detail="Matching observations"
          />
        </div>
      </section>
      <section className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Median total compensation by level</CardTitle>
          </CardHeader>
          <CardContent>
            <LevelChart levels={detail.levels} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How levels map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2">Raw level</th>
                    <th className="py-2">Shared level</th>
                    <th className="py-2 text-right">Median TC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {detail.levels.map((level) => (
                    <tr key={level.levelCode}>
                      <td className="py-3 font-semibold">
                        {level.levelCode}
                        {level.displayName ? (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({level.displayName})
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {level.canonicalLevelName}
                      </td>
                      <td
                        className="py-3 text-right font-semibold text-primary"
                        title={formatDetailedCurrency(level.medianTc)}
                      >
                        {formatCompactCurrency(level.medianTc)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
      <p className="mt-8 text-xs leading-5 text-muted-foreground">
        Shared career levels are directional mappings maintained by CompGrid.
        They improve comparability, but they do not claim equivalence between
        companies. Stock and bonus are annualized estimates where supplied.
      </p>
    </PageContainer>
  );
}
