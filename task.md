You are a senior full-stack software engineer.

Your task is to build a production-oriented MVP called **CompGrid**, a Compensation Intelligence System inspired by the product philosophy of Levels.fyi, but with an original implementation and design.

This is an internship assignment for a **Full Stack Engineer** role.

The goal is NOT to make a generic salary listing website.

The core product thesis is:

> Compensation should be compared using company levels, roles, locations, and compensation structure. Levels matter more than job titles.

You must build the complete application end-to-end using the architecture and requirements below.

Do not use no-code or prompt-to-app tools.

Do not copy source code, proprietary assets, or exact visual designs from Levels.fyi or any other website.

Build an original implementation.

---

# 1. Mandatory Technology Stack

Use:

* Next.js latest stable App Router
* React
* TypeScript with strict mode
* Tailwind CSS
* shadcn/ui
* PostgreSQL
* Prisma ORM
* Zod
* React Hook Form
* Recharts
* Lucide icons
* Vitest for unit/integration tests
* Playwright for E2E testing

Deployment target:

* Vercel
* Neon PostgreSQL

Do NOT use:

* Firebase
* Supabase as the primary database/backend
* MongoDB
* GraphQL
* NestJS
* Redux unless absolutely necessary
* tRPC
* Elasticsearch
* external CMS systems

Keep the architecture understandable enough to explain in a 5–10 minute engineering review.

---

# 2. First Action

Before writing implementation code:

Inspect the repository.

If it is empty, assume this is a greenfield project.

Then produce a concise implementation plan containing:

1. proposed architecture
2. folder structure
3. Prisma entities
4. route handlers
5. pages
6. major reusable components
7. seed strategy
8. validation approach
9. testing strategy
10. implementation order

Then immediately continue implementation.

Do not wait for approval unless something is genuinely impossible to infer.

Use reasonable engineering judgment.

---

# 3. Product Scope

Implement ONLY the following major product areas:

1. Compensation Explorer
2. Company pages
3. Level-aware Compensation Comparison
4. Compensation Submission Pipeline
5. Compensation Analytics / Percentiles
6. Methodology page
7. Competitor Research page

Do NOT implement:

* job listings
* company reviews
* social network
* discussion forums
* chat
* AI assistant
* negotiation assistant
* resume tools
* complex authentication
* admin CMS
* notifications
* payment systems

Authentication is not required for the MVP.

Browsing, comparison, and submission can be public.

---

# 4. Product Name

Use:

CompGrid

Tagline:

Understand what your compensation is really worth.

Secondary message:

Compare compensation across companies, levels, roles, and locations.

---

# 5. Core Domain Model

The application must NOT treat arbitrary job titles as the main comparison unit.

Use this conceptual hierarchy:

Company
→ Role
→ Company Level
→ Canonical Career Level
→ Location
→ Compensation Submission

Example:

Google
Software Engineer
L4
MID
Bengaluru
₹73L TC

Cross-company examples:

Google L4 → MID
Amazon L5 → MID
Meta E4 → MID
Microsoft 63 → MID

Clearly state in the UI and methodology that these mappings are simplified demo mappings and are NOT authoritative equivalencies.

---

# 6. Database Models

Create Prisma models representing at least:

Company
CompanyAlias
Role
RoleAlias
CareerLevel
CompanyLevel
Location
CompensationSubmission

You may add small supporting models if justified.

---

# 7. Company Model

Suggested fields:

id
name
slug
logoUrl optional
industry optional
website optional
createdAt
updatedAt

Slug must be unique.

---

# 8. CompanyAlias

Fields:

id
companyId
alias
normalizedAlias

Relations:

Company has many aliases.

Example:

Company:
Google

Aliases:

Google LLC
Google India
Google India Pvt Ltd
GOOGLE
Google Inc

normalizedAlias should be indexed and preferably unique where appropriate.

---

# 9. Role

Fields:

id
name
slug
category optional

Initial seeded roles:

Software Engineer
Data Scientist
Product Manager
Engineering Manager

Optional fifth:

Designer

---

# 10. RoleAlias

Example mappings:

