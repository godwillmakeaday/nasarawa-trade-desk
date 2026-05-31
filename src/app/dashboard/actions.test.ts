import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, resolveActorRoleMock, revalidatePathMock } = vi.hoisted(() => ({
  prismaMock: {
    procurementRequest: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    auditTrail: { create: vi.fn() },
    transactionLog: { create: vi.fn() },
    $transaction: vi.fn(async (ops: unknown[]) => ops)
  },
  resolveActorRoleMock: vi.fn(),
  revalidatePathMock: vi.fn()
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth-session", () => ({ resolveActorRole: resolveActorRoleMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

import { updateProcurementRequestStatus } from "@/app/dashboard/actions";

function form(fields: Record<string, string>, evidence: string[] = []) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  for (const item of evidence) {
    fd.append("evidence", item);
  }
  return fd;
}

// SUBMITTED -> SOURCING requires a procurement officer + three evidence items.
const SOURCING_EVIDENCE = [
  "verified buyer profile",
  "target market",
  "assigned procurement officer"
];

beforeEach(() => {
  vi.clearAllMocks();
  resolveActorRoleMock.mockResolvedValue("PROCUREMENT_OFFICER");
  prismaMock.procurementRequest.findUnique.mockResolvedValue({
    id: "req_1",
    requestNumber: "NRP-1",
    status: "SUBMITTED",
    customerId: "cust_1"
  });
});

describe("updateProcurementRequestStatus evidence gate", () => {
  it("rejects a guarded transition when an evidence item is missing", async () => {
    await expect(
      updateProcurementRequestStatus(
        form({ requestId: "req_1", status: "SOURCING" }, ["verified buyer profile"])
      )
    ).rejects.toThrow(/Missing required evidence/);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("rejects when no evidence is provided at all", async () => {
    await expect(
      updateProcurementRequestStatus(form({ requestId: "req_1", status: "SOURCING" }))
    ).rejects.toThrow(/Missing required evidence/);
  });

  it("accepts when every required item is individually attached", async () => {
    await updateProcurementRequestStatus(
      form({ requestId: "req_1", status: "SOURCING" }, SOURCING_EVIDENCE)
    );
    expect(prismaMock.procurementRequest.update).toHaveBeenCalledWith({
      where: { id: "req_1" },
      data: { status: "SOURCING" }
    });
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
  });

  it("records the attested evidence and real actor role in the audit payload", async () => {
    await updateProcurementRequestStatus(
      form({ requestId: "req_1", status: "SOURCING" }, SOURCING_EVIDENCE)
    );
    const audit = prismaMock.auditTrail.create.mock.calls[0][0].data;
    expect(audit.actorId).toBeNull(); // never falsely attributed to the customer
    expect(audit.after.actorRole).toBe("PROCUREMENT_OFFICER");
    expect(audit.after.workflowAction).toBe("REQUEST_ACCEPTED_FOR_SOURCING");
    expect(audit.after.evidence).toEqual(SOURCING_EVIDENCE);
  });

  it("rejects a transition attempted by a disallowed role", async () => {
    resolveActorRoleMock.mockResolvedValue("LOGISTICS_OFFICER");
    await expect(
      updateProcurementRequestStatus(
        form({ requestId: "req_1", status: "SOURCING" }, SOURCING_EVIDENCE)
      )
    ).rejects.toThrow(/not allowed/);
  });

  it("allows a no-op save without evidence and still writes an audit row", async () => {
    await updateProcurementRequestStatus(form({ requestId: "req_1", status: "SUBMITTED" }));
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    const audit = prismaMock.auditTrail.create.mock.calls[0][0].data;
    expect(audit.after.evidence).toEqual([]);
    expect(audit.after.workflowAction).toBeNull();
  });
});
