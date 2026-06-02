import { describe, expect, it } from "vitest";
import {
  disputeEscalationSchema,
  escalationLevelSchema
} from "@/lib/validators/dispute";

describe("escalationLevelSchema", () => {
  it("accepts the three known tiers", () => {
    for (const level of ["L1", "L2", "L3"]) {
      expect(escalationLevelSchema.safeParse(level).success).toBe(true);
    }
  });

  it("rejects unknown tiers", () => {
    expect(escalationLevelSchema.safeParse("L4").success).toBe(false);
    expect(escalationLevelSchema.safeParse("").success).toBe(false);
  });
});

describe("disputeEscalationSchema", () => {
  const valid = {
    disputeId: "dsp_123",
    note: "Customer unresponsive past SLA; moving to dispute manager."
  };

  it("accepts a valid escalation (no client-supplied level)", () => {
    expect(disputeEscalationSchema.safeParse(valid).success).toBe(true);
  });

  it("ignores any client-supplied level field", () => {
    // The current tier is derived server-side; a level in the payload must not
    // be trusted, and its presence does not break parsing.
    const result = disputeEscalationSchema.safeParse({ ...valid, currentLevel: "L3" });
    expect(result.success).toBe(true);
    expect(result.success && "currentLevel" in result.data).toBe(false);
  });

  it("rejects an empty disputeId", () => {
    expect(
      disputeEscalationSchema.safeParse({ ...valid, disputeId: "" }).success
    ).toBe(false);
  });

  it("rejects a too-short note", () => {
    expect(
      disputeEscalationSchema.safeParse({ ...valid, note: "late" }).success
    ).toBe(false);
  });
});
