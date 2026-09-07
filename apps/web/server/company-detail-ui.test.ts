import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AiCompanyDetailData } from "@/server/ai-companies";
import { CompanyDetail } from "@/components/company/company-detail";

const detail: AiCompanyDetailData = {
  id: 10_000,
  name: "OpenAI",
  slug: "openai",
  description: "Builds frontier AI models and products.",
  website: "https://openai.com",
  logoUrl: null,
  city: "San Francisco",
  country: "US",
  foundedYear: 2015,
  status: "GROWTH",
  categories: [{ name: "AI Labs", slug: "ai-lab" }],
  capabilities: ["LLMs", "Developer API"],
  productCount: 2,
  featured: true,
  products: [
    {
      name: "ChatGPT",
      slug: "chatgpt",
      description: "An everyday conversational assistant.",
      category: "Conversational AI",
    },
    {
      name: "OpenAI API",
      slug: "openai-api",
      description: "Model APIs for intelligent products.",
      category: "Developer Platform",
    },
  ],
  relatedCompanies: [
    {
      id: 10_001,
      name: "Anthropic",
      slug: "anthropic",
      description: "Builds reliable AI systems.",
      logoUrl: null,
      city: "San Francisco",
      country: "US",
      foundedYear: 2021,
      status: "GROWTH",
      categories: [{ name: "AI Labs", slug: "ai-lab" }],
      capabilities: ["LLMs"],
      productCount: 2,
      featured: true,
    },
  ],
};

describe("AI company detail UI", () => {
  it("renders overview, metadata, products, capabilities, and related companies", () => {
    const markup = renderToStaticMarkup(
      createElement(CompanyDetail, { company: detail }),
    );

    expect(markup).toContain("OpenAI");
    expect(markup).toContain("2015");
    expect(markup).toContain("Products &amp; tools");
    expect(markup).toContain("ChatGPT");
    expect(markup).toContain("Developer API");
    expect(markup).toContain("Related companies");
    expect(markup).toContain('href="/companies/anthropic"');
  });
});
