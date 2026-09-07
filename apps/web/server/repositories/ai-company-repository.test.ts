import { describe, expect, it } from "vitest";

import type { AiCompanyQuery } from "@/server/ai-companies";
import {
  getDemoAiCompanyCategories,
  getDemoAiCompanyDetail,
  getDemoAiCompanyDirectory,
} from "@/server/repositories/ai-company-demo-repository";

const baseQuery: AiCompanyQuery = {
  sort: "popular",
  page: 1,
  limit: 24,
};

describe("demo AI company repository queries", () => {
  it("searches and filters before paginating", async () => {
    const result = await getDemoAiCompanyDirectory({
      ...baseQuery,
      search: "openai",
      country: "US",
      sort: "name",
      limit: 1,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe("openai");
    expect(result.pagination).toEqual({
      page: 1,
      limit: 1,
      total: 1,
      totalPages: 1,
    });
  });

  it("supports newest and most-products server-side sorting", async () => {
    const newest = await getDemoAiCompanyDirectory({
      ...baseQuery,
      sort: "newest",
      limit: 3,
    });
    const mostProducts = await getDemoAiCompanyDirectory({
      ...baseQuery,
      sort: "products",
      limit: 1,
    });

    expect(newest.data[0].slug).toBe("physical-intelligence");
    expect(mostProducts.data[0].productCount).toBe(3);
  });

  it("returns category counts for filter controls", async () => {
    const categories = await getDemoAiCompanyCategories();

    expect(categories).toHaveLength(6);
    expect(
      categories.find((category) => category.slug === "ai-lab")?.count,
    ).toBeGreaterThan(0);
  });

  it("ranks related companies by shared category and popularity", async () => {
    const detail = await getDemoAiCompanyDetail("openai");

    if (!detail) {
      throw new Error("Expected OpenAI demo detail");
    }

    expect(detail.relatedCompanies.length).toBeGreaterThan(0);
    expect(detail.relatedCompanies.map((company) => company.slug)).toContain(
      "anthropic",
    );
    expect(
      detail.relatedCompanies.some((company) => company.slug === "openai"),
    ).toBe(false);
  });
});