Software Engineer:
SWE
SDE
Software Developer
Software Development Engineer

Role aliases should normalize to one canonical Role.

---

# 11. CareerLevel

Fields:

id
code
name
rank

Seed:

ENTRY
MID
SENIOR
STAFF
PRINCIPAL
DISTINGUISHED

Use rank for deterministic sorting.

---

# 12. CompanyLevel

Fields:

id
companyId
careerLevelId
code
displayName optional
rank
minYearsExperience optional
maxYearsExperience optional

Relations:

Company
CareerLevel

Examples:

Google L3 → ENTRY
Google L4 → MID
Google L5 → SENIOR
Google L6 → STAFF
Google L7 → PRINCIPAL

Amazon L4 → ENTRY
Amazon L5 → MID
Amazon L6 → SENIOR
Amazon L7 → PRINCIPAL

Meta E3 → ENTRY
Meta E4 → MID
Meta E5 → SENIOR
Meta E6 → STAFF

Microsoft levels can use a simplified demo mapping.

Add a methodology disclaimer.

---

# 13. Location

Fields:

id
city
state optional
country
slug

Seed at least:

Bengaluru
Hyderabad
Pune
Gurgaon
Mumbai
Chennai

Country:

India

Use canonical city names.

Do not build an unnecessarily complex geography system.

---

# 14. CompensationSubmission

Suggested fields:

id

companyId
roleId
companyLevelId
locationId

baseSalary
stockAnnual
bonusAnnual
totalCompensation

currency
yearsExperience

compensationYear

verified
source

fingerprint

createdAt
updatedAt

Use integer values for INR compensation, representing rupees.

Example:

₹46L → 4600000

Do NOT store:

46

Do NOT use floating point values for compensation.

Use Int or BigInt depending on implementation constraints.

Prefer Int if values safely remain within PostgreSQL/JS handling limits used in this demo.

---

# 15. Compensation Semantics

Total compensation is:

baseSalary
+
stockAnnual
+
bonusAnnual

Stock means:

annualized stock compensation

NOT the total multi-year grant.

Example:

₹80L RSU grant over 4 years
→ ₹20L annual stock

Explain this in the submission UI and methodology.

---

# 16. Missing Values

The assignment explicitly requires:

missing bonus → 0
missing stock → 0

Apply these defaults on the server.

Do not rely only on frontend defaults.

---

# 17. Derived Total Compensation

Never trust a client-provided totalCompensation value.

The server must derive:

totalCompensation =
baseSalary + stockAnnual + bonusAnnual

If the client sends a TC field, ignore it.

Prefer not to send TC in the API input at all.

---

# 18. Normalization Pipeline

Create explicit normalization utilities or services.

At minimum:

company-normalizer.ts
role-normalizer.ts
compensation-normalizer.ts

Submission flow:

request
→ Zod validation
→ string normalization
→ company resolution
→ role resolution
→ company level resolution
→ location resolution
→ normalize compensation fields
→ default missing stock/bonus to zero
→ calculate TC
→ generate duplicate fingerprint
→ transaction
→ insert
→ response

Do not put all this logic directly inside a route.ts file.

---

# 19. Company Normalization

Normalize raw input through deterministic transformations:

trim
lowercase
remove punctuation where appropriate
collapse whitespace

Optionally strip common suffixes carefully:

pvt ltd
private limited
llc
inc

But CompanyAlias records should be the authoritative mapping.

Examples:

" GOOGLE India Pvt. Ltd "
→ normalize
→ find CompanyAlias
→ Google

Do NOT use an LLM for company normalization.

---

# 20. Role Normalization

Use RoleAlias.

Examples:

SWE
SDE
Software Developer
Software Development Engineer

→ Software Engineer

Keep this deterministic.

---

# 21. Duplicate Detection

Implement reliable duplicate handling.

Generate a deterministic canonical fingerprint from fields such as:

companyId
roleId
companyLevelId
locationId
compensationYear
baseSalary
stockAnnual
bonusAnnual
yearsExperience

Serialize them in a stable canonical order.

Hash using Node crypto SHA-256.

