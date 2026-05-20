# Nasarawa Trade Desk

A modern procurement and logistics web platform for Nigerian regional trade. It connects buyers across Nigeria with a trusted procurement company operating in Nasarawa State markets.

## Generated Deliverables

- System architecture: `docs/architecture.md`
- Database schema: `prisma/schema.prisma`
- Folder structure: `docs/folder-structure.md`
- Homepage UI: `src/app/page.tsx`
- Dashboard layout: `src/app/dashboard/layout.tsx` and `src/app/dashboard/page.tsx`
- Order workflow structure: `docs/order-workflow.md` and `src/lib/workflow.ts`

## Features Covered

- Customer authentication screens.
- Role based dashboard structure.
- Authenticated user role matrix and protected operational workspaces.
- Procurement officer profiles with market desk, language coverage, specialties, and supervisor.
- Procurement request creation with product reference image upload controls.
- Admin dashboard, role matrix, and protected admin routes.
- Order tracking and procurement workflow.
- Realistic procurement state transitions with required operational evidence.
- Transport assignment system with carrier, driver, vehicle, manifest, route risk, and release gate.
- Proof-of-delivery upload model.
- Inspection evidence gallery.
- Logistics tracking and delivery event timeline.
- Dispute handling.
- Dispute escalation workflow with SLA levels.
- WhatsApp communication integration with linked order context.
- Transaction logs and audit trails.
- PostgreSQL schema through Prisma.
- Responsive Tailwind CSS UI.

## Run Locally

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

Set `DATABASE_URL`, `AUTH_SECRET`, and payment provider secrets before connecting real authentication, uploads, payments, and webhooks.

## Environment Variables

Create these in `.env` for local development and in Vercel Project Settings for Preview and Production deployments.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. Use a production Postgres database for Vercel. |
| `AUTH_SECRET` | Yes | Long random secret used by authentication/session signing. |
| `AUTH_URL` | Yes | Public application URL. Locally use `http://localhost:3000`; in production use your Vercel or custom domain URL. |
| `PAYSTACK_SECRET_KEY` | Later | Payment provider secret for secure payment verification. Keep server-side only. |
| `UPLOAD_MAX_MB` | Optional | Maximum upload size in MB. Defaults should match the request form limits. |
| `UPLOAD_STORAGE_DRIVER` | Optional | Use `local` only for development. Production deployments should use persistent object storage. |

Do not commit `.env` files. Use `.env.example` only as a template.

## Database Setup

For local development:

```bash
npm run db:generate
npm run db:push
```

For a real deployment, provision PostgreSQL first, set `DATABASE_URL` in Vercel, then apply the Prisma schema from a trusted machine or CI step:

```bash
npm run db:generate
npx prisma db push
```

For production teams, replace `db push` with Prisma migrations before handling real customer orders.

## Deployment To Vercel From GitHub

This project is ready for GitHub-based Vercel deployment:

1. Push the project to a GitHub repository.
2. In Vercel, create a new project and import the GitHub repository.
3. Set the framework preset to Next.js if Vercel does not detect it automatically.
4. Keep the build command as `npm run build`.
5. Keep the install command as the default `npm install`.
6. Add the environment variables listed above in Vercel Project Settings.
7. Deploy the project.

The `postinstall` script runs `prisma generate`, so Vercel has a generated Prisma Client before `next build` runs.

Vercel creates preview deployments for pull requests and production deployments from the production branch, usually `main`.

## Production Notes

- `npm run build` must pass before deployment.
- `/dashboard` and `/track` are dynamic routes because they read live Prisma data at request time.
- Local uploads write to `public/uploads`, which is ignored by Git. Vercel serverless deployments need persistent object storage such as Vercel Blob, S3, or another storage service before accepting production reference-image uploads.
- Do not expose `PAYSTACK_SECRET_KEY`, `DATABASE_URL`, or `AUTH_SECRET` to the browser. Only variables prefixed with `NEXT_PUBLIC_` should be considered client-visible.

## Deployment References

- [Vercel Git deployments](https://vercel.com/docs/deployments/git)
- [Vercel environment variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js on Vercel](https://vercel.com/docs/concepts/next.js/overview)
