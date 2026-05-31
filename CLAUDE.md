# Nasarawa Trade Desk

Procurement & logistics platform connecting Nigerian buyers with a procurement
company operating in Nasarawa State markets. Buyers submit procurement requests;
officers source, quote, procure, inspect, and dispatch; logistics tracks
delivery; finance verifies payment; disputes are escalated under SLA.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions) + **React 19**
- **TypeScript** (strict), path alias `@/*` -> `./src/*`
- **Prisma 5** + PostgreSQL (`prisma/schema.prisma`)
- **NextAuth v5 (beta)** for auth
- **Tailwind CSS 3** for UI
- **Zod** for validation
- Deployed on **Vercel** (production branch: `main`)

## Commands

```bash
npm run dev          # local dev server
npm run build        # next build — MUST pass before deploy
npm run lint         # eslint (next lint)
npm run typecheck    # tsc --noEmit
npm run test         # vitest run
npm run test:watch   # vitest watch
npm run db:generate  # prisma generate
npm run db:push      # prisma db push (dev only)
npm run db:studio    # prisma studio
```

Before pushing, run `npm run typecheck`, `npm run lint`, and `npm run test`.

## Architecture map

- `src/app/` — App Router pages, layouts, and server actions
  - `dashboard/` — role-gated operational workspaces (admin, orders, disputes,
    audit, procurement, logistics)
  - `request/`, `register/`, `login/`, `track/` — public/customer surfaces
  - `*/actions.ts` — Server Actions (mutations live here)
- `src/components/` — `site/` (public) and `dashboard/` (internal) components
- `src/lib/` — domain logic: `workflow.ts`, `auth.ts`, `prisma.ts`,
  `format.ts`, `validators/`
- `src/types/index.ts` — shared domain types (single source of truth)
- `src/data/mock.ts` — mock data for UI before DB is fully wired
- `docs/` — architecture, folder-structure, order-workflow

## Domain invariants (do not break)

### Order workflow state machine (`src/lib/workflow.ts`)
Status transitions are explicit and authoritative. Allowed transitions:

- `SUBMITTED` -> SOURCING | CANCELLED
- `SOURCING` -> QUOTED | CANCELLED
- `QUOTED` -> AWAITING_PAYMENT | CANCELLED
- `AWAITING_PAYMENT` -> PROCUREMENT_STARTED | CANCELLED
- `PROCUREMENT_STARTED` -> QUALITY_CHECK | DISPUTED
- `QUALITY_CHECK` -> READY_FOR_DISPATCH | DISPUTED
- `READY_FOR_DISPATCH` -> IN_TRANSIT
- `IN_TRANSIT` -> DELIVERED | DISPUTED
- `DELIVERED` -> COMPLETED | DISPUTED
- `DISPUTED` -> COMPLETED
- `COMPLETED`, `CANCELLED` -> terminal (no transitions)

Rules:
- Use `canTransition(from, to)` to validate — never hard-code status checks.
- Each forward transition has a `TransitionControl` with `allowedRoles`,
  `requiredEvidence`, and `auditAction`. Enforce role + evidence on every
  state change and emit the `auditAction`.
- If you add a `WorkflowStatus`, update: the type in `src/types/index.ts`, the
  Zod enum in `src/lib/validators/procurement-request.ts`, `workflowTransitions`,
  `statusTone`, and `workflowStages` in `workflow.ts`. Keep all five in sync.

### Roles & access (`src/lib/auth.ts`, `middleware.ts`)
Roles: CUSTOMER, PROCUREMENT_OFFICER, LOGISTICS_OFFICER, FINANCE_OFFICER,
DISPUTE_MANAGER, ADMIN, SUPER_ADMIN.

- Route protection uses `canAccessPath(pathname, role)` with longest-prefix
  matching against `routeAccess`. Add new protected routes there.
- `middleware.ts` reads the `ntd_role` cookie and falls back to `ADMIN` **only
  in development**. Never weaken the production path.

## Security rules (hard constraints)

- Never commit `.env` (only `.env.example` is a template).
- Never expose `DATABASE_URL`, `AUTH_SECRET`, or `PAYSTACK_SECRET_KEY` to the
  client. Only `NEXT_PUBLIC_`-prefixed vars are client-visible.
- Validate all inbound data with Zod before use (see `src/lib/validators/`).
- Verify payment webhooks server-side; never trust client-reported payment.
- Local uploads write to `public/uploads` (gitignored). Production needs
  persistent object storage (Vercel Blob/S3).

## Conventions

- Mutations go in Server Actions (`actions.ts`), not client components.
- Add/extend domain types in `src/types/index.ts`; import via `@/types`.
- Use the existing `statusTone` / `humanizeStatus` helpers for status display.
- Match surrounding code style (double quotes, 2-space indent, no semicolon-free
  style — follow the file you're editing).
- For schema changes in production, use Prisma migrations, not `db push`.
