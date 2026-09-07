# AI Companies Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete URL-driven AI company discovery module at `/companies` and `/companies/[slug]` without breaking the existing compensation domain.

**Architecture:** Extend the existing Prisma `Company` model with optional AI metadata and add normalized categories/products. Route pages call an AI company service directly; route handlers expose the same service for external consumers. Demo mode uses a deterministic 48-company catalog, while PostgreSQL mode uses server-side Prisma filtering, sorting, and pagination.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS, shadcn-style primitives, Prisma 7, PostgreSQL, Zod, Vitest, Playwright, Lucide.

**Spec:** `docs/superpowers/specs/2026-09-07-ai-companies-design.md`

## Global Constraints

- Preserve existing compensation explorer, submission, comparison, and legacy company profile behavior.
- Keep `/companies` URL state in `search`, `category`, `country`, `status`, `sort`, `page`, and `limit`.
- Use Next.js 16 promise-based `params` and `searchParams` in Server Components and route handlers.
- Do not fetch `/api/companies` from the `/companies` Server Component; call the service/repository directly.
- Do not add a separate backend, Elasticsearch, client-side full-dataset filtering, or external AI-company data source.
- Label seeded AI-company content as deterministic demo content.

---

### Task 1: Lock down query/domain contracts with failing tests

**Files:**
- Create: `apps/web/server/ai-companies.ts`
- Modify: `apps/web/server/domain.ts`
- Modify: `apps/web/server/validation/schemas.ts`
- Test: `apps/web/server/ai-companies.test.ts`
- Test: `apps/web/server/validation/companies.test.ts`

**Interfaces:**
- Produces `AiCompanyStatus`, `AiCompanySort`, `AiCompanyDefinition`, `AiCompanyDirectoryEntry`, `AiCompanyDetailData`, `AiCompanyQuery`, and `AI_COMPANY_CATEGORIES` for later repository/UI tasks.
- Produces `companiesQuerySchema` parsing `{ search, category, country, status, sort, page, limit }` with defaults `sort: "popular"`, `page: 1`, and `limit: 24`.

- [ ] **Step 1: Write failing tests for query defaults and rejection.**

```ts
it("defaults the AI company query to popular page one with 24 results", () => {
  expect(companiesQuerySchema.parse({})).toMatchObject({
    sort: "popular",
    page: 1,
    limit: 24,
  })
})

it("rejects an unsupported category, status, sort, and unsafe limit", () => {
  expect(() => companiesQuerySchema.parse({ category: "unknown" })).toThrow()
  expect(() => companiesQuerySchema.parse({ status: "ACTIVE" })).toThrow()
  expect(() => companiesQuerySchema.parse({ sort: "funding" })).toThrow()
  expect(() => companiesQuerySchema.parse({ limit: 49 })).toThrow()
})
```

