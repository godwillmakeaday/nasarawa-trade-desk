import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, cookieStore, compareMock, redirectMock, dbConfiguredMock } = vi.hoisted(
  () => ({
    prismaMock: { user: { findUnique: vi.fn() } },
    cookieStore: { set: vi.fn(), delete: vi.fn() },
    compareMock: vi.fn(),
    redirectMock: vi.fn((path: string) => {
      // next/navigation redirect throws to halt execution; emulate that so the
      // action stops after redirecting, like it does at runtime.
      throw new Error(`REDIRECT:${path}`);
    }),
    dbConfiguredMock: vi.fn(() => true)
  })
);

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("bcryptjs", () => ({ compare: compareMock }));
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("@/lib/database-status", () => ({
  isDatabaseConfigured: dbConfiguredMock,
  logDatabaseError: vi.fn()
}));

import { login } from "@/app/login/actions";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const activeUser = {
  id: "user_1",
  role: "PROCUREMENT_OFFICER",
  status: "ACTIVE",
  passwordHash: "hashed"
};

beforeEach(() => {
  vi.clearAllMocks();
  dbConfiguredMock.mockReturnValue(true);
  prismaMock.user.findUnique.mockResolvedValue(activeUser);
  compareMock.mockResolvedValue(true);
});

const state = { ok: false, message: "" };

describe("login", () => {
  it("sets role + user cookies and redirects on valid credentials", async () => {
    await expect(
      login(state, form({ email: "a@b.com", password: "right" }))
    ).rejects.toThrow("REDIRECT:/dashboard");

    expect(cookieStore.set).toHaveBeenCalledWith(
      "ntd_role",
      "PROCUREMENT_OFFICER",
      expect.objectContaining({ httpOnly: true })
    );
    expect(cookieStore.set).toHaveBeenCalledWith("ntd_user", "user_1", expect.anything());
  });

  it("honors an internal next path", async () => {
    await expect(
      login(state, form({ email: "a@b.com", password: "right", next: "/dashboard/audit" }))
    ).rejects.toThrow("REDIRECT:/dashboard/audit");
  });

  it("ignores an external next path (no open redirect)", async () => {
    await expect(
      login(state, form({ email: "a@b.com", password: "right", next: "https://evil.com" }))
    ).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("rejects a wrong password without setting cookies", async () => {
    compareMock.mockResolvedValue(false);
    const result = await login(state, form({ email: "a@b.com", password: "wrong" }));
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Invalid email or password.");
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("rejects an unknown email with the same generic message", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const result = await login(state, form({ email: "ghost@b.com", password: "x" }));
    expect(result.message).toBe("Invalid email or password.");
  });

  it("refuses a non-active account", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...activeUser, status: "SUSPENDED" });
    const result = await login(state, form({ email: "a@b.com", password: "right" }));
    expect(result.message).toBe("Invalid email or password.");
    expect(compareMock).not.toHaveBeenCalled();
  });

  it("blocks sign-in when the database is not configured", async () => {
    dbConfiguredMock.mockReturnValue(false);
    const result = await login(state, form({ email: "a@b.com", password: "x" }));
    expect(result.ok).toBe(false);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("rejects malformed input before hitting the database", async () => {
    const result = await login(state, form({ email: "not-email", password: "" }));
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toBeDefined();
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
});
