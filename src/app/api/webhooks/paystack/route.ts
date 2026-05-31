import { NextResponse, type NextRequest } from "next/server";
import { logDatabaseError } from "@/lib/database-status";
import {
  parsePaystackEvent,
  paymentMatchesExpectation,
  resolvePaymentOutcome,
  verifyPaystackSignature
} from "@/lib/payment/paystack";
import { prisma } from "@/lib/prisma";

// Payment webhooks must be verified server-side; never trust client-reported
// payment. We read the raw body for an exact HMAC comparison, confirm the
// signature, then reconcile the payment record idempotently.
export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    // Misconfiguration, not a client error: refuse rather than silently accept.
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = parsePaystackEvent(rawBody);

  if (!event) {
    return NextResponse.json({ error: "Unrecognized event payload." }, { status: 400 });
  }

  const outcome = resolvePaymentOutcome(event);

  // We only act on confirmed successful charges; acknowledge the rest so
  // Paystack does not retry.
  if (!outcome.isPaid) {
    return NextResponse.json({ received: true, applied: false });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { providerRef: outcome.reference },
      select: { id: true, orderId: true, status: true, amount: true, currency: true }
    });

    if (!payment) {
      // Unknown reference: acknowledge to stop retries but record nothing.
      return NextResponse.json({ received: true, applied: false });
    }

    // Idempotent: a reference already marked PAID is a duplicate delivery.
    if (payment.status === "PAID") {
      return NextResponse.json({ received: true, applied: false, duplicate: true });
    }

    // Never complete on a successful-but-mismatched charge: the amount and
    // currency must equal what the order owes. An underpaid or wrong-currency
    // event is recorded as a failed verification, not a payment.
    const matches = paymentMatchesExpectation(outcome, {
      amountMajor: Number(payment.amount),
      currency: payment.currency
    });

    if (!matches) {
      await prisma.transactionLog.create({
        data: {
          orderId: payment.orderId,
          eventType: "PAYMENT_MISMATCH",
          amount: outcome.amountMajor,
          providerRef: outcome.reference,
          metadata: {
            event: event.event,
            reference: outcome.reference,
            chargedCurrency: outcome.currency,
            chargedMinor: outcome.amountMinor,
            expectedMajor: Number(payment.amount),
            expectedCurrency: payment.currency
          }
        }
      });
      return NextResponse.json({ received: true, applied: false, mismatch: true }, { status: 422 });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          rawProviderEvent: JSON.parse(rawBody)
        }
      }),
      prisma.transactionLog.create({
        data: {
          orderId: payment.orderId,
          eventType: "PAYMENT_VERIFIED",
          amount: outcome.amountMajor,
          providerRef: outcome.reference,
          metadata: {
            event: event.event,
            reference: outcome.reference
          }
        }
      }),
      prisma.auditTrail.create({
        data: {
          action: "PAYMENT_CAPTURE",
          entityType: "Payment",
          entityId: payment.id,
          after: { status: "PAID", reference: outcome.reference }
        }
      })
    ]);

    return NextResponse.json({ received: true, applied: true });
  } catch (error) {
    logDatabaseError("paystack-webhook", error);
    // Signal a retryable failure to Paystack.
    return NextResponse.json({ error: "Could not record payment." }, { status: 500 });
  }
}
