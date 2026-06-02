import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validators/auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginSchema.safeParse({ email: "officer@example.com", password: "secret" }).success
    ).toBe(true);
  });

  it("accepts an optional next path", () => {
    const result = loginSchema.safeParse({
      email: "a@b.com",
      password: "x",
      next: "/dashboard/orders"
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});
