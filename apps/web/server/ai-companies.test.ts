import { describe, expect, it } from "vitest";

import {
  AI_COMPANY_CATEGORIES,
  AI_COMPANY_DEFINITIONS,
  getAiCompanyLogoUrl,
} from "@/server/ai-companies";

describe("AI company catalog", () => {
  it("contains a useful demo-sized AI ecosystem catalog", () => {
    expect(AI_COMPANY_DEFINITIONS).toHaveLength(48);
    expect(
      new Set(AI_COMPANY_DEFINITIONS.map((company) => company.slug)).size,
    ).toBe(48);
    expect(
      AI_COMPANY_DEFINITIONS.every((company) => company.products.length >= 2),
    ).toBe(true);
    expect(AI_COMPANY_DEFINITIONS.map((company) => company.slug)).toEqual(
      expect.arrayContaining([
        "openai",
        "anthropic",
        "google-deepmind",
        "mistral-ai",
        "cohere",
        "perplexity",
        "hugging-face",
        "scale-ai",
        "runway",
        "elevenlabs",
        "midjourney",
        "stability-ai",
        "together-ai",
        "groq",
        "cerebras",
        "nvidia",
        "databricks",
        "cursor",
        "replit",
        "pika",
      ]),
    );
  });

  it("uses stable discovery categories", () => {
    expect(AI_COMPANY_CATEGORIES.map((category) => category.slug)).toEqual([
      "ai-lab",
      "developer-tools",
      "infrastructure",
      "enterprise",
      "robotics",
      "consumer-ai",
    ]);
  });

  it("builds a real logo URL from each company's official website", () => {
    expect(getAiCompanyLogoUrl("https://openai.com")).toBe(
      "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    );
    expect(getAiCompanyLogoUrl("not-a-url")).toBeNull();
  });
});
