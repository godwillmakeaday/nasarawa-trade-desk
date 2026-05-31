import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

/**
 * Paystack signs webhook payloads with an HMAC SHA-512 of the raw request body
 * using your secret key, delivered in the `x-paystack-signature` header. We MUST
 * verify this server-side and never trust client-reported payment state.
 *
 * Pure and dependency-light so it can be unit-tested without HTTP.
 */
export function computePaystackSignature(rawBody: string, secret: string): string {
  return createHmac("sha512", secret).update(rawBody, "utf8").digest("hex");
}

/**
 * Constant-time comparison of the expected vs received signature. Returns false
 * on any mismatch, missing signature, or length difference — never throws.
 */
export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const expected = computePaystackSignature(rawBody, secret);

  // timingSafeEqual requires equal-length buffers; unequal length => not a match.
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export const paystackEventSchema = z.object({
  event: z.string().min(1),
  data: z.object({
    reference: z.string().min(1),
    amount: z.number().int().nonnegative(),
    currency: z.string().min(1).default("NGN"),
    status: z.string().optional()
  })
});

export type PaystackEvent = z.infer<typeof paystackEventSchema>;

/**
 * Parses an already-verified webhook body into a typed event. Returns null when
 * the shape is unrecognized so callers can reject with a 400 rather than throw.
 */
export function parsePaystackEvent(rawBody: string): PaystackEvent | null {
  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return null;
  }

  const parsed = paystackEventSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}

/**
 * Maps a Paystack event to the internal payment outcome we persist. Only a
 * successful charge marks a payment PAID; everything else is explicit so we
 * never optimistically complete an order.
 */
export function resolvePaymentOutcome(event: PaystackEvent): {
  isPaid: boolean;
  reference: string;
  currency: string;
  /** Raw minor-unit amount (kobo) for exact integer comparison. */
  amountMinor: number;
  /** Paystack reports amounts in kobo (minor units); convert to Naira. */
  amountMajor: number;
} {
  const isPaid =
    event.event === "charge.success" &&
    (event.data.status === undefined || event.data.status === "success");

  return {
    isPaid,
    reference: event.data.reference,
    currency: event.data.currency,
    amountMinor: event.data.amount,
    amountMajor: event.data.amount / 100
  };
}

/**
 * Confirms a verified charge matches what the order actually owes. Paystack
 * amounts are integer minor units (kobo), so we compare against the expected
 * major-unit amount scaled to minor units — never trust the charged amount on
 * its own. Currency must match too.
 */
export function paymentMatchesExpectation(
  outcome: { amountMinor: number; currency: string },
  expected: { amountMajor: number; currency: string }
): boolean {
  const expectedMinor = Math.round(expected.amountMajor * 100);
  return (
    outcome.amountMinor === expectedMinor &&
    outcome.currency.toUpperCase() === expected.currency.toUpperCase()
  );
}
