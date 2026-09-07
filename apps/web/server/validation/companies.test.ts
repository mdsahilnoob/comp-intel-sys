import { describe, expect, it } from "vitest";

import { companiesQuerySchema } from "@/server/validation/schemas";

describe("AI company query validation", () => {
  it("defaults the query to popular page one with 24 results", () => {
    expect(companiesQuerySchema.parse({})).toMatchObject({
      sort: "popular",
      page: 1,
      limit: 24,
    });
  });

  it("normalizes blank search values to undefined", () => {
    expect(companiesQuerySchema.parse({ search: "  " }).search).toBeUndefined();
  });

  it("rejects unsupported filters and unsafe limits", () => {
    expect(() => companiesQuerySchema.parse({ category: "unknown" })).toThrow();
    expect(() => companiesQuerySchema.parse({ status: "ACTIVE" })).toThrow();
    expect(() => companiesQuerySchema.parse({ sort: "funding" })).toThrow();
    expect(() => companiesQuerySchema.parse({ limit: 49 })).toThrow();
  });

  it("treats empty optional select values as unset", () => {
    expect(
      companiesQuerySchema.parse({ category: "", country: "", status: "" }),
    ).toMatchObject({
      category: undefined,
      country: undefined,
      status: undefined,
    });
  });
});
