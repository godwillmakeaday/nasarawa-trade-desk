import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the data + logging boundaries; the signature/parse logic runs for real
// so the test also proves the route trusts only correctly signed payloads.
const { prismaMock, logDatabaseErrorMock } = vi.hoisted(() => ({
  prismaMock: {
    payment: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    transactionLog: { create: vi.fn() },
    auditTrail: { create: vi.fn() },
    $transaction: vi.fn(async (ops: unknown[]) => ops)
  },
  logDatabaseErrorMock: vi.fn()
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/database-status", () => ({ logDatabaseError: logDatabaseErrorMock }));

import { POST } from "@/app/api/webhooks/paystack/route";

const SECRET = "sk_test_webhook_secret";

function sign(body: string, key = SECRET) {
  return createHmac("sha512", key).update(body, "utf8").digest("hex");
}

/** Minimal NextRequest stand-in exposing the bits the route reads. */
function makeRequest(rawBody: string, signature?: string | null) {
  return {
    text: async () => rawBody,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "x-paystack-signature" ? signature ?? null : null
    }
  } as unknown as Parameters<typeof POST>[0];
}

function successBody(reference = "ref_pay_1", amount = 250000) {
  return JSON.stringify({
    event: "charge.success",
    data: { reference, amount, currency: "NGN", status: "success" }
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.PAYSTACK_SECRET_KEY = SECRET;
});

afterEach(() => {
  delete process.env.PAYSTACK_SECRET_KEY;
});

describe("POST /api/webhooks/paystack", () => {
  it("returns 503 when the secret is not configured", async () => {
    delete process.env.PAYSTACK_SECRET_KEY;
    const res = await POST(makeRequest(successBody(), sign(successBody())));
    expect(res.status).toBe(503);
    expect(prismaMock.payment.findUnique).not.toHaveBeenCalled();
  });

  it("returns 401 on an invalid signature", async () => {
    const body = successBody();
    const res = await POST(makeRequest(body, "deadbeef"));
    expect(res.status).toBe(401);
    expect(prismaMock.payment.findUnique).not.toHaveBeenCalled();
  });

  it("returns 401 when the signature is missing", async () => {
    const body = successBody();
    const res = await POST(makeRequest(body, null));
    expect(res.status).toBe(401);
  });

  it("returns 400 on a signed but unrecognized payload", async () => {
    const body = JSON.stringify({ not: "a paystack event" });
    const res = await POST(makeRequest(body, sign(body)));
    expect(res.status).toBe(400);
    expect(prismaMock.payment.findUnique).not.toHaveBeenCalled();
  });

  it("acknowledges without applying for a non-success event", async () => {
    const body = JSON.stringify({
      event: "charge.failed",
      data: { reference: "ref_x", amount: 100, currency: "NGN", status: "failed" }
    });
    const res = await POST(makeRequest(body, sign(body)));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ received: true, applied: false });
    expect(prismaMock.payment.findUnique).not.toHaveBeenCalled();
  });

  it("acknowledges without applying when the reference is unknown", async () => {
    prismaMock.payment.findUnique.mockResolvedValue(null);
    const body = successBody("ref_unknown");
    const res = await POST(makeRequest(body, sign(body)));
    await expect(res.json()).resolves.toMatchObject({ received: true, applied: false });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("treats an already-paid reference as an idempotent duplicate", async () => {
    prismaMock.payment.findUnique.mockResolvedValue({
      id: "pay_1",
      orderId: "ord_1",
      status: "PAID",
      amount: 2500,
      currency: "NGN"
    });
    const body = successBody();
    const res = await POST(makeRequest(body, sign(body)));
    await expect(res.json()).resolves.toMatchObject({
      received: true,
      applied: false,
      duplicate: true
    });
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("marks the payment PAID and records audit + transaction on success", async () => {
    prismaMock.payment.findUnique.mockResolvedValue({
      id: "pay_2",
      orderId: "ord_2",
      status: "INITIATED",
      amount: 5000, // expected naira, matches 500000 kobo below
      currency: "NGN"
    });
    const body = successBody("ref_pay_2", 500000);
    const res = await POST(makeRequest(body, sign(body)));

    await expect(res.json()).resolves.toMatchObject({ received: true, applied: true });
    expect(prismaMock.payment.update).toHaveBeenCalledOnce();
    const updateArg = prismaMock.payment.update.mock.calls[0][0];
    expect(updateArg.where).toEqual({ id: "pay_2" });
    expect(updateArg.data.status).toBe("PAID");

    expect(prismaMock.transactionLog.create).toHaveBeenCalledOnce();
    const txArg = prismaMock.transactionLog.create.mock.calls[0][0].data;
    expect(txArg.eventType).toBe("PAYMENT_VERIFIED");
    expect(txArg.amount).toBe(5000); // 500000 kobo -> 5000 naira
    expect(txArg.providerRef).toBe("ref_pay_2");

    expect(prismaMock.auditTrail.create).toHaveBeenCalledOnce();
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
  });

  it("returns 500 and logs when the database write fails", async () => {
    prismaMock.payment.findUnique.mockResolvedValue({
      id: "pay_3",
      orderId: "ord_3",
      status: "INITIATED",
      amount: 2500,
      currency: "NGN"
    });
    prismaMock.$transaction.mockRejectedValueOnce(new Error("db down"));
    const body = successBody("ref_pay_3");
    const res = await POST(makeRequest(body, sign(body)));

    expect(res.status).toBe(500);
    expect(logDatabaseErrorMock).toHaveBeenCalledOnce();
  });

  it("rejects a signed success whose amount does not match the order", async () => {
    prismaMock.payment.findUnique.mockResolvedValue({
      id: "pay_4",
      orderId: "ord_4",
      status: "INITIATED",
      amount: 5000, // order expects 5000 naira...
      currency: "NGN"
    });
    const body = successBody("ref_pay_4", 100); // ...but only 1 naira was charged
    const res = await POST(makeRequest(body, sign(body)));

    expect(res.status).toBe(422);
    await expect(res.json()).resolves.toMatchObject({ applied: false, mismatch: true });
    expect(prismaMock.payment.update).not.toHaveBeenCalled();
    expect(prismaMock.transactionLog.create).toHaveBeenCalledOnce(); // the mismatch is logged
    const txArg = prismaMock.transactionLog.create.mock.calls[0][0].data;
    expect(txArg.eventType).toBe("PAYMENT_MISMATCH");
  });

  it("rejects a signed success in the wrong currency", async () => {
    prismaMock.payment.findUnique.mockResolvedValue({
      id: "pay_5",
      orderId: "ord_5",
      status: "INITIATED",
      amount: 2500,
      currency: "NGN"
    });
    const body = JSON.stringify({
      event: "charge.success",
      data: { reference: "ref_pay_5", amount: 250000, currency: "USD", status: "success" }
    });
    const res = await POST(makeRequest(body, sign(body)));

    expect(res.status).toBe(422);
    expect(prismaMock.payment.update).not.toHaveBeenCalled();
  });
});
