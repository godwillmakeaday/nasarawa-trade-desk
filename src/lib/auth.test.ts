import { describe, expect, it } from "vitest";
import type { UserRole } from "@/types";
import { canAccessPath, isUserRole, roleLabels, userRoles } from "@/lib/auth";

describe("canAccessPath", () => {
  it("denies access when no role is supplied", () => {
    expect(canAccessPath("/dashboard", undefined)).toBe(false);
    expect(canAccessPath("/dashboard/admin", undefined)).toBe(false);
  });

  it("lets every operational role reach the dashboard root", () => {
    for (const role of userRoles) {
      expect(canAccessPath("/dashboard", role)).toBe(true);
    }
  });

  it("restricts /dashboard/admin to ADMIN and SUPER_ADMIN", () => {
    expect(canAccessPath("/dashboard/admin", "ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/admin", "SUPER_ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/admin", "PROCUREMENT_OFFICER")).toBe(false);
    expect(canAccessPath("/dashboard/admin", "CUSTOMER")).toBe(false);
  });

  it("restricts /dashboard/audit to ADMIN and SUPER_ADMIN", () => {
    expect(canAccessPath("/dashboard/audit", "ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/audit", "LOGISTICS_OFFICER")).toBe(false);
  });

  it("scopes /dashboard/procurement to procurement officers and admins", () => {
    expect(canAccessPath("/dashboard/procurement", "PROCUREMENT_OFFICER")).toBe(true);
    expect(canAccessPath("/dashboard/procurement", "ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/procurement", "SUPER_ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/procurement", "LOGISTICS_OFFICER")).toBe(false);
    expect(canAccessPath("/dashboard/procurement", "FINANCE_OFFICER")).toBe(false);
  });

  it("scopes /dashboard/logistics to logistics officers and admins", () => {
    expect(canAccessPath("/dashboard/logistics", "LOGISTICS_OFFICER")).toBe(true);
    expect(canAccessPath("/dashboard/logistics", "ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/logistics", "PROCUREMENT_OFFICER")).toBe(false);
  });

  it("scopes /dashboard/disputes to dispute managers and admins", () => {
    expect(canAccessPath("/dashboard/disputes", "DISPUTE_MANAGER")).toBe(true);
    expect(canAccessPath("/dashboard/disputes", "ADMIN")).toBe(true);
    expect(canAccessPath("/dashboard/disputes", "CUSTOMER")).toBe(false);
  });

  it("uses longest-prefix matching so nested routes inherit their own rule", () => {
    // A customer can see /dashboard but not the admin sub-tree underneath it.
    expect(canAccessPath("/dashboard", "CUSTOMER")).toBe(true);
    expect(canAccessPath("/dashboard/admin/settings", "CUSTOMER")).toBe(false);
    expect(canAccessPath("/dashboard/admin/settings", "ADMIN")).toBe(true);
  });

  it("allows unmatched paths through (protection is opt-in via routeAccess)", () => {
    expect(canAccessPath("/track", "CUSTOMER")).toBe(true);
    expect(canAccessPath("/", "CUSTOMER")).toBe(true);
  });
});

describe("isUserRole", () => {
  it("accepts every known role", () => {
    for (const role of userRoles) {
      expect(isUserRole(role)).toBe(true);
    }
  });

  it("rejects unknown or malformed values", () => {
    expect(isUserRole("ROOT")).toBe(false);
    expect(isUserRole("")).toBe(false);
    expect(isUserRole(undefined)).toBe(false);
    expect(isUserRole(42)).toBe(false);
  });
});

describe("roleLabels", () => {
  it("provides a human label for every role", () => {
    for (const role of userRoles) {
      expect(roleLabels[role as UserRole]).toBeTruthy();
    }
  });
});
