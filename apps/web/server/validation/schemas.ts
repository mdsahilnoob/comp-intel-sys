import { z } from "zod";

import type { ExplorerFilters } from "@/server/domain";

export const MAX_COMPENSATION = 1_000_000_000;

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(1).optional(),
);

const optionalInteger = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : value),
    z.coerce.number().int().min(0).max(maximum).optional(),
  );

export const explorerQuerySchema = z
  .object({
    company: optionalText,
    role: optionalText,
    level: z
      .enum(["ENTRY", "MID", "SENIOR", "STAFF", "PRINCIPAL", "DISTINGUISHED"])
      .optional(),
    location: optionalText,
    minTc: optionalInteger(MAX_COMPENSATION),
    maxTc: optionalInteger(MAX_COMPENSATION),
    minExperience: optionalInteger(60),
    maxExperience: optionalInteger(60),
    sort: z
      .enum([
        "totalCompensation",
        "baseSalary",
        "stockAnnual",
        "bonusAnnual",
        "yearsExperience",
        "createdAt",
      ])
      .default("totalCompensation"),
    direction: z.enum(["asc", "desc"]).default("desc"),
    page: z.coerce.number().int().min(1).max(100_000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  })
  .superRefine((value, context) => {
    if (
      value.minTc !== undefined &&
      value.maxTc !== undefined &&
      value.minTc > value.maxTc
    ) {
      context.addIssue({
        code: "custom",
        path: ["maxTc"],
        message:
          "Maximum compensation must be greater than minimum compensation",
      });
    }
    if (
      value.minExperience !== undefined &&
      value.maxExperience !== undefined &&
      value.minExperience > value.maxExperience
    ) {
      context.addIssue({
        code: "custom",
        path: ["maxExperience"],
        message: "Maximum experience must be greater than minimum experience",
      });
    }
  });

export function parseExplorerQuery(
  values: URLSearchParams | Record<string, string | undefined>,
): ExplorerFilters {
  const input =
    values instanceof URLSearchParams
      ? Object.fromEntries(values.entries())
      : values;
  return explorerQuerySchema.parse(input);
}

export const companiesQuerySchema = z.object({
  search: optionalText,
  category: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z
      .enum([
        "ai-lab",
        "developer-tools",
        "infrastructure",
        "enterprise",
        "robotics",
        "consumer-ai",
      ])
      .optional(),
  ),
  country: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? undefined
        : typeof value === "string"
          ? value.toUpperCase()
          : value,
    z.enum(["US", "GB", "IN", "FR", "CA", "DE", "IL", "AU", "JP"]).optional(),
  ),
  status: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.enum(["STARTUP", "GROWTH", "PUBLIC", "ACQUIRED"]).optional(),
  ),
  sort: z.enum(["popular", "newest", "name", "products"]).default("popular"),
  page: z.coerce.number().int().min(1).max(100_000).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(24),
});

export const companyDetailQuerySchema = z.object({
  role: optionalText,
  location: optionalText,
});

export const comparisonQuerySchema = z.object({
  a: optionalText,
  b: optionalText,
  c: optionalText,
  role: optionalText,
  location: optionalText,
});

export const submissionSchema = z
  .object({
    company: z.string().trim().min(1).max(120),
    role: z.string().trim().min(1).max(120),
    companyLevel: z.string().trim().min(1).max(40),
    location: z.string().trim().min(1).max(80),
    baseSalary: z.number().finite().int().min(0).max(MAX_COMPENSATION),
    stockAnnual: z
      .number()
      .finite()
      .int()
      .min(0)
      .max(MAX_COMPENSATION)
      .nullish(),
    bonusAnnual: z
      .number()
      .finite()
      .int()
      .min(0)
      .max(MAX_COMPENSATION)
      .nullish(),
    currency: z.string().trim().min(1).max(3),
    yearsExperience: z.number().finite().int().min(0).max(60),
    compensationYear: z.number().finite().int().min(2020).max(2100),
  })
  .superRefine((value, context) => {
    const total =
      value.baseSalary + (value.stockAnnual ?? 0) + (value.bonusAnnual ?? 0);
    if (total > MAX_COMPENSATION) {
      context.addIssue({
        code: "custom",
        path: ["baseSalary"],
        message:
          "Total compensation exceeds the demo sanity limit of ₹100 crore",
      });
    }
  });

export type SubmissionInput = z.infer<typeof submissionSchema>;
