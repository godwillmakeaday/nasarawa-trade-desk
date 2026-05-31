import { cookies } from "next/headers";
import type { UserRole } from "@/types";

export const userRoles: UserRole[] = [
  "CUSTOMER",
  "PROCUREMENT_OFFICER",
  "LOGISTICS_OFFICER",
  "FINANCE_OFFICER",
  "DISPUTE_MANAGER",
  "ADMIN",
  "SUPER_ADMIN"
];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (userRoles as string[]).includes(value);
}

/**
 * Resolves the acting user's role for a Server Action from the `ntd_role`
 * cookie — the same signal `middleware.ts` uses for route protection. Falls
 * back to ADMIN only in development so local previews work before real auth is
 * wired; production requires a valid role cookie/session.
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

export const roleLabels: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  PROCUREMENT_OFFICER: "Procurement officer",
  LOGISTICS_OFFICER: "Logistics officer",
  FINANCE_OFFICER: "Finance officer",
  DISPUTE_MANAGER: "Dispute manager",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super admin"
};

export const routeAccess: Array<{
  pattern: string;
  roles: UserRole[];
}> = [
  {
    pattern: "/dashboard",
    roles: [
      "CUSTOMER",
      "PROCUREMENT_OFFICER",
      "LOGISTICS_OFFICER",
      "FINANCE_OFFICER",
      "DISPUTE_MANAGER",
      "ADMIN",
      "SUPER_ADMIN"
    ]
  },
  {
    pattern: "/dashboard/admin",
    roles: ["ADMIN", "SUPER_ADMIN"]
  },
  {
    pattern: "/dashboard/audit",
    roles: ["ADMIN", "SUPER_ADMIN"]
  },
  {
    pattern: "/dashboard/procurement",
    roles: ["PROCUREMENT_OFFICER", "ADMIN", "SUPER_ADMIN"]
  },
  {
    pattern: "/dashboard/logistics",
    roles: ["LOGISTICS_OFFICER", "ADMIN", "SUPER_ADMIN"]
  },
  {
    pattern: "/dashboard/disputes",
    roles: ["DISPUTE_MANAGER", "ADMIN", "SUPER_ADMIN"]
  }
];

export function canAccessPath(pathname: string, role?: UserRole) {
  if (!role) {
    return false;
  }

  const matchedRule = [...routeAccess]
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .find((rule) => pathname.startsWith(rule.pattern));

  return matchedRule ? matchedRule.roles.includes(role) : true;
}
