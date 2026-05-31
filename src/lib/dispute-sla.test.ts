import { describe, expect, it } from "vitest";
import {
  businessHoursBetween,
  canRespondAtLevel,
  currentEscalationLevel,
  escalationTiers,
  evaluateDisputeSla,
  getEscalationTier,
  INITIAL_ESCALATION_LEVEL,
  nextEscalationLevel
} from "@/lib/dispute-sla";

describe("currentEscalationLevel", () => {
  it("returns the initial tier when there is no escalation history", () => {
    expect(currentEscalationLevel([])).toBe(INITIAL_ESCALATION_LEVEL);
    expect(currentEscalationLevel([])).toBe("L1");
  });

  it("returns the highest level reached, regardless of order", () => {
    expect(currentEscalationLevel(["L2"])).toBe("L2");
    expect(currentEscalationLevel(["L2", "L3"])).toBe("L3");
    expect(currentEscalationLevel(["L3", "L2"])).toBe("L3");
  });

  it("is unaffected by duplicate or lower entries", () => {
    expect(currentEscalationLevel(["L2", "L1", "L2"])).toBe("L2");
  });
});

describe("escalation ladder", () => {
  it("defines L1, L2, L3 in ascending SLA order", () => {
    expect(escalationTiers.map((tier) => tier.level)).toEqual(["L1", "L2", "L3"]);
    const hours = escalationTiers.map((tier) => tier.slaBusinessHours);
    expect(hours).toEqual([...hours].sort((a, b) => a - b));
  });

  it("resolves a tier and throws on an unknown level", () => {
    expect(getEscalationTier("L2").owner).toBe("Dispute manager");
    // @ts-expect-error exercising the runtime guard with an invalid level
    expect(() => getEscalationTier("L9")).toThrow(/Unknown escalation level/);
  });

  it("walks to the next level and stops at the top", () => {
    expect(nextEscalationLevel("L1")).toBe("L2");
    expect(nextEscalationLevel("L2")).toBe("L3");
    expect(nextEscalationLevel("L3")).toBeNull();
  });
});

describe("canRespondAtLevel", () => {
  it("permits the tier's responders and rejects others", () => {
    expect(canRespondAtLevel("L1", "PROCUREMENT_OFFICER")).toBe(true);
    expect(canRespondAtLevel("L2", "DISPUTE_MANAGER")).toBe(true);
    expect(canRespondAtLevel("L3", "FINANCE_OFFICER")).toBe(true);

    expect(canRespondAtLevel("L1", "FINANCE_OFFICER")).toBe(false);
    expect(canRespondAtLevel("L2", "PROCUREMENT_OFFICER")).toBe(false);
    expect(canRespondAtLevel("L3", "CUSTOMER")).toBe(false);
  });

  it("always permits SUPER_ADMIN and ADMIN at every tier", () => {
    for (const tier of escalationTiers) {
      expect(canRespondAtLevel(tier.level, "ADMIN")).toBe(true);
      expect(canRespondAtLevel(tier.level, "SUPER_ADMIN")).toBe(true);
    }
  });
});

describe("evaluateDisputeSla", () => {
  it("reports within-SLA with positive remaining time", () => {
    const status = evaluateDisputeSla({ level: "L1", ageBusinessHours: 1 });
    expect(status.breached).toBe(false);
    expect(status.remainingBusinessHours).toBe(1); // 2h SLA - 1h age
    expect(status.shouldEscalate).toBe(false);
  });

  it("flags a breach once age exceeds the SLA", () => {
    const status = evaluateDisputeSla({ level: "L1", ageBusinessHours: 3 });
    expect(status.breached).toBe(true);
    expect(status.remainingBusinessHours).toBe(-1); // 2h SLA - 3h age
    expect(status.shouldEscalate).toBe(true);
    expect(status.nextLevel).toBe("L2");
  });

  it("does not escalate beyond L3 even when breached", () => {
    const status = evaluateDisputeSla({ level: "L3", ageBusinessHours: 100 });
    expect(status.breached).toBe(true);
    expect(status.shouldEscalate).toBe(false);
    expect(status.nextLevel).toBeNull();
  });

  it("treats the exact SLA boundary as not breached", () => {
    const status = evaluateDisputeSla({ level: "L2", ageBusinessHours: 8 });
    expect(status.breached).toBe(false);
    expect(status.remainingBusinessHours).toBe(0);
  });

  it("clamps negative ages to zero", () => {
    const status = evaluateDisputeSla({ level: "L1", ageBusinessHours: -5 });
    expect(status.ageBusinessHours).toBe(0);
    expect(status.breached).toBe(false);
  });
});

describe("businessHoursBetween", () => {
  it("returns 0 when end is at or before start", () => {
    const t = new Date("2026-06-01T10:00:00");
    expect(businessHoursBetween(t, t)).toBe(0);
    expect(businessHoursBetween(t, new Date("2026-06-01T09:00:00"))).toBe(0);
  });

  it("counts hours within a single business day", () => {
    // Monday 2026-06-01, 09:00 -> 13:00 = 4 working hours
    const start = new Date("2026-06-01T09:00:00");
    const end = new Date("2026-06-01T13:00:00");
    expect(businessHoursBetween(start, end)).toBeCloseTo(4, 5);
  });

  it("ignores time before 08:00 and after 17:00", () => {
    // Monday 06:00 -> 20:00 should clamp to the 08:00-17:00 window = 9 hours
    const start = new Date("2026-06-01T06:00:00");
    const end = new Date("2026-06-01T20:00:00");
    expect(businessHoursBetween(start, end)).toBeCloseTo(9, 5);
  });

  it("skips weekends", () => {
    // Friday 16:00 -> Monday 09:00: 1h Friday + 1h Monday = 2 working hours
    const friday = new Date("2026-06-05T16:00:00");
    const monday = new Date("2026-06-08T09:00:00");
    expect(businessHoursBetween(friday, monday)).toBeCloseTo(2, 5);
  });

  it("accumulates across multiple weekdays", () => {
    // Mon 16:00 -> Wed 09:00: 1h Mon + 9h Tue + 1h Wed = 11 working hours
    const start = new Date("2026-06-01T16:00:00");
    const end = new Date("2026-06-03T09:00:00");
    expect(businessHoursBetween(start, end)).toBeCloseTo(11, 5);
  });
});