- [ ] **Step 2: Run the focused tests and verify they fail because the new schema/domain is missing.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- server/validation/companies.test.ts server/ai-companies.test.ts`

Expected: FAIL with missing query values/types or missing test modules.

- [ ] **Step 3: Add the typed AI-company contracts and 48 deterministic definitions.**

Use stable slugs, country codes `US`, `GB`, `IN`, `FR`, `CA`, `DE`, `IL`, and `AU`, and categories `ai-lab`, `developer-tools`, `infrastructure`, `enterprise`, `robotics`, and `consumer-ai`. Include the requested examples (`openai`, `anthropic`, `google-deepmind`, `mistral-ai`, `cohere`, `perplexity`, `hugging-face`, `scale-ai`, `runway`, `elevenlabs`, `midjourney`, `stability-ai`, `together-ai`, `groq`, `cerebras`, `nvidia`, `databricks`, `cursor`, `replit`, and `pika`) plus 28 additional ecosystem companies. Keep each definition to short display copy, 2–4 capabilities, and 2–3 products.

- [ ] **Step 4: Add the Zod schema and parsing helper, then rerun the focused tests.**

Expected: PASS, with the existing `companiesQuerySchema.parse({ search: "razor" })` behavior still accepted.

- [ ] **Step 5: Commit the domain/query contract.**

```bash
rtk git add apps/web/server/ai-companies.ts apps/web/server/domain.ts apps/web/server/validation/schemas.ts apps/web/server/ai-companies.test.ts apps/web/server/validation/companies.test.ts
rtk git commit -m "feat: define AI company discovery contracts"
```

### Task 2: Add Prisma AI-company schema and migration

**Files:**
- Modify: `apps/web/prisma/schema.prisma`
- Create: `apps/web/prisma/migrations/20260907000000_ai_companies/migration.sql`

**Interfaces:**
- Produces `CompanyStatus`, `Category`, `CompanyCategory`, and `Product` Prisma client types.
- Adds `Company` AI fields while retaining all existing compensation relations and default behavior.

- [ ] **Step 1: Add the schema models and fields.**

Add `description`, `city`, `country`, `foundedYear`, `status`, `popularityScore`, `featured`, `capabilities`, and `isAiCompany` to `Company`; add indexes for `isAiCompany`, `country`, `status`, and `popularityScore`. Add the normalized category/product relations described in the spec.

- [ ] **Step 2: Write the migration SQL.**

Create the enum, nullable/default columns, category/product tables, composite join primary key, unique indexes, and foreign-key constraints. Use the existing quoted PostgreSQL table/column names and `ON DELETE CASCADE` for category joins/products.

- [ ] **Step 3: Generate Prisma types and verify the schema.**

Run: `rtk corepack pnpm --filter @comp-intel/web db:generate`

Expected: Prisma Client generation succeeds and the generated client exposes the new relations.

- [ ] **Step 4: Commit the schema and migration.**

```bash
rtk git add apps/web/prisma/schema.prisma apps/web/prisma/migrations/20260907000000_ai_companies/migration.sql
rtk git commit -m "feat: model AI company metadata and products"
```

### Task 3: Implement demo repository behavior test-first

**Files:**
- Create: `apps/web/server/repositories/ai-company-repository.ts`
- Create: `apps/web/server/repositories/ai-company-demo-repository.ts`
- Test: `apps/web/server/repositories/ai-company-repository.test.ts`

**Interfaces:**
- Produces `getDemoAiCompanyDirectory(query)`, `getDemoAiCompanyDetail(slug)`, `getDemoAiCompanyCategories()`, and repository functions with the same return shapes.

- [ ] **Step 1: Write failing tests for search/filter/sort/page behavior.**

```ts
it("searches and filters the demo directory before paginating", async () => {
  const result = await getDemoAiCompanyDirectory({
    search: "open",
    category: undefined,
    country: "US",
    status: undefined,
    sort: "name",
    page: 1,
    limit: 1,
  })

  expect(result.data[0].slug).toBe("openai")
  expect(result.pagination.total).toBe(1)
})

it("ranks related companies by category overlap then popularity", async () => {
  const detail = await getDemoAiCompanyDetail("openai")
  expect(detail.relatedCompanies.length).toBeGreaterThan(0)
  expect(detail.relatedCompanies.map((company) => company.slug)).toContain("anthropic")
})
```

- [ ] **Step 2: Run the focused repository tests and verify the expected missing-function failure.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- server/repositories/ai-company-repository.test.ts`

Expected: FAIL because the AI repository functions do not exist.

- [ ] **Step 3: Implement demo filtering and sorting.**

Filter `AI_COMPANY_DEFINITIONS` by case-insensitive name/slug/description/capability/product text, exact category/country/status, then sort by popularity descending, founded year descending, name ascending, or product count descending. Apply a stable name/slug tie-breaker and slice only after computing `total` and `totalPages`.

- [ ] **Step 4: Implement detail mapping and related-company selection.**

Map definitions into public DTOs, calculate metadata/product count, and choose at most four related companies using category-overlap count, then `popularityScore`, then name. Never return the current company in related results.

- [ ] **Step 5: Implement the Prisma branch.**

Use `isAiCompany: true`, nested category filters, case-insensitive `contains` fields, explicit order mappings, `count`, `findMany`, `skip`, and `take`. Include categories/products only in detail queries; return DTOs rather than raw Prisma records.

- [ ] **Step 6: Rerun the focused repository tests and commit.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- server/repositories/ai-company-repository.test.ts`

Expected: PASS.

```bash
rtk git add apps/web/server/repositories/ai-company-repository.ts apps/web/server/repositories/ai-company-demo-repository.ts apps/web/server/repositories/ai-company-repository.test.ts
rtk git commit -m "feat: add AI company repository queries"
```

### Task 4: Add service, seed, and API contracts

**Files:**
- Modify: `apps/web/server/services/company-service.ts`
- Modify: `apps/web/app/api/companies/route.ts`
- Create: `apps/web/app/api/categories/route.ts`
- Modify: `apps/web/app/api/companies/[slug]/route.ts`
- Modify: `apps/web/prisma/seed.ts`
- Test: `apps/web/tests/api-ai-companies.test.ts`

**Interfaces:**
- Produces `getAiCompanyDirectory`, `getAiCompanyDetail`, `getAiCompanyCategories`, and `/api/categories`.
- `/api/companies` returns the AI paginated contract for AI queries and preserves the legacy search-only fallback for old compensation consumers.

- [ ] **Step 1: Write failing route tests.**

Cover:

```ts
it("returns filtered, paginated AI companies", async () => {
  const response = await getCompanies(new Request("http://localhost/api/companies?category=ai-lab&sort=name&page=1&limit=2"))
  const body = await response.json()
  expect(response.status).toBe(200)
  expect(body.data).toHaveLength(2)
  expect(body.pagination.limit).toBe(2)
  expect(body.data.every((company: { categories: { slug: string }[] }) => company.categories.some((category) => category.slug === "ai-lab"))).toBe(true)
})

