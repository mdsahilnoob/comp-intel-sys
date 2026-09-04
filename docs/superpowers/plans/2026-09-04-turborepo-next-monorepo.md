# Turborepo Next.js Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing root Next.js template into a pnpm Turborepo with `apps/web` for the unchanged frontend and `apps/server` for a standalone Next.js API exposing `GET /server`.

**Architecture:** The root package becomes a private Turbo orchestrator. The existing frontend source and design-system configuration move together into `apps/web`; a minimal independent App Router application lives in `apps/server`. Each package owns its application dependencies and task scripts, while the root delegates `dev`, `build`, `lint`, `typecheck`, `test`, and `format` workflows.

**Tech Stack:** pnpm 11.20.0, Turborepo, Next.js 16.2.6, React 19.2.4, TypeScript, ESLint flat config, Tailwind CSS 4, shadcn/ui, and Node’s built-in test runner through `tsx`.

**Spec:** `docs/superpowers/specs/2026-09-04-turborepo-next-monorepo-design.md`

## Global Constraints

- Use pnpm for workspace management, dependency installation, scripts, and lockfile updates.
- Keep the existing frontend design system unchanged, including the shadcn configuration, Tailwind tokens, theme provider, UI components, typography, and page markup.
- Keep the repository root as the Turborepo root so `pnpm dev` starts both applications concurrently.
- Use the installed Next.js 16 conventions: App Router files, `route.ts` API handlers, flat ESLint configuration, and tracked source/config files only.
- Do not add a separate Express, Fastify, or custom Node HTTP server; the backend is a standalone Next.js App Router API application.

---

### Task 1: Configure the root pnpm workspace and Turbo orchestration

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `.gitignore`
- Create: `turbo.json`
- Create: `packages/README.md`
- Modify: `README.md`
- Modify: `pnpm-lock.yaml` through `pnpm install`

**Interfaces:**
- Consumes: the existing root package metadata and pnpm 11.20.0 installation.
- Produces: a private root package with `packageManager: "pnpm@11.20.0"`, root Turbo task scripts, workspace globs for `apps/*` and `packages/*`, and a Turbo task graph for `dev`, `build`, `start`, `lint`, `typecheck`, and `test`.

- [ ] **Step 1: Add root workspace and task configuration**

Update `package.json` so it contains no application runtime dependencies and has these root scripts:

```json
{
  "name": "comp-intel-sys",
  "private": true,
  "packageManager": "pnpm@11.20.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx}\""
  }
}
```

Keep Prettier and `prettier-plugin-tailwindcss` at the root for repository-wide formatting, and add Turbo as a root dev dependency using pnpm.

Update `pnpm-workspace.yaml` to retain the existing `allowBuilds` entries and include:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Create `turbo.json` with the current Turbo schema and these task semantics:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "start": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

Change `.gitignore` patterns so generated files from both workspaces are ignored (`node_modules/`, `**/.next/`, `**/out/`, `**/build/`, and existing environment/debug/typecheck patterns). Create `packages/README.md` explaining that the directory is reserved for future shared packages and is intentionally empty of runtime code.

- [ ] **Step 2: Install and lock the root dependency with pnpm**

Run:

```bash
pnpm add --save-dev --workspace-root turbo@latest
pnpm install
```

Expected: pnpm updates the root package metadata and `pnpm-lock.yaml` without generating an npm or Yarn lockfile.

- [ ] **Step 3: Verify root configuration before adding applications**

Run:

```bash
pnpm exec turbo --version
pnpm install --lockfile-only
```

Expected: Turbo prints its installed version and pnpm completes without workspace resolution errors.

- [ ] **Step 4: Commit the root workspace configuration**

```bash
git add package.json pnpm-workspace.yaml .gitignore turbo.json packages/README.md README.md pnpm-lock.yaml
git commit -m "build: configure pnpm turborepo workspace"
```

### Task 2: Move the existing frontend into `apps/web` without changing its design system

**Files:**
- Move: `app/` to `apps/web/app/`
- Move: `components/` to `apps/web/components/`
- Move: `lib/` to `apps/web/lib/`
- Move: `public/` to `apps/web/public/`
- Move: `components.json` to `apps/web/components.json`
- Move: `next.config.ts` to `apps/web/next.config.ts`
- Move: `postcss.config.mjs` to `apps/web/postcss.config.mjs`
- Move: `eslint.config.mjs` to `apps/web/eslint.config.mjs`
- Move: `tsconfig.json` to `apps/web/tsconfig.json`
- Create: `apps/web/package.json`

**Interfaces:**
- Consumes: root workspace globs from Task 1.
- Produces: workspace package `@comp-intel/web` with the existing frontend imports, aliases, Tailwind/shadcn files, page markup, and theme behavior unchanged.

- [ ] **Step 1: Move the tracked frontend files into the web application**

