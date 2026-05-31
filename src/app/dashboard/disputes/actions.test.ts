import { beforeEach, describe, expect, it, vi } from "vitest";

// --- Test doubles for the action's external dependencies ------------------
// The dispute action talks to Prisma, the role cookie, and Next's cache. We
// mock those boundaries so the action's own logic — validation, the SLA
// guards, and the shape of what it writes — is exercised without a database.

const { prismaMock, resolveActorRoleMock, revalidatePathMock } = vi.hoisted(() => ({
  prismaMock: {
    dispute: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    disputeEscalation: { create: vi.fn() },
    auditTrail: { create: vi.fn() },
    transactionLog: { create: vi.fn() },
    $transaction: vi.fn(async (ops: unknown[]) => ops)
  },
  resolveActorRoleMock: vi.fn(),
  revalidatePathMock: vi.fn()
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({ resolveActorRole: resolveActorRoleMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

import { escalateDispute } from "@/app/dashboard/disputes/actions";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

const validFields = {
  disputeId: "dsp_1",
  note: "Customer unresponsive past SLA; escalating to dispute manager."
};

// Helper: a dispute whose current tier is derived from its escalation history.
// An empty history means the dispute is still at its initial tier (L1).
function disputeAt(levels: string[]) {
  return {
    id: "dsp_1",
    status: "OPEN",
    reporterId: "user_1",
    procurementRequestId: "req_1",
    escalations: levels.map((level) => ({ level }))
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  resolveActorRoleMock.mockResolvedValue("PROCUREMENT_OFFICER");
  prismaMock.dispute.findUnique.mockResolvedValue(disputeAt([]));
});

describe("escalateDispute", () => {
  it("escalates a valid L1 dispute to L2 and writes audit + transaction", async () => {
    await escalateDispute(form(validFields));

    expect(prismaMock.disputeEscalation.create).toHaveBeenCalledOnce();
    const escalation = prismaMock.disputeEscalation.create.mock.calls[0][0].data;
    expect(escalation.level).toBe("L2");
    expect(escalation.status).toBe("ESCALATED");

    expect(prismaMock.dispute.update).toHaveBeenCalledWith({
      where: { id: "dsp_1" },
      data: { status: "ESCALATED" }
    });
    expect(prismaMock.auditTrail.create).toHaveBeenCalledOnce();
    expect(prismaMock.transactionLog.create).toHaveBeenCalledOnce();
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard/disputes");
  });

  it("rejects a role not permitted to respond at the current tier", async () => {
    resolveActorRoleMock.mockResolvedValue("FINANCE_OFFICER"); // not an L1 responder
    await expect(escalateDispute(form(validFields))).rejects.toThrow(/not permitted/);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("derives the current tier from history and rejects a disallowed role", async () => {
    // History reaching L2 means a PROCUREMENT_OFFICER (an L1-only responder)
    // may no longer act, even though the form carries no level field.
    prismaMock.dispute.findUnique.mockResolvedValue(disputeAt(["L2"]));
    await expect(escalateDispute(form(validFields))).rejects.toThrow(/not permitted/);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("refuses to escalate beyond the top tier (L3)", async () => {
    resolveActorRoleMock.mockResolvedValue("ADMIN"); // permitted at L3, so the tier guard is what trips
    prismaMock.dispute.findUnique.mockResolvedValue(disputeAt(["L2", "L3"]));
    await expect(escalateDispute(form(validFields))).rejects.toThrow(/highest escalation tier/);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("rejects invalid input before touching the database", async () => {
    await expect(
      escalateDispute(form({ ...validFields, note: "late" }))
    ).rejects.toThrow();
    expect(prismaMock.dispute.findUnique).not.toHaveBeenCalled();
  });

  it("throws when the dispute does not exist", async () => {
    prismaMock.dispute.findUnique.mockResolvedValue(null);
    await expect(escalateDispute(form(validFields))).rejects.toThrow(/not found/);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("allows an admin to escalate from a higher tier", async () => {
    resolveActorRoleMock.mockResolvedValue("ADMIN");
    prismaMock.dispute.findUnique.mockResolvedValue(disputeAt(["L2"]));
    await escalateDispute(form(validFields));
    const escalation = prismaMock.disputeEscalation.create.mock.calls[0][0].data;
    expect(escalation.level).toBe("L3");
  });
});
