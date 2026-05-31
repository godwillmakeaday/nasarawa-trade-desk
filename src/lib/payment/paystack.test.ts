import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  computePaystackSignature,
  parsePaystackEvent,
  paymentMatchesExpectation,
  resolvePaymentOutcome,
  verifyPaystackSignature
} from "@/lib/payment/paystack";

const secret = "sk_test_example_secret";

function sign(body: string, key = secret) {
  return createHmac("sha512", key).update(body, "utf8").digest("hex");
}

describe("computePaystackSignature", () => {
  it("produces a stable HMAC SHA-512 hex digest", () => {
    const body = JSON.stringify({ event: "charge.success" });
    expect(computePaystackSignature(body, secret)).toBe(sign(body));
    expect(computePaystackSignature(body, secret)).toHaveLength(128);
  });
});

describe("verifyPaystackSignature", () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: "ref_1" } });

  it("accepts a correctly signed body", () => {
    expect(verifyPaystackSignature(body, sign(body), secret)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const tampered = body.replace("ref_1", "ref_evil");
    expect(verifyPaystackSignature(tampered, sign(body), secret)).toBe(false);
  });

  it("rejects a signature made with the wrong secret", () => {
    expect(verifyPaystackSignature(body, sign(body, "wrong"), secret)).toBe(false);
  });

  it("rejects missing signature or secret", () => {
    expect(verifyPaystackSignature(body, null, secret)).toBe(false);
    expect(verifyPaystackSignature(body, undefined, secret)).toBe(false);
    expect(verifyPaystackSignature(body, sign(body), "")).toBe(false);
  });

  it("rejects a signature of the wrong length without throwing", () => {
    expect(verifyPaystackSignature(body, "abc123", secret)).toBe(false);
  });
});

describe("parsePaystackEvent", () => {
  it("parses a well-formed event", () => {
    const event = parsePaystackEvent(
      JSON.stringify({
        event: "charge.success",
        data: { reference: "ref_9", amount: 250000, currency: "NGN", status: "success" }
      })
    );
    expect(event).not.toBeNull();
    expect(event?.data.reference).toBe("ref_9");
  });

  it("returns null on invalid JSON", () => {
    expect(parsePaystackEvent("{not json")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    expect(parsePaystackEvent(JSON.stringify({ event: "charge.success" }))).toBeNull();
    expect(
      parsePaystackEvent(JSON.stringify({ event: "charge.success", data: { amount: 100 } }))
    ).toBeNull();
  });
});

describe("resolvePaymentOutcome", () => {
  it("marks a successful charge as paid and converts kobo to naira", () => {
    const event = parsePaystackEvent(
      JSON.stringify({
        event: "charge.success",
        data: { reference: "ref_5", amount: 250000, currency: "NGN", status: "success" }
      })
    );
    const outcome = resolvePaymentOutcome(event!);
    expect(outcome.isPaid).toBe(true);
    expect(outcome.amountMajor).toBe(2500);
    expect(outcome.reference).toBe("ref_5");
  });

  it("does not mark non-success events as paid", () => {
    const failed = parsePaystackEvent(
      JSON.stringify({
        event: "charge.failed",
        data: { reference: "ref_6", amount: 250000, currency: "NGN", status: "failed" }
      })
    );
    expect(resolvePaymentOutcome(failed!).isPaid).toBe(false);
  });

  it("rejects a success event whose inner status contradicts it", () => {
    const event = parsePaystackEvent(
      JSON.stringify({
        event: "charge.success",
        data: { reference: "ref_7", amount: 100, currency: "NGN", status: "failed" }
      })
    );
    expect(resolvePaymentOutcome(event!).isPaid).toBe(false);
  });

  it("exposes the raw minor-unit amount and currency", () => {
    const event = parsePaystackEvent(
      JSON.stringify({
        event: "charge.success",
        data: { reference: "ref_8", amount: 250000, currency: "NGN", status: "success" }
      })
    );
    const outcome = resolvePaymentOutcome(event!);
    expect(outcome.amountMinor).toBe(250000);
    expect(outcome.currency).toBe("NGN");
  });
});

describe("paymentMatchesExpectation", () => {
  it("accepts an exact amount and currency match (naira -> kobo)", () => {
    expect(
      paymentMatchesExpectation(
        { amountMinor: 250000, currency: "NGN" },
        { amountMajor: 2500, currency: "NGN" }
      )
    ).toBe(true);
  });

  it("rejects an underpaid amount", () => {
    expect(
      paymentMatchesExpectation(
        { amountMinor: 100, currency: "NGN" },
        { amountMajor: 2500, currency: "NGN" }
      )
    ).toBe(false);
  });

  it("rejects a currency mismatch even when the number matches", () => {
    expect(
      paymentMatchesExpectation(
        { amountMinor: 250000, currency: "USD" },
        { amountMajor: 2500, currency: "NGN" }
      )
    ).toBe(false);
  });

  it("compares currency case-insensitively", () => {
    expect(
      paymentMatchesExpectation(
        { amountMinor: 250000, currency: "ngn" },
        { amountMajor: 2500, currency: "NGN" }
      )
    ).toBe(true);
  });

  it("handles fractional expected amounts without float drift", () => {
    expect(
      paymentMatchesExpectation(
        { amountMinor: 2599, currency: "NGN" },
        { amountMajor: 25.99, currency: "NGN" }
      )
    ).toBe(true);
  });
});