Store:

fingerprint

Create a UNIQUE database constraint/index on fingerprint.

Do not rely only on:

findFirst()
then insert()

because that allows a race condition.

If the unique constraint is hit:

return HTTP 409

with a structured DUPLICATE_SUBMISSION error.

---

# 22. Transactions

Use Prisma transactions where submission work can result in multiple related database operations.

No partial writes.

---

# 23. API Error Format

Use one consistent API error structure:

{
"error": {
"code": "VALIDATION_ERROR",
"message": "Readable message",
"details": {}
}
}

Support codes such as:

VALIDATION_ERROR
NOT_FOUND
DUPLICATE_SUBMISSION
UNSUPPORTED_CURRENCY
DATABASE_ERROR
INTERNAL_ERROR

Never expose raw Prisma errors to users.

---

# 24. Validation

Use Zod.

Validate:

company
role
companyLevel
location
baseSalary
stockAnnual
bonusAnnual
yearsExperience
compensationYear
currency

Reject:

negative money
NaN
Infinity
invalid numbers
yearsExperience < 0
yearsExperience > 60
unknown company
unknown role
unknown company level
unknown location
unsupported currency

Use a reasonable maximum TC boundary for bad demo data.

For example:

₹100 crore

Document this as sanity validation rather than an authoritative market cap.

---

# 25. Currency

The MVP may support only INR.

Still model:

currency

Seed/use:

INR

Formatting:

7300000

should display compactly as:

₹73L

and in detailed contexts:

₹73,00,000

Create reusable formatting helpers.

Use Intl.NumberFormat where appropriate.

---

# 26. Backend Architecture

Use this separation:

UI
↓
Service layer
↓
Repository/query layer
↓
Prisma
↓
PostgreSQL

Do not import Prisma directly into every component.

Suggested server structure:

src/server/services
src/server/repositories
src/server/normalization
src/server/validation
src/server/analytics

---

# 27. Server Components vs Client Components

Use Server Components by default.

Do not put `"use client"` at the top of whole pages unless absolutely necessary.

Suggested boundaries:

Server:

* page shells
* initial data reads
* company pages
* analytics cards
* table shells
* methodology
* research

Client:

* filter controls
* search autocomplete
* comparison selectors
* charts if required
* interactive submission form
* mobile drawers
* sortable interactive controls where necessary

Read-heavy Server Components should call services/repositories directly.

Do NOT fetch your own `/api/*` endpoints from Server Components unless there is a specific reason.

---

# 28. Route Handlers

Implement APIs with Next.js App Router Route Handlers.

Required:

GET /api/compensations
GET /api/companies
GET /api/companies/[slug]
GET /api/companies/[slug]/levels
GET /api/comparison
POST /api/submissions

Optional:

GET /api/roles
GET /api/locations

These are useful for interactive selectors.

---

# 29. GET /api/compensations

Support query parameters:

company
role
level
location
minTc
maxTc
minExperience
maxExperience
sort
direction
page
limit

Possible sorting:

totalCompensation
baseSalary
stockAnnual
bonusAnnual
yearsExperience
createdAt

Validate query params with Zod.

Perform filtering and sorting in PostgreSQL.

Do not load all records and filter in the browser.

---

# 30. Explorer API Response

Return:

{
"data": [...],
"pagination": {
"page": 1,
"limit": 25,
"total": 100,
"totalPages": 4
},
"aggregates": {
"count": 100,
"median": ...,
"p25": ...,
"p75": ...,
"p90": ...
}
}

Keep response DTOs explicit and typed.

Do not return raw Prisma objects if that leaks irrelevant fields.

---

# 31. Pagination

Use numbered/page-based pagination.

Default:

page = 1
limit = 25

Set a safe maximum limit.

For example:

100

Do not use infinite scrolling in the MVP.

---

# 32. URL-Based Filter State

Explorer filters must be represented in search params.

Example:

/?role=software-engineer&location=bengaluru&level=MID&sort=totalCompensation&direction=desc&page=1

Advantages:

shareable
refresh-safe
browser back/forward
SSR-friendly

