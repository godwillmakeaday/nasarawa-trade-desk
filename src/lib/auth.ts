import type { UserRole } from "@/types";

// This module must stay free of server-only APIs (e.g. next/headers): it is
// imported by middleware.ts, which runs in the Edge runtime. Cookie/session
// reads live in auth-session.ts instead.

export const roleLabels: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  PROCUREMENT_OFFICER: "Procurement officer",
  LOGISTICS_OFFICER: "Logistics officer",
  FINANCE_OFFICER: "Finance officer",
  DISPUTE_MANAGER: "Dispute manager",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super admin"
};

// Single source of truth for the role list, derived from roleLabels. Because
// roleLabels is a Record<UserRole, string>, the type checker forces it to stay
// complete when the UserRole union changes — so this list cannot go stale.
export const userRoles = Object.keys(roleLabels) as UserRole[];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (userRoles as string[]).includes(value);
}

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
