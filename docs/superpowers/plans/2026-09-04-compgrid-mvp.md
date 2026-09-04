# CompGrid MVP Implementation Plan

> **For agentic workers:** This plan is executed inline in the shared workspace. Steps use checkbox (`- [ ]`) syntax for tracking; do not commit or push unless explicitly requested.

**Goal:** Build a production-oriented CompGrid compensation intelligence MVP for comparing synthetic compensation across companies, roles, company levels, canonical career levels, and Indian locations.

**Architecture:** `apps/web` remains the deployable Next.js App Router product. Server Components call typed services, services call repositories, and repositories use Prisma/PostgreSQL when `DATABASE_URL` is configured or a deterministic generated demo repository when it is not, so the product remains reviewable without secrets or a running database. `apps/server` remains the small standalone health app from the existing workspace.

**Tech Stack:** Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, shadcn-compatible local UI primitives, Prisma ORM, PostgreSQL/Neon, Zod, React Hook Form, Recharts, Lucide, Vitest, and Playwright.

**Spec:** `task.md`

## Global Constraints

- Compensation is stored as integer rupees; total compensation is always derived as base plus annualized stock plus bonus.
- Company and role matching is deterministic through normalized aliases; cross-company level mappings are simplified demo mappings and are not authoritative.
- All API errors use `{ error: { code, message, details } }`; raw database errors never reach clients.
- Explorer filters and comparison selections are URL state, not global React state.
- Database filtering, sorting, pagination, and aggregate calculations stay server-side.
- Synthetic data is clearly labeled and generated deterministically; no production salary sites are scraped.
- Server Components are the default; Client Components are limited to controls, forms, drawers, and charts.
- No authentication, jobs, reviews, forums, AI, payments, CMS, GraphQL, tRPC, Elasticsearch, or Redis.

## Repository Map

- `apps/web/app/`: route pages, loading/error/not-found boundaries, and App Router API handlers.
- `apps/web/components/`: layout, explorer, company, comparison, submission, chart, and small UI primitives.
- `apps/web/lib/`: database access, currency/formatting, constants, URL helpers, and shared types.
- `apps/web/server/`: validation, normalization, analytics, repositories, and services.
- `apps/web/prisma/`: PostgreSQL schema, initial migration, and deterministic seed script.
- `apps/web/tests/`: domain unit tests and service/integration tests that do not require a live database.
- `apps/web/e2e/`: Playwright user journey and configuration.

## Implementation Tasks

### Task 1: Foundation, dependencies, and domain tests

Create the product plan, update workspace scripts, add runtime/test dependencies, add `.env.example`, and establish the shared typed domain constants. Write failing Vitest tests first for normalization, compensation totals/defaults, fingerprints, currency formatting, and percentile calculations; then implement the smallest pure functions that satisfy them.

### Task 2: Prisma schema, migration, and deterministic seed

Add `Company`, `CompanyAlias`, `Role`, `RoleAlias`, `CareerLevel`, `CompanyLevel`, `Location`, and `CompensationSubmission` with foreign keys, unique slugs/codes/fingerprints, requested indexes, integer money fields, and timestamps. Add an initial SQL migration and an idempotent seed generating 20 companies, four roles, six Indian cities, mapped company levels, aliases, and roughly 6,000 varied synthetic submissions from a fixed seed. Add `db:generate`, `db:migrate`, `db:seed`, and `db:reset` scripts.

### Task 3: Repositories, services, and API contracts

Implement database-aware repositories with a generated demo fallback, explicit DTOs, server-safe error types, Zod query/body schemas, normalization pipeline, duplicate SHA-256 fingerprinting, lightweight process-local submission rate limiting, and analytics helpers for count/average/min/max/median/P25/P75/P90. Add route handlers for compensations, companies, company details/levels, comparison, submissions, roles, and locations. Route handlers parse `NextRequest` query params, await Next 16 dynamic `params`, use typed services, and return structured errors.

### Task 4: Application shell and reusable interface primitives

Replace the starter page with an original CompGrid shell: responsive header/navigation, branded mark, page container, footer, cards, badges, inputs/selects, skeletons, table styles, empty/error states, and mobile filter drawer. Preserve the existing theme provider and Tailwind setup while moving the palette to a restrained ink/teal analytics system with strong focus states and responsive spacing.

### Task 5: Compensation Explorer

Build `/` as a server-rendered explorer using URL search params for role, location, company, canonical level, experience/TC ranges, sort, direction, page, and limit. Add client filter controls, metric strip, desktop table, mobile cards, sort links, loading state, empty state, and numbered pagination. Initial reads call services directly; APIs remain available for interactive consumers.

### Task 6: Company directory and detail analytics

Build `/companies` with query-backed search, record counts, median Software Engineer TC, and links. Build `/companies/[slug]` with awaited dynamic params, dynamic metadata, summary metrics, by-level table, canonical mapping disclaimer, responsive Recharts median-by-level and composition charts, role/location selectors, and route-level not-found/error/loading UI.

### Task 7: Level-aware comparison

Build `/compare` with up to three stable URL selections (`a`, `b`, `c`, plus role/location), graceful invalid-entry handling, selector UI, comparison metrics, observed YoE ranges, canonical level explanation, and a horizontal median-TC chart. Keep selection serialization stable and shareable.

### Task 8: Submission pipeline

Build `/submit` with React Hook Form and `zodResolver`, labelled sections, server-backed option lists, live client estimate, annualized-stock explanation, inline errors, pending/success/duplicate/server-error states, and a normalized success summary. The POST service resolves aliases and IDs, applies missing stock/bonus defaults, derives TC, fingerprints, writes transactionally, and maps unique violations to HTTP 409.

### Task 9: Methodology, research, accessibility, and SEO

Build `/methodology` and `/research` with cautious competitor observations, synthetic-data disclosures, compensation/percentile/normalization explanations, and explicit scope tradeoffs. Add metadata, root/page titles and descriptions, semantic tables, keyboard/focus behavior, responsive navigation, meaningful empty states, and route/global error boundaries.

### Task 10: Verification and handoff documentation

Add README sections for architecture diagram, schema, APIs, seed, environment, migrations, testing, deployment, tradeoffs, limitations, and Loom flow. Add unit/service/API tests and a Playwright journey. Run format, lint, typecheck, Vitest, Prisma validation/generation, production builds, and local smoke checks where the environment supports them; report database-dependent checks honestly.

## Verification Commands

```bash
pnpm install
pnpm --filter @comp-intel/web db:generate
pnpm --filter @comp-intel/web test
pnpm lint
pnpm typecheck
pnpm build
pnpm --filter @comp-intel/web test:e2e
```

Database-backed verification additionally uses `DATABASE_URL`:

```bash
pnpm --filter @comp-intel/web db:migrate
pnpm --filter @comp-intel/web db:seed
```
