# Turborepo Next.js Monorepo Design

## Goal

Convert the existing single-package Next.js template into a pnpm-managed Turborepo with two deployable Next.js applications: the existing frontend at `apps/web` and a lightweight API application at `apps/server` exposing `GET /server`.

## Constraints

- Use pnpm for workspace management, dependency installation, scripts, and lockfile updates.
- Keep the existing frontend design system unchanged, including the shadcn configuration, Tailwind tokens, theme provider, UI components, typography, and page markup.
- Keep the repository root as the Turborepo root so `pnpm dev` starts both applications concurrently.
- Use the installed Next.js 16 conventions: App Router files, `route.ts` API handlers, flat ESLint configuration, and tracked source/config files only.
- Do not add a separate Express, Fastify, or custom Node HTTP server; the backend is a standalone Next.js App Router API application.

## Architecture

### Root workspace

The repository root owns workspace orchestration and shared formatting configuration. `pnpm-workspace.yaml` includes `apps/*` and `packages/*`. `turbo.json` defines the `dev`, `build`, `lint`, and `typecheck` tasks. Root scripts delegate to Turbo with `turbo run ...`.

The root package remains private and includes the `packageManager` declaration for pnpm 11.21.0. Application-specific runtime dependencies live in their application package rather than in the root package. Prettier remains available at the root because formatting spans the entire repository.

### Frontend application

The current root Next.js application moves to `apps/web` without changing its source contents or visual behavior. The following files remain together inside the web application: `app`, `components`, `lib`, `hooks`, `public`, `components.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, and `tsconfig.json`.

The web package is named `@comp-intel/web` and uses port 3000 for both development and production start commands. Its scripts expose `dev`, `build`, `start`, `lint`, and `typecheck` so Turbo can run them by task name.

### API application

The new `apps/server` package is named `@comp-intel/server`. It is a minimal Next.js App Router application with its own `package.json`, `next.config.ts`, `tsconfig.json`, `next-env.d.ts` generation, and `app/server/route.ts`.

`GET /server` returns a JSON health response:

```json
{
  "service": "server",
  "status": "ok"
}
```

The server package uses port 3001 locally. It has `dev`, `build`, `start`, `lint`, and `typecheck` scripts. It does not import or modify the frontend design system.

### Future shared packages

The `packages` directory is reserved for future shared code. No design-system extraction or shared package is introduced in this migration because doing so would change import boundaries and create unnecessary risk.

## Task behavior

- `pnpm dev` runs `turbo run dev`, starting `@comp-intel/web` on port 3000 and `@comp-intel/server` on port 3001.
- `pnpm build` runs both application builds through Turbo.
- `pnpm lint` runs each application’s ESLint configuration.
- `pnpm typecheck` runs TypeScript checks in both applications.
- `pnpm format` formats tracked TypeScript source files using the existing root Prettier configuration.

The Turbo `dev` task is persistent and uncached. The `build` task depends on upstream package builds and caches each application’s `.next` output. Lint and typecheck are uncached validation tasks.

## Deployment

The monorepo remains deployable from its root repository. Cloudflare configuration can target `apps/web` and `apps/server` as separate projects, with the frontend consuming the server project’s URL when API calls are added. Because the backend is a separate Next.js application, it has an independent deployment lifecycle even though both applications share one Git repository.

## Validation

The migration is complete when all of the following pass from the repository root:

1. `pnpm install` completes and updates only the pnpm lockfile as needed.
2. `pnpm lint` passes for both workspace applications.
3. `pnpm typecheck` passes for both workspace applications.
4. `pnpm build` passes for both workspace applications.
5. Starting `pnpm dev` makes `http://localhost:3000` serve the existing frontend and `http://localhost:3001/server` return the documented JSON response.
