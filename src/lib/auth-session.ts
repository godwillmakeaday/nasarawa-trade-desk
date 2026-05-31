import { cookies } from "next/headers";
import { isUserRole } from "@/lib/auth";
import type { UserRole } from "@/types";

/**
 * Resolves the acting user's role for a Server Action from the `ntd_role`
 * cookie — the same signal `middleware.ts` uses for route protection. Falls
 * back to ADMIN only in development so local previews work before real auth is
 * wired; production requires a valid role cookie/session.
 *
 * Lives in a server-only module (it reads `next/headers`) so the Edge-runtime
 * middleware can import the pure helpers in `auth.ts` without pulling this in.
 */
export async function resolveActorRole(): Promise<UserRole> {
  const cookieRole = (await cookies()).get("ntd_role")?.value;

  if (isUserRole(cookieRole)) {
    return cookieRole;
  }

  if (process.env.NODE_ENV === "development") {
    return "ADMIN";
  }

  throw new Error("You must be signed in with an authorized role to do this.");
}