Do not use global React state as the source of truth for filters.

---

# 33. Homepage / Explorer

Route:

/

Hero:

CompGrid

Understand what your compensation is really worth.

Compare compensation across companies, levels, roles, and locations.

Primary controls:

Role
Location
Company
Level

Below:

data count
median TC
P25
P75
P90

Then compensation table.

Desktop columns:

Company
Role
Level
Location
Base
Stock
Bonus
TC
YoE

Use high information density without looking cluttered.

---

# 34. Explorer Filters

Support:

Role
Location
Company
Canonical Career Level
Experience range
TC range

Sort:

Total Compensation
Base
Stock
Bonus
Years Experience
Newest

Mobile:

Use a Filters button opening a Sheet/Drawer.

Do not show an unusably wide filter sidebar on small screens.

---

# 35. Explorer Table UX

Implement:

sticky table header if practical
clear sort indicators
right-aligned numeric compensation columns
consistent money formatting
row hover
loading skeleton
empty state
pagination
responsive behavior

On mobile, convert salary rows into compact cards instead of forcing a very wide horizontal table.

Example mobile card:

Google
Software Engineer · L4
Bengaluru

₹73L TC

Base ₹46L
Stock ₹20L
Bonus ₹7L
5 YoE

---

# 36. Companies Page

Route:

/companies

Include:

search companies
company list
number of salary records
median Software Engineer TC if available

Company rows/cards should link to:

/companies/[slug]

---

# 37. Company Detail Page

Example:

/companies/google

Include:

company name
industry
record count

Role selector
Location selector where useful

Summary cards:

Median TC
Median Base
Median Stock
Median Bonus

Then:

Compensation by Company Level table

Columns:

Level
Canonical level
Base
Stock
Bonus
Median TC
Record count

Then charts.

---

# 38. Company Charts

Use Recharts.

Include:

1. Median Total Compensation by Level
2. Compensation Composition for selected level

Keep charts simple and readable.

Do not create decorative visualizations with no analytical value.

---

# 39. Comparison Page

Route:

/compare

Allow selecting up to 3 comparison entries.

Each comparison should include:

Company
Role
Company Level
Location

Example:

Google
Software Engineer
L4
Bengaluru

VS

Amazon
Software Engineer
L5
Bengaluru

VS

Microsoft
Software Engineer
63
Bengaluru

Display:

Canonical normalized level
Median Base
Median Stock
Median Bonus
Median TC
P75 TC
Record Count
Typical/observed YoE range if enough data

Also include a horizontal bar chart for median TC.

---

# 40. Comparison URL State

Persist comparison selection to the URL.

Example:

/compare?a=google-l4&b=amazon-l5&c=microsoft-63&role=software-engineer&location=bengaluru

Use a stable serialization format.

If a comparison entry is invalid:

show a useful error or omit invalid selection gracefully.

---

# 41. Submit Compensation Page

Route:

/submit

Design a polished form with sections:

Company and Role

Company
Role
Company Level

Location

Country
City

Experience

Years of Experience

Compensation

Currency
Base Salary
Annualized Stock
Annual Bonus

Show a live estimated TC on the frontend for user convenience.

But derive the final TC again on the backend.

---

# 42. Submission UX

Use React Hook Form + Zod resolver.

Show:

inline validation errors
money formatting hints
clear annualized stock explanation
loading state
success state
duplicate error state
server error state

On success:

show the normalized saved result.

Example:

Submitted successfully

Google
Software Engineer
L4
Bengaluru

Total Compensation
₹73L

---

# 43. Analytics

Implement utility functions and/or database-backed analytics for:

count
average
median
P25
P50
P75
P90
min
max

Primary UI metric:

Median

Do not make Average the hero metric.

Explain in Methodology that median is less sensitive to salary outliers.

---

# 44. Percentile Implementation

Implement percentile calculations correctly and document the chosen method.

Use a consistent definition throughout tests and UI.

You can calculate analytics in:

* PostgreSQL raw parameterized SQL for percentile_cont, OR
* a well-tested server-side method if query result size is reasonably bounded

Prefer PostgreSQL percentile_cont if practical.

