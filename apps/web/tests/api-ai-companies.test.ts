import { describe, expect, it } from "vitest";

import { GET as getCategories } from "@/app/api/categories/route";
import { GET as getCompanies } from "@/app/api/companies/route";
import { GET as getCompanyDetail } from "@/app/api/companies/[slug]/route";

describe("AI company API routes", () => {
  it("returns filtered and paginated AI companies", async () => {
    const response = await getCompanies(
      new Request(
        "http://localhost/api/companies?category=ai-lab&sort=name&page=1&limit=2",
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.pagination).toMatchObject({ page: 1, limit: 2 });
    expect(
      body.data.every((company: { categories: Array<{ slug: string }> }) =>
        company.categories.some((category) => category.slug === "ai-lab"),
      ),
    ).toBe(true);
  });

  it("returns a validation envelope for invalid filters", async () => {
    const response = await getCompanies(
      new Request("http://localhost/api/companies?status=active"),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("VALIDATION_ERROR");
  });

  it("returns category counts and AI detail products", async () => {
    const categoriesResponse = await getCategories();
    const categoriesBody = await categoriesResponse.json();
    const detailResponse = await getCompanyDetail(
      new Request("http://localhost/api/companies/openai"),
      { params: Promise.resolve({ slug: "openai" }) },
    );
    const detailBody = await detailResponse.json();

    expect(categoriesResponse.status).toBe(200);
    expect(categoriesBody.data).toHaveLength(6);
    expect(detailResponse.status).toBe(200);
    expect(detailBody.data.company.slug).toBe("openai");
    expect(detailBody.data.products.length).toBeGreaterThan(0);
    expect(detailBody.data.relatedCompanies.length).toBeGreaterThan(0);
  });

  it("preserves the legacy compensation search fallback", async () => {
    const response = await getCompanies(
      new Request("http://localhost/api/companies?search=razor"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data[0].slug).toBe("razorpay");
  });

  it("returns a not-found envelope for an unknown company", async () => {
    const response = await getCompanyDetail(
      new Request("http://localhost/api/companies/does-not-exist"),
      { params: Promise.resolve({ slug: "does-not-exist" }) },
    );

    expect(response.status).toBe(404);
    expect((await response.json()).error.code).toBe("NOT_FOUND");
  });
});
