"use server";

import { revalidatePath } from "next/cache";
import { resolveActorRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  canRespondAtLevel,
  getEscalationTier,
  nextEscalationLevel
} from "@/lib/dispute-sla";
import { disputeEscalationSchema } from "@/lib/validators/dispute";

/**
 * Escalates a dispute from its current tier to the next, enforcing the same
 * three invariants as the workflow guard: the move is valid (a higher tier
 * exists), the actor's role may respond at the current tier, and an explanatory
 * note is supplied. Writes the escalation record plus an audit and transaction
 * entry in a single transaction.
 */
export async function escalateDispute(formData: FormData) {
  const parsed = disputeEscalationSchema.safeParse({
    disputeId: formData.get("disputeId"),
    currentLevel: formData.get("currentLevel"),
    note: formData.get("note")
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid dispute escalation request."
    );
  }

  const role = await resolveActorRole();

  if (!canRespondAtLevel(parsed.data.currentLevel, role)) {
    throw new Error(
      `${role} is not permitted to act on a ${parsed.data.currentLevel} dispute.`
    );
  }

  const nextLevel = nextEscalationLevel(parsed.data.currentLevel);

  if (!nextLevel) {
    throw new Error("This dispute is already at the highest escalation tier.");
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: parsed.data.disputeId },
    select: {
      id: true,
      status: true,
      reporterId: true,
      procurementRequestId: true
    }
  });

  if (!dispute) {
    throw new Error("Dispute was not found.");
  }

  const tier = getEscalationTier(nextLevel);
  const sla = `${tier.slaBusinessHours} business hours`;

  await prisma.$transaction([
    prisma.disputeEscalation.create({
      data: {
        disputeId: dispute.id,
        level: nextLevel,
        trigger: tier.trigger,
        sla,
        action: tier.action,
        status: "ESCALATED"
      }
    }),
    prisma.dispute.update({
      where: { id: dispute.id },
      data: { status: "ESCALATED" }
    }),
    prisma.auditTrail.create({
      data: {
        procurementRequestId: dispute.procurementRequestId,
        action: "STATUS_CHANGE",
        entityType: "Dispute",
        entityId: dispute.id,
        before: { status: dispute.status, level: parsed.data.currentLevel },
        after: { status: "ESCALATED", level: nextLevel, note: parsed.data.note }
      }
    }),
    prisma.transactionLog.create({
      data: {
        eventType: "DISPUTE_ESCALATED",
        metadata: {
          disputeId: dispute.id,
          from: parsed.data.currentLevel,
          to: nextLevel,
          sla
        }
      }
    })
  ]);

  revalidatePath("/dashboard/disputes");
  revalidatePath("/dashboard/audit");
}