it("returns a validation envelope for invalid filters", async () => {
  const response = await getCompanies(new Request("http://localhost/api/companies?status=active"))
  expect(response.status).toBe(400)
  expect((await response.json()).error.code).toBe("VALIDATION_ERROR")
})

it("returns AI detail and category data", async () => {
  const detail = await getCompanyDetailRoute(new Request("http://localhost/api/companies/openai"), { params: Promise.resolve({ slug: "openai" }) })
  expect((await detail.json()).data.products.length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run the route tests and verify they fail against the legacy contract.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- tests/api-ai-companies.test.ts`

Expected: FAIL because the route currently returns a flat legacy directory and has no categories route.

- [ ] **Step 3: Wire the service exports and route handlers.**

Parse `URLSearchParams` with the shared schema, call the service, and use `apiErrorResponse`. For the detail route, choose the AI repository response first and fall back to `getCompanyDetail` only when the AI slug is absent; throw a `NOT_FOUND`-compatible error when neither exists.

- [ ] **Step 4: Extend seedCatalog with AI upserts.**

Upsert categories by slug, upsert each AI company by slug with `isAiCompany: true`, upsert category joins by the composite key, and upsert products by `[companyId, slug]`. Keep existing compensation definitions/aliases/company levels unchanged. Make reruns idempotent.

- [ ] **Step 5: Rerun API tests and commit.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- tests/api-ai-companies.test.ts tests/api-routes.test.ts`

Expected: PASS, including the existing `search=razor` compatibility test.

```bash
rtk git add apps/web/server/services/company-service.ts apps/web/app/api/companies/route.ts apps/web/app/api/categories/route.ts apps/web/app/api/companies/[slug]/route.ts apps/web/prisma/seed.ts apps/web/tests/api-ai-companies.test.ts
rtk git commit -m "feat: expose AI company APIs and seed data"
```

### Task 5: Build reusable listing UI and server page

**Files:**
- Create: `apps/web/components/company/company-logo.tsx`
- Create: `apps/web/components/company/company-card.tsx`
- Create: `apps/web/components/company/company-filters.tsx`
- Modify: `apps/web/components/company/company-directory.tsx`
- Modify: `apps/web/app/companies/page.tsx`
- Create: `apps/web/app/companies/error.tsx`
- Modify: `apps/web/app/companies/loading.tsx`

**Interfaces:**
- `CompanyCard` accepts `AiCompanyDirectoryEntry` and is reusable in related-company sections.
- `CompanyFilters` accepts the current `AiCompanyQuery` plus available category/country/status options and produces URL GET controls.

- [ ] **Step 1: Write component tests for card content and filter URLs.**

Assert that a card renders the company name, description, category badge, country, product count, and `/companies/openai` link. Assert that applying a category form preserves `search` and resets `page` to `1`.

- [ ] **Step 2: Run focused component tests and verify they fail because the new components/page contract is missing.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- tests/components/company-directory.test.tsx`

Expected: FAIL with missing components or expected text.

- [ ] **Step 3: Implement `CompanyLogo`, `CompanyCard`, and `CompanyFilters`.**

Use existing card/badge/input/select/button visual primitives, a deterministic initials mark, native labels, `aria-label`s, and responsive one-column forms. Make category tabs semantic links and keep the layout compact with no desktop-only sidebar.

- [ ] **Step 4: Replace the page data read.**

Await `searchParams`, parse the query, call `getAiCompanyDirectory` and categories directly, render the “AI Companies” heading, search, category tabs, filters, grid, result count, and pagination. Render the specified empty state when `data.length === 0`. Keep a small “Compare the market by employer” link section so existing compensation navigation remains discoverable.

- [ ] **Step 5: Add listing loading/error states and rerun tests.**

Use card skeletons for 6 cards and an error boundary with `reset`. Expected: focused component/page tests PASS.

- [ ] **Step 6: Commit the listing surface.**

```bash
rtk git add apps/web/components/company apps/web/app/companies/page.tsx apps/web/app/companies/error.tsx apps/web/app/companies/loading.tsx tests
rtk git commit -m "feat: build responsive AI company directory"
```

### Task 6: Build AI company detail UI and preserve legacy profiles

**Files:**
- Create: `apps/web/components/company/company-detail.tsx`
- Create: `apps/web/components/company/product-card.tsx`
- Modify: `apps/web/app/companies/[slug]/page.tsx`
- Modify: `apps/web/app/companies/[slug]/loading.tsx`
- Modify: `apps/web/app/companies/[slug]/not-found.tsx`

**Interfaces:**
- `CompanyDetail` accepts `AiCompanyDetailData` and composes all AI sections.
- Existing compensation profile rendering remains unchanged in a separate branch/component path for legacy slugs.

- [ ] **Step 1: Write failing detail tests.**

Assert that `/companies/openai` renders the name, overview, metadata values, product names, capability badges, and related company links. Assert that `/companies/does-not-exist` renders “Company not found”. Assert that a legacy slug still renders the compensation heading/analytics.

- [ ] **Step 2: Run focused detail tests and verify the expected failure.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- tests/components/company-detail.test.tsx`

Expected: FAIL because the route still assumes every slug is a compensation company.

- [ ] **Step 3: Implement the AI detail component and route branch.**

Render back link, identity/website, badges, metadata grid, overview, products, capability badges, and the shared `CompanyCard` related grid. Use `notFound()` only after both AI and legacy lookups miss.

- [ ] **Step 4: Update dynamic metadata and skeleton/404 copy.**

Use `AI company profile`/company name in `generateMetadata`, render logo/text skeletons, and use the exact empty-state copy requested by the module.

- [ ] **Step 5: Rerun focused tests and commit.**

Run: `rtk corepack pnpm --filter @comp-intel/web test -- tests/components/company-detail.test.tsx server/repositories/demo-repository.test.ts`

Expected: PASS.

```bash
rtk git add apps/web/components/company apps/web/app/companies/[slug]
rtk git commit -m "feat: add AI company profiles and related companies"
```

### Task 7: Document the module and add browser coverage

**Files:**
- Modify: `apps/web/e2e/compgrid.spec.ts`
- Modify: `README.md`
- Modify: `apps/web/app/sitemap.ts`

- [ ] **Step 1: Add Playwright scenarios.**

Cover `/companies`, search `openai`, apply `ai-lab`, open `/companies/openai`, verify products/related companies, and smoke-test the one-column layout at 375px. Update the existing companies assertion to the new AI heading while retaining the compensation link assertion.

- [ ] **Step 2: Update README API/schema/seed sections.**

Document the AI company entities, 48-company demo catalog, query params, `/api/categories`, compatibility behavior, demo-content disclaimer, and the route/service/repository path.

- [ ] **Step 3: Include AI slugs in the sitemap without duplicating legacy paths.**

Read AI definitions from the catalog and append their routes alongside existing compensation company routes.

- [ ] **Step 4: Run all checks.**

Run:

```bash
rtk corepack pnpm lint
rtk corepack pnpm typecheck
rtk corepack pnpm test
rtk corepack pnpm build
rtk corepack pnpm --filter @comp-intel/web test:e2e
```

Expected: lint, typecheck, unit/API tests, and build PASS. E2E passes if Playwright browsers are installed; if not, report the environment limitation with the command output.

- [ ] **Step 5: Commit docs and browser coverage.**

```bash
rtk git add apps/web/e2e/compgrid.spec.ts README.md apps/web/app/sitemap.ts
rtk git commit -m "test: document and cover AI company discovery"
```

## Plan self-review

- Spec coverage: schema/migration (Task 2), 48 seeded/demo records (Tasks 1 and 4), server-side query behavior (Tasks 1 and 3), APIs (Task 4), listing/detail/states (Tasks 5 and 6), related companies/products/metadata (Tasks 3 and 6), compatibility (Tasks 4 and 6), tests/README/sitemap (Task 7).
- Placeholder scan: no open-ended implementation steps or `TBD`/`TODO` placeholders are used.
- Type consistency: repository query types are defined in Task 1 and consumed in Tasks 3–6; `CompanyStatus`/sort strings match the Zod schema and Prisma enum mapping.
- Scope: no product detail route, funding analytics, auth, CMS, or new infrastructure is introduced.
