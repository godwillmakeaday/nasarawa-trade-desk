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
    currentLevel: "L1",
    note: "Customer unresponsive past SLA; moving to dispute manager."
  };

  it("accepts a complete valid escalation", () => {
    expect(disputeEscalationSchema.safeParse(valid).success).toBe(true);
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

  it("rejects an invalid level", () => {
    expect(
      disputeEscalationSchema.safeParse({ ...valid, currentLevel: "HIGH" }).success
    ).toBe(false);
  });
});