Create `apps/web/` and move the existing tracked application directories and config files with `git mv`. Do not edit the contents of `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `components/theme-provider.tsx`, or `components/ui/button.tsx` during this relocation.

- [ ] **Step 2: Add the web package manifest**

Create `apps/web/package.json` with the existing application dependencies and these scripts:

```json
{
  "name": "@comp-intel/web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

Place the current Next.js, React, shadcn, Base UI, Tailwind, icon, class utility, and theme dependencies in `dependencies`. Place the current TypeScript, Node/React type, ESLint, Next ESLint config, Tailwind PostCSS, Tailwind, and Prettier-related development dependencies in `devDependencies`. Keep dependency versions unchanged from the original root package.

- [ ] **Step 3: Update the README for the new root commands**

Document that the root is a pnpm Turborepo, that `apps/web` is the existing frontend, that `apps/server` is the API workspace, and that the primary commands are:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Keep the existing shadcn component usage example, changing only its path context if needed.

- [ ] **Step 4: Install workspace dependencies and verify the moved frontend**

Run:

```bash
pnpm install
pnpm --filter @comp-intel/web typecheck
pnpm --filter @comp-intel/web lint
```

Expected: the web workspace resolves `@/*` against `apps/web`, TypeScript passes, and ESLint reports no errors.

- [ ] **Step 5: Commit the web workspace relocation**

```bash
git add apps/web README.md package.json pnpm-lock.yaml
git commit -m "build: move frontend into web workspace"
```

### Task 3: Add the server Next.js workspace test-first

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/next.config.ts`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/eslint.config.mjs`
- Create: `apps/server/app/server/route.test.ts`
- Create: `apps/server/app/server/route.ts`

**Interfaces:**
- Consumes: root workspace task graph from Task 1 and the server package boundary from the spec.
- Produces: `@comp-intel/server` with `pnpm dev` on port 3001, a Next.js App Router handler at `GET /server`, and a `pnpm test` command covering its response contract.

- [ ] **Step 1: Add the server package and configuration without the route implementation**

Create `apps/server/package.json` with:

```json
{
  "name": "@comp-intel/server",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "tsx --test app/server/route.test.ts"
  },
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tsx": "^4",
    "typescript": "^5"
  }
}
```

Create `next.config.ts` exporting an empty typed `NextConfig`, a Next-compatible `tsconfig.json` using the same strict compiler settings and Next plugin as the web app, and a flat `eslint.config.mjs` using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` with `.next`, `out`, `build`, and `next-env.d.ts` ignored.

- [ ] **Step 2: Write the failing route contract test**

Create `apps/server/app/server/route.test.ts` before creating the production handler:

```ts
import test from "node:test"
import assert from "node:assert/strict"

import { GET } from "./route"

test("GET /server returns the server health response", async () => {
  const response = await GET()

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    service: "server",
    status: "ok",
  })
})
```

- [ ] **Step 3: Run the route test and verify the expected red failure**

Run:

```bash
pnpm install
pnpm --filter @comp-intel/server test
```

Expected: the test fails because `apps/server/app/server/route.ts` does not exist yet. If it fails for a different reason, correct the test setup before implementing the handler.

- [ ] **Step 4: Implement the minimal Next.js Route Handler**

Create `apps/server/app/server/route.ts`:

```ts
export function GET() {
  return Response.json({
    service: "server",
    status: "ok",
  })
}
```

- [ ] **Step 5: Run the route test and verify green**

Run:

```bash
pnpm --filter @comp-intel/server test
```

Expected: one test passes with no failures.

- [ ] **Step 6: Verify the server workspace checks**

Run:

```bash
pnpm --filter @comp-intel/server lint
pnpm --filter @comp-intel/server typecheck
pnpm --filter @comp-intel/server build
```

Expected: all three commands exit successfully and generate only ignored Next build/type files.

- [ ] **Step 7: Commit the server workspace**

```bash
git add apps/server package.json pnpm-lock.yaml
git commit -m "feat: add Next.js server workspace"
```

### Task 4: Verify the complete Turborepo workflow and local API

**Files:**
- Modify: any files required by verification failures only

**Interfaces:**
- Consumes: `@comp-intel/web`, `@comp-intel/server`, root Turbo tasks, and the `/server` response contract.
- Produces: a verified root workflow where both applications can be developed, checked, built, and started from pnpm commands.

- [ ] **Step 1: Run the complete root validation suite**

Run each command from the repository root:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected: Turbo schedules the corresponding task in each workspace, the server route test passes, and both Next.js builds exit successfully.

- [ ] **Step 2: Smoke-test both development servers concurrently**

Run:

```bash
pnpm dev
```

While it is running, verify the frontend and API from a second terminal:

```powershell
Invoke-WebRequest http://localhost:3000
Invoke-RestMethod http://localhost:3001/server
```

Expected: the frontend responds successfully and the API returns an object with `service` equal to `server` and `status` equal to `ok`. Stop the Turbo process after verification.

- [ ] **Step 3: Inspect the final change set**

Run:

```bash
git status --short
git diff --check HEAD~3..HEAD
git log -4 --oneline
```

Expected: only intended monorepo files are changed, no design-system source file has content changes beyond relocation, and no npm/yarn lockfile is present.

