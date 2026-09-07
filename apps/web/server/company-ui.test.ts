import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AiCompanyDirectoryEntry } from "@/server/ai-companies";
import { createCompanyHref } from "@/lib/urls";
import { CompanyCard } from "@/components/company/company-card";

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
});
