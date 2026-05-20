# Folder Structure

```text
.
|-- docs/
|   |-- architecture.md
|   |-- folder-structure.md
|   `-- order-workflow.md
|-- prisma/
|   `-- schema.prisma
|-- public/
|   `-- nigeria-trade-lanes.svg
|-- src/
|   |-- app/
|   |   |-- dashboard/
|   |   |   |-- admin/
|   |   |   |-- audit/
|   |   |   |-- disputes/
|   |   |   |-- logistics/
|   |   |   |-- orders/
|   |   |   |-- procurement/
|   |   |   |-- layout.tsx
|   |   |   `-- page.tsx
|   |   |-- login/
|   |   |-- register/
|   |   |-- request/
|   |   |-- track/
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/
|   |   |-- dashboard/
|   |   `-- site/
|   |-- data/
|   |   `-- mock.ts
|   |-- lib/
|   |   |-- auth.ts
|   |   |-- format.ts
|   |   `-- workflow.ts
|   `-- types/
|       `-- index.ts
|-- middleware.ts
|-- package.json
|-- tailwind.config.ts
`-- tsconfig.json
```

## Boundaries

- `src/app`: routes, layouts, and server-rendered screen composition.
- `src/components`: reusable visual components. Dashboard components remain separate from public site components.
- `src/lib`: business rules, authorization helpers, formatting helpers, and workflow definitions.
- `src/data`: mock data for the prototype. Replace with Prisma queries when wiring the database.
- `prisma/schema.prisma`: PostgreSQL schema and generated Prisma client source of truth.
- `docs`: generated system architecture, folder map, and workflow design.