If using Prisma `$queryRaw`, parameterize safely.

Never concatenate untrusted strings into SQL.

---

# 45. Database Indexes

Add indexes based on query patterns.

Likely useful:

companyId
roleId
companyLevelId
locationId
totalCompensation
createdAt
fingerprint unique

Also consider composites such as:

companyId + roleId + locationId

roleId + locationId + totalCompensation

Do not index every field blindly.

Add comments to README explaining the reasoning.

---

# 46. Seed Dataset

Create deterministic demo data.

Do NOT scrape production salary websites.

Clearly label all compensation as synthetic/demo data.

Use a fixed random seed.

Generate approximately:

20–30 companies
4 roles
4–6 company levels
6 Indian cities
5,000–15,000 salary submissions

The exact count can vary.

Important:

re-running the seed should produce deterministic results.

---

# 47. Suggested Companies

Seed a selection such as:

Google
Microsoft
Amazon
Meta
Apple
Uber
Atlassian
Adobe
Salesforce
Oracle
Flipkart
Razorpay
PhonePe
Swiggy
Zomato
Meesho
CRED
Freshworks
Walmart
Intuit

Do not claim that seeded salary values represent verified real-world compensation.

---

# 48. Salary Generation

Generate plausible but clearly synthetic salary distributions.

Use deterministic ranges influenced by:

career level
company tier
role
location
years of experience

Example concept:

ENTRY < MID < SENIOR < STAFF < PRINCIPAL

Stock should generally become a larger share at higher levels.

Do not hardcode identical salary amounts for every employee in a level.

Generate variation.

Avoid impossible negative values.

---

# 49. Seed Integrity

Seed:

Company
Aliases
Roles
RoleAliases
CareerLevels
CompanyLevels
Locations
CompensationSubmission

Ensure foreign keys and mappings are valid.

Seed must be idempotent or support reset+seed cleanly.

---

# 50. Methodology Page

Route:

/methodology

Explain:

What total compensation means

Base + annualized stock + bonus

Missing stock and bonus default to zero

Why median is primary

How percentiles work

How company aliases are normalized

How role aliases are normalized

How cross-company level mapping works

Important disclaimer:

Cross-company mappings are simplified demo mappings and are not authoritative.

Data disclaimer:

Compensation data is synthetic and generated for engineering evaluation.

---

# 51. Competitor Research Page

Route:

/research

Create a clean research comparison table containing:

Feature
Levels.fyi
6figr
AmbitionBox
Glassdoor
CompGrid
Build?

Include observations around:

salary submissions
company compensation
level-based comparison
base/stock/bonus structure
company pages
salary filters
percentiles
company comparison
reviews
jobs

State clearly:

CompGrid intentionally focuses on structured compensation intelligence rather than jobs or employee review content.

Do not fabricate precise competitor claims.

Keep descriptions general and cautious.

---

# 52. Visual Design Direction

Create an original design inspired by:

high-quality modern developer/product SaaS
financial analytics dashboards
information-dense salary products

Do NOT copy Levels.fyi.

Visual qualities:

minimal
professional
analytical
fast
clean
high information density
subtle borders
excellent typography
minimal decoration

Use Geist or the default modern Next.js font stack.

---

# 53. Color System

Use a restrained neutral design.

Near-white background
white cards
dark text
muted gray secondary text
subtle gray borders

Use one primary accent color.

Use positive/negative colors only when semantically useful.

Do not create a rainbow dashboard.

Support dark mode only if it can be added cleanly after core functionality.

Dark mode is not a priority.

---

# 54. Layout

Desktop:

max-width content container
clear navigation
good whitespace
information-dense tables

Mobile:

responsive navigation
filter drawer
salary cards
usable forms
charts resize correctly

Test at least:

375px
768px
1280px
1440px

---

# 55. Accessibility

Implement:

semantic HTML
form labels
keyboard navigation
focus states
accessible dialogs/sheets
sensible color contrast
aria labels where needed
table semantics

Do not make clickable divs when buttons/links are appropriate.

---

# 56. Loading States

