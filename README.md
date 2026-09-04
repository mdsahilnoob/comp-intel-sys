# Competition Intelligence System

This repository is a pnpm-managed Turborepo with two Next.js applications:

- `apps/web` is the existing frontend and design system.
- `apps/server` is the API application exposing `GET /server`.

## Development

Install dependencies and start both applications from the repository root:

```bash
pnpm install
pnpm dev
```

The frontend runs at `http://localhost:3000` and the API runs at `http://localhost:3001/server`.

Other root commands are:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

## Adding components

To add components to the web app, run the following command from `apps/web`:

```bash
pnpm dlx shadcn@latest add button
```

This will place UI components in `apps/web/components/ui`.

## Using components

Use components in the web app as follows:

```tsx
import { Button } from "@/components/ui/button";
```
