# CompGrid Landing Page Implementation Plan

> **For agentic workers:** Execute the plan task-by-task with the existing route and product constraints in `task.md`.

**Goal:** Replace the root redirect with a responsive, premium CompGrid marketing landing page while keeping `/explore` and all existing product routes functional.

**Architecture:** Keep `app/page.tsx` as a small Server Component that renders a focused landing composition. Put static section structure in focused `components/landing/*` files and isolate browser behavior in small Client Components for hero switching, section reveals, scrolling story, and mobile navigation. Extend the existing OKLCH theme tokens in `globals.css`; do not add a new animation framework or touch backend services.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, CSS keyframes, IntersectionObserver, Lucide, existing Geist font setup, Playwright, Vitest.

**Spec:** `task.md` plus the user-provided CompGrid landing brief.

## Global Constraints

- `/` is the marketing landing page and must not redirect.
- `/explore` remains the URL-backed explorer and must return HTTP 200.
- All landing figures are synthetic or illustrative demo data.
- Preserve the existing services, API routes, Prisma behavior, and product routes.
- Respect `prefers-reduced-motion`, keyboard focus, semantic headings, and mobile widths from 375px through desktop.
- Motion uses transform, opacity, CSS keyframes, and observer-triggered islands; no Three.js, GSAP, canvas particles, or new heavy dependency.

### Task 1: Route and landing regression coverage

- Extend `apps/web/e2e/compgrid.spec.ts` so `/` asserts a 200 response, stays at `/`, exposes the primary hero heading, and links the primary CTA to `/explore`.
- Keep the direct `/explore` and existing product workflow checks.

### Task 2: Shared landing motion primitives and data

- Create `apps/web/components/landing/landing-data.ts` with typed synthetic datasets for companies, compensation composition, comparison rows, career progression, ticker entries, and normalization pipeline stages.
- Create focused client primitives under `apps/web/components/landing/motion/` for reveal-once, animated number, and accessible SVG/path drawing.

### Task 3: Landing visual sections

- Create focused sections for the hero, ticker, level mapping, compensation breakdown, product preview, scroll story, comparison, progression, data intelligence, normalization pipeline, stats, methodology, final CTA, and footer.
- Use CSS grid, thin rules, dark/light bands, and real inline data visuals rather than decorative icon-card filler.
- Add responsive fallbacks: normal stacked story on mobile, compact hero visual, horizontally scrollable comparison, and simplified progression labels.

### Task 4: Marketing chrome, styling, and metadata

- Update `SiteHeader`/`MobileNav` for root marketing navigation while preserving `/explore`, `/companies`, `/compare`, `/methodology`, `/research`, and `/submit` links.
- Update root metadata with the requested title, description, and Open Graph fields.
- Add landing tokens, responsive utilities, reduced-motion rules, focus styles, and interaction states to `globals.css`.

### Task 5: Verification

- Run the root landing E2E test, the full web E2E file, unit tests, typecheck, lint, and build.
- Review the diff for accidental backend changes and report any environment-only build limitation separately.
