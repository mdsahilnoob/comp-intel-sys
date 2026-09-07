# AI Companies Module Design

## Goal

Turn the existing `/companies` compensation directory into a complete AI-company discovery module while preserving the existing compensation explorer and legacy company analytics for slugs such as `google`, `amazon`, and `razorpay`.

## Context and constraints

- The app is a Next.js 16 App Router monorepo using Server Components, Prisma 7, PostgreSQL, Tailwind CSS, Vitest, and Playwright.
- The current `Company` model is already the foreign-key root for compensation submissions, so creating a second unrelated company entity would split the domain and break existing links.
- The current demo repository is the no-database development path. The AI module must work in both demo mode and PostgreSQL mode.
- AI-company content is evaluation/demo content and must be described as such in the README; it is not a claim of verified market data.
- The `/companies` page is the AI discovery surface. Existing compensation detail behavior remains available for legacy company slugs that have no AI profile.

## Product behavior

### Listing

`/companies` renders a responsive, three-column desktop/two-column tablet/one-column mobile grid. It exposes URL-backed controls for:

- `search`
- `category`
- `country`
- `status`
- `sort` (`popular`, `newest`, `name`, `products`)
- `page`
- `limit`

The initial query is `sort=popular`, `page=1`, `limit=24`. Category tabs link back to the same listing while preserving other active filters. The server passes the query to the AI company service directly; the page does not fetch its own API route.

Cards show a deterministic logo mark, company name, category, location, short description, up to three capability badges, product count, and a link to the detail route.

### Detail

`/companies/[slug]` first attempts an AI profile. An AI profile contains:

- identity and website link;
- category, status, country, city, founded year, and product count metadata;
- short overview;
- products/tools cards;
- capability badges;
- related AI companies selected by category overlap, with popularity as the deterministic tie-breaker.

If the slug is not an AI profile, the page falls through to the existing compensation profile. An unknown slug calls `notFound()` and renders the route-local `not-found.tsx` UI. AI detail metadata uses `generateMetadata`.

### States

- `apps/web/app/companies/loading.tsx` renders heading/filter/card skeletons.
- `apps/web/app/companies/error.tsx` is a client error boundary with `Try again`.
- The empty state says “No companies found” and links to `/companies`.
- The route-local 404 says “Company not found” and links to the listing.

## Architecture

The existing `Company` table gains optional AI metadata and an `isAiCompany` discriminator. AI categories are a normalized many-to-many relation and products are a one-to-many relation. Existing compensation relationships remain unchanged.

The service/repository boundary is:

```text
Next Server Component or Route Handler
  -> company-service (query parsing / public service functions)
    -> ai-company-repository (Prisma or demo repository)
      -> PostgreSQL Company + Category + CompanyCategory + Product
```

Demo mode reads `AI_COMPANY_DEFINITIONS` through the repository and applies the same filter/sort/pagination semantics on the server. PostgreSQL mode uses Prisma `where`, `orderBy`, `count`, `skip`, and `take` so the UI never downloads all companies to filter in the browser.

The existing compensation functions remain exported under their current names for explorer/profile compatibility. New AI functions use explicit names: `getAiCompanyDirectory`, `getAiCompanyDetail`, and `getAiCompanyCategories`.

## Data model

Extend `Company` with:

- `description String?`
- `city String?`
- `country String?`
- `foundedYear Int?`
- `status CompanyStatus?`
- `popularityScore Int @default(0)`
- `featured Boolean @default(false)`
- `capabilities String[] @default([])`
- `isAiCompany Boolean @default(false)`

Add:

- `CompanyStatus` enum: `STARTUP`, `GROWTH`, `PUBLIC`, `ACQUIRED`.
- `Category`: `id`, `name`, `slug`, timestamps, and `companies` relation.
- `CompanyCategory`: composite primary key `[companyId, categoryId]`, both relations, and indexes.
- `Product`: `id`, `companyId`, `name`, `slug`, `description`, `category`, optional `url`, and a per-company unique slug.

The seed upserts AI companies, categories, joins, and products after the existing compensation catalog. Existing company rows are safe because the AI discriminator is false by default and AI upserts use stable slugs.

## API contracts

### `GET /api/companies`

Validated query parameters:

```text
search: optional string
category: optional category slug
country: optional country code
status: optional STARTUP | GROWTH | PUBLIC | ACQUIRED
sort: optional popular | newest | name | products
page: integer 1..100000, default 1
limit: integer 1..48, default 24
```

Successful responses are:

```json
{
  "data": [
    {
      "id": 101,
      "name": "OpenAI",
      "slug": "openai",
      "description": "Builds frontier models and developer products.",
      "logoUrl": null,
      "city": "San Francisco",
      "country": "US",
      "foundedYear": 2015,
      "status": "GROWTH",
      "categories": [{ "name": "AI Labs", "slug": "ai-lab" }],
      "capabilities": ["LLMs", "Multimodal", "Developer API"],
      "productCount": 3,
      "featured": true
    }
  ],
  "pagination": { "page": 1, "limit": 24, "total": 48, "totalPages": 2 }
}
```

The route returns the standard error envelope for invalid queries. For compatibility with the pre-existing compensation API test and consumers, a request containing only `search` falls back to the legacy compensation directory only when the AI query produces no matches and the legacy directory contains a match. All UI and new filter combinations use the AI contract.

### `GET /api/categories`

Returns `{ "data": [{ "name": "AI Labs", "slug": "ai-lab", "count": 12 }] }`, ordered by display name.

### `GET /api/companies/[slug]`

Returns `{ "data": <AI company detail> }` for AI slugs and retains the existing compensation detail response for legacy slugs. Missing slugs return the standard `NOT_FOUND` envelope.

## UI boundaries

- `CompanyCard` is the shared listing/related-company presentation.
- `CompanyFilters` is a semantic GET form; it collapses to one column on narrow screens instead of rendering a desktop sidebar.
- `CompanyLogo` uses a deterministic initials mark and does not require remote image configuration.
- `CompanyDetail` is a Server Component and composes product, capability, metadata, and related-company sections.
- Existing shared primitives (`PageContainer`, `SectionHeading`, `Card`, `Badge`, `Input`, `Select`, `Skeleton`, `EmptyState`, `ErrorPanel`) remain the visual system.

## Testing strategy

- Unit tests cover query defaults/validation, demo filtering, all four sort modes, pagination, and related-company ranking.
- API tests cover listing search/filter/pagination, invalid filters, categories, AI detail, legacy compatibility, and missing detail.
- Existing compensation repository and route tests remain green.
- Playwright coverage adds listing search/filter/detail/product assertions at desktop and a mobile viewport smoke check; existing tests must continue to pass.

## Out of scope

- Separate product detail routes.
- Funding analytics, revenue, valuation, traffic, or user counts.
- Authentication, admin editing, external CMS, or live company data ingestion.
- Client-side data fetching for the initial listing.
