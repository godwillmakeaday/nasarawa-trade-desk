import type { UserRole } from "@/types";

export type EscalationLevel = "L1" | "L2" | "L3";

export type EscalationTier = {
  level: EscalationLevel;
  owner: string;
  /** Roles permitted to act on a dispute at this tier. */
  responders: UserRole[];
  /** Service-level target in business hours from dispute open. */
  slaBusinessHours: number;
  trigger: string;
  action: string;
};

/**
 * Authoritative SLA ladder for dispute handling. The dashboard renders these as
 * display cards, but the durations and responders are also the source of truth
 * for breach detection and escalation routing below. Keep tiers ordered by
 * ascending severity (L1 -> L3).
 */
export const escalationTiers: EscalationTier[] = [
  {
    level: "L1",
    owner: "Customer desk",
    responders: ["PROCUREMENT_OFFICER", "ADMIN", "SUPER_ADMIN"],
    slaBusinessHours: 2,
    trigger: "Late update, missing document, or customer clarification",
    action: "Respond on WhatsApp and attach note to order"
  },
  {
    level: "L2",
    owner: "Dispute manager",
    responders: ["DISPUTE_MANAGER", "ADMIN", "SUPER_ADMIN"],
    slaBusinessHours: 8,
    trigger: "Quality mismatch, missing item, price variance, or delivery exception",
    action: "Freeze completion, gather evidence, and recommend replacement, refund, or acceptance"
  },
  {
    level: "L3",
    owner: "Admin and finance",
    responders: ["FINANCE_OFFICER", "ADMIN", "SUPER_ADMIN"],
    slaBusinessHours: 24,
    trigger: "Refund exposure, supplier breach, suspected fraud, or unresolved carrier issue",
    action: "Approve financial remedy and write final audit decision"
  }
];

const escalationOrder: EscalationLevel[] = ["L1", "L2", "L3"];

/** The tier every dispute starts at before any escalation has been recorded. */
export const INITIAL_ESCALATION_LEVEL: EscalationLevel = "L1";

/**
 * Derives a dispute's current tier from its escalation history — the highest
 * level any recorded escalation reached, or the initial tier when there are
 * none. This is the authoritative current level; never trust a client value.
 */
export function currentEscalationLevel(
  escalationLevels: EscalationLevel[]
): EscalationLevel {
  return escalationLevels.reduce<EscalationLevel>((highest, level) => {
    return escalationOrder.indexOf(level) > escalationOrder.indexOf(highest)
      ? level
      : highest;
  }, INITIAL_ESCALATION_LEVEL);
}

export function getEscalationTier(level: EscalationLevel): EscalationTier {
  const tier = escalationTiers.find((item) => item.level === level);
  if (!tier) {
    throw new Error(`Unknown escalation level: ${level}`);
  }
  return tier;
}

/**
 * The tier a dispute escalates to next, or `null` when already at the top (L3).
 */
export function nextEscalationLevel(level: EscalationLevel): EscalationLevel | null {
  const index = escalationOrder.indexOf(level);
  if (index === -1 || index === escalationOrder.length - 1) {
    return null;
  }
  return escalationOrder[index + 1];
}

export function canRespondAtLevel(level: EscalationLevel, role: UserRole): boolean {
  return getEscalationTier(level).responders.includes(role);
}

export type DisputeSlaStatus = {
  level: EscalationLevel;
  slaBusinessHours: number;
  ageBusinessHours: number;
  breached: boolean;
  /**
   * Business hours until breach (positive) or past breach (negative), rounded
   * to one decimal place.
   */
  remainingBusinessHours: number;
  shouldEscalate: boolean;
  nextLevel: EscalationLevel | null;
};

/**
 * Evaluates a dispute's SLA position from elapsed business hours. Pure: callers
 * compute elapsed time with `businessHoursBetween` (or their own clock) and
 * pass it in, so this stays deterministic and unit-testable. A breach at a tier
 * with headroom above it signals that the dispute should escalate.
 */
export function evaluateDisputeSla(input: {
  level: EscalationLevel;
  ageBusinessHours: number;
}): DisputeSlaStatus {
  const tier = getEscalationTier(input.level);
  const age = Math.max(0, input.ageBusinessHours);
  const breached = age > tier.slaBusinessHours;
  const next = nextEscalationLevel(input.level);

  return {
    level: input.level,
    slaBusinessHours: tier.slaBusinessHours,
    ageBusinessHours: round1(age),
    breached,
    remainingBusinessHours: round1(tier.slaBusinessHours - age),
    shouldEscalate: breached && next !== null,
    nextLevel: next
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

const BUSINESS_DAY_START_HOUR = 8; // 08:00 WAT
const BUSINESS_DAY_END_HOUR = 17; // 17:00 WAT
const BUSINESS_HOURS_PER_DAY = BUSINESS_DAY_END_HOUR - BUSINESS_DAY_START_HOUR;

// Nasarawa operates in West Africa Time (UTC+1), which Nigeria observes
// year-round with no daylight saving. We interpret the 08:00–17:00 working
// window and weekday boundaries in WAT regardless of the server's timezone
// (Vercel runs UTC) by shifting instants by this fixed offset and reading them
// with UTC accessors. Elapsed-millisecond math is offset-invariant, so only the
// wall-clock boundaries need the shift.
const WAT_OFFSET_MS = 60 * 60 * 1000;

/**
 * Counts business hours between two instants, Monday–Friday within an
 * 08:00–17:00 WAT working window. Time outside the window or on weekends does
 * not accrue against an SLA. Returns 0 when `end` precedes `start`.
 */
export function businessHoursBetween(start: Date, end: Date): number {
  if (end <= start) {
    return 0;
  }

  let total = 0;
  // Shift into "WAT wall-clock" space so getUTC*/setUTC* read WAT fields.
  const cursor = new Date(start.getTime() + WAT_OFFSET_MS);
  const watEnd = new Date(end.getTime() + WAT_OFFSET_MS);

  while (cursor < watEnd) {
    const day = cursor.getUTCDay(); // 0 = Sunday, 6 = Saturday (in WAT)
    const isWeekday = day >= 1 && day <= 5;

    if (isWeekday) {
      const dayStart = new Date(cursor);
      dayStart.setUTCHours(BUSINESS_DAY_START_HOUR, 0, 0, 0);
      const dayEnd = new Date(cursor);
      dayEnd.setUTCHours(BUSINESS_DAY_END_HOUR, 0, 0, 0);

      const windowStart = cursor > dayStart ? cursor : dayStart;
      const windowEnd = watEnd < dayEnd ? watEnd : dayEnd;

      if (windowEnd > windowStart) {
        total += (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
      }
    }

    // Advance to the start of the next WAT calendar day.
    cursor.setUTCHours(24, 0, 0, 0);
  }

  return Math.min(total, BUSINESS_HOURS_PER_DAY * 7 * 520); // guard against pathological ranges
}
