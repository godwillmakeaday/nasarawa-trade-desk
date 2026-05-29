export function isDatabaseConfigured() {
  // Production database setup: configure DATABASE_URL in Vercel Project Settings
  // or the hosting provider's server-side environment variables. Never expose it
  // as a NEXT_PUBLIC_* variable because it must remain server-only.
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function databaseSetupHint() {
  return "Live database mode is not configured yet. The platform is showing safe demo data until production PostgreSQL is connected.";
}

export function logDatabaseError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[database:${scope}]`, error);
  }
}
