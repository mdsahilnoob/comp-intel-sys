import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AiCompanyDirectoryEntry } from "@/server/ai-companies";
import { createCompanyHref } from "@/lib/urls";
import { CompanyCard } from "@/components/company/company-card";
import { CompanyDirectoryFooter } from "@/components/company/company-directory-footer";
import { SiteFooter } from "@/components/layout/site-footer";

const openAi: AiCompanyDirectoryEntry = {
  id: 10_000,
  name: "OpenAI",
  slug: "openai",
  description: "Builds frontier AI models and products.",
  logoUrl: null,
  city: "San Francisco",
  country: "US",
  foundedYear: 2015,
  status: "GROWTH",
  categories: [{ name: "AI Labs", slug: "ai-lab" }],
  capabilities: ["LLMs", "Developer API"],
  productCount: 3,
  featured: true,
};

describe("AI company UI contracts", () => {
  it("creates shareable filter and pagination links", () => {
    expect(
      createCompanyHref({
        search: "openai",
        category: "ai-lab",
        country: "US",
        status: "GROWTH",
        sort: "popular",
        page: 1,
        limit: 24,
      }),
    ).toBe("/companies?search=openai&category=ai-lab&country=US&status=GROWTH");

    expect(
      createCompanyHref(
        { search: "openai", sort: "popular", page: 1, limit: 24 },
        { page: 2 },
      ),
    ).toBe("/companies?search=openai&page=2");
  });

  it("renders reusable company card content and detail link", () => {
    const markup = renderToStaticMarkup(
      createElement(CompanyCard, { company: openAi }),
    );

    expect(markup).toContain("OpenAI");
    expect(markup).toContain("Builds frontier AI models and products.");
    expect(markup).toContain("AI Labs");
    expect(markup).toContain("3 products");
    expect(markup).toContain('href="/companies/openai"');
  });

  it("renders the directory footer with live results and next steps", () => {
    const markup = renderToStaticMarkup(
      createElement(CompanyDirectoryFooter, { total: 12 }),
    );

    expect(markup).toContain("Compare the market by employer");
    expect(markup).toContain("12");
    expect(markup).toContain("matching companies");
    expect(markup).toContain('href="/explore"');
    expect(markup).toContain('href="/compare"');
  });

  it("keeps the shared footer above the fixed company sidebar", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter));

    expect(markup).toContain("site-footer");
    expect(markup).toContain("relative z-20");
  });
});