Use skeleton components instead of plain "Loading..." where practical.

Implement loading.tsx where useful.

---

# 57. Empty States

Examples:

No compensation data found.

Try removing a company, location, or level filter.

Button:

Clear filters

Create meaningful empty states for:

Explorer
Company levels
Comparison
Search

---

# 58. Error Boundaries

Add appropriate:

error.tsx
not-found.tsx

for major routes.

Do not display raw stack traces.

---

# 59. Repository Structure

Use a structure similar to:

src/
app/
page.tsx

```
companies/
  page.tsx
  [slug]/
    page.tsx

compare/
  page.tsx

submit/
  page.tsx

methodology/
  page.tsx

research/
  page.tsx

api/
  compensations/
    route.ts
  companies/
    route.ts
  companies/[slug]/
    route.ts
  companies/[slug]/levels/
    route.ts
  comparison/
    route.ts
  submissions/
    route.ts
```

components/
ui/
layout/
compensation/
filters/
company/
compare/
submit/
charts/

server/
services/
repositories/
normalization/
validation/
analytics/

lib/
db.ts
currency.ts
formatting.ts
utils.ts
constants.ts

prisma/
schema.prisma
seed.ts

tests/
unit/
integration/

e2e/

Use path aliases.

Keep files focused.

Avoid giant 500+ line components where reasonable.

---

# 60. Naming

Use domain-oriented names.

Good:

compensation.service.ts
company.repository.ts
submission.schema.ts
company-normalizer.ts

Bad:

helpers2.ts
stuff.ts
utils-final.ts

---

# 61. Search

Company search and filters can use PostgreSQL/Prisma case-insensitive contains.

Do NOT add Elasticsearch.

For a dataset below 15k rows, PostgreSQL is sufficient.

---

# 62. Rate Limiting

If feasible, add lightweight rate limiting to POST /api/submissions.

If a production-grade distributed rate limiter would add too much external infrastructure, implement a simple documented MVP approach and state the tradeoff.

Do not let this block core implementation.

---

# 63. Security

Ensure:

all mutations validated server-side
no raw SQL string concatenation
no secrets in source
no client trust for TC calculation
safe error messages
reasonable request size
environment variables
Prisma parameterization

Add `.env.example`.

Never commit real secrets.

---

# 64. Tests

Create meaningful tests.

Unit tests:

company normalization
role normalization
salary TC calculation
missing bonus default
missing stock default
fingerprint determinism
currency formatting
median
percentiles

Integration tests:

valid salary submission
invalid salary
negative salary
unknown level
duplicate submission
missing stock/bonus
filtering
sorting
pagination

Playwright E2E:

1. open homepage
2. apply role/location filter
3. sort compensation
4. open company
5. go to compare
6. compare two entries
7. open submit
8. submit valid compensation
9. verify success

Do not chase 100% test coverage.

Prioritize domain correctness.

---

# 65. Code Quality

Requirements:

TypeScript strict mode
no unexplained `any`
no ts-ignore unless documented
ESLint passes
formatting consistent
no dead code
no unused imports
server-only code stays server-side
avoid duplication

Use comments only where they add architectural/domain value.

---

# 66. Performance

Design for:

Server Components
database filtering
pagination
indexes
small Client Component boundaries
debounced text search
lazy-loaded heavy charts if useful

Do not prematurely add Redis.

---

# 67. SEO

Add appropriate:

metadata
titles
descriptions

Company pages should have dynamic metadata.

Example:

Google Software Engineer Compensation | CompGrid

Do not spend excessive time on SEO.

---

# 68. README

Write an excellent README.

Sections:

CompGrid

Overview

Problem

Product thesis

Features

Screenshots placeholder

Architecture

System diagram

Tech stack

Database schema explanation

Normalization pipeline

Company/role aliases

Level mapping

Compensation semantics

API endpoints

Seed data

How to run locally

Environment variables

Database migration

Testing

Deployment

Engineering tradeoffs

Known limitations

What I would build next

---

# 69. README Architecture Diagram

Include a Mermaid diagram or ASCII diagram showing:

Browser

Server Components
Client Components

