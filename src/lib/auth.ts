import type { UserRole } from "@/types";

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