Route Handlers

Services

Validation / Normalization / Analytics

Repositories

Prisma

PostgreSQL

---

# 70. Tradeoffs Section

Explicitly document:

Synthetic salary dataset

Simplified cross-company level mappings

INR-first MVP

No authentication

No jobs/reviews/community

PostgreSQL analytics instead of an OLAP system

Alias-based deterministic normalization instead of fuzzy/AI matching

These are intentional scope decisions.

---

# 71. Database Workflow

Use Prisma migrations.

Do NOT treat prisma db push as the final workflow.

Create proper migrations.

Commands should support:

install
generate
migrate
seed
dev
test
test:e2e
build
lint

---

# 72. Useful package scripts

Ensure package.json contains useful commands such as:

dev
build
start
lint
test
test:watch
test:e2e
db:generate
db:migrate
db:seed

Use exact commands appropriate to installed versions.

---

# 73. Deployment

Prepare for:

Vercel
Neon

Ensure database configuration is compatible with serverless deployment.

Document environment setup.

Ensure Prisma generation occurs in the deployment/build process when required.

---

# 74. Implementation Order

Implement in this order:

PHASE 1
Project foundation
Next.js
Tailwind
shadcn
Prisma
database connection
layout

PHASE 2
Prisma schema
migrations
seed dataset

PHASE 3
Domain services
repositories
normalizers
validation
analytics helpers

PHASE 4
Compensation Explorer
filters
sorting
pagination
URL state

PHASE 5
Companies directory
company detail
level analytics
charts

PHASE 6
Comparison

PHASE 7
Submission form
server validation
normalization
dedupe
transaction

PHASE 8
Methodology
Research

PHASE 9
Tests
responsive polish
accessibility
error handling
README

PHASE 10
Production build verification

Do not start with animations or authentication.

---

# 75. Verification After Each Major Phase

Frequently run:

TypeScript check
lint
unit tests
build

Fix errors before proceeding.

Do not leave known errors for later.

---

# 76. Final Verification

Before declaring the project complete, run all applicable commands.

At minimum:

npm run lint
npm run test
npm run build

Run Playwright if the environment supports it.

Verify:

database migration works
seed works
homepage works
filters work
sorting works
pagination works
company page works
comparison works
submission works
duplicate handling works
mobile layout is usable

Do not claim something works unless verified.

---

# 77. Final Response

When finished, provide:

1. architecture summary
2. implemented features
3. database design summary
4. normalization strategy
5. important engineering decisions
6. tests added
7. verification results
8. local setup instructions
9. required environment variables
10. deployment steps
11. known limitations
12. recommended Loom demo flow

Also list any remaining issues honestly.

---

# 78. Loom Demo Flow

Optimize the app so this demo flow works smoothly:

1. Explain product thesis
2. Open Compensation Explorer
3. Apply Software Engineer + Bengaluru filter
4. Sort by TC
5. Open Google company page
6. Show compensation levels and chart
7. Open Compare
8. Compare Google L4 vs Amazon L5 vs Microsoft equivalent
9. Explain canonical career levels
10. Submit a new compensation record
11. Show server-derived TC
12. Show duplicate rejection
13. Briefly show Prisma schema
14. Explain normalizers and fingerprint
15. Show tests
16. Explain architecture and tradeoffs

The entire experience should be polished enough for a 5–10 minute internship review.

---

# 79. Engineering Principles

Follow these throughout the implementation:

YAGNI
KISS
strong typing
server validation
database constraints
domain separation
reusable components
clear naming
responsive UX
accessible UI
deterministic behavior
honest tradeoffs

Do not overengineer.

Do not create microservices.

Do not introduce infrastructure without a clear requirement.

---

# 80. Most Important Evaluation Criteria

Prioritize, in order:

1. correctness
2. reliable backend behavior
3. data modeling
4. normalization
5. clean API design
6. useful compensation comparison
7. frontend usability
8. responsive design
9. testing
10. visual polish

The application must feel like something built by a full-stack engineer who understands the system, not like a generated landing page.

Begin by inspecting the repository and then implement the complete project.
