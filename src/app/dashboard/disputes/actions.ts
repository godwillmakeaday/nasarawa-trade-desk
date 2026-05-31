"use server";

import { revalidatePath } from "next/cache";
import { resolveActorRole } from "@/lib/auth-session";
import { buildAuditEntries } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import {
  canRespondAtLevel,
  currentEscalationLevel,
  getEscalationTier,
  nextEscalationLevel
} from "@/lib/dispute-sla";
import type { EscalationLevel } from "@/lib/dispute-sla";
import { disputeEscalationSchema } from "@/lib/validators/dispute";

/**
 * Escalates a dispute from its current tier to the next, enforcing the same
 * three invariants as the workflow guard: the move is valid (a higher tier
 * exists), the actor's role may respond at the current tier, and an explanatory
 * note is supplied. The current tier is derived from the dispute's escalation
 * history server-side — never trusted from the client. Writes the escalation
 * record plus an audit and transaction entry in a single transaction.
 */
export async function escalateDispute(formData: FormData) {
  const parsed = disputeEscalationSchema.safeParse({
    disputeId: formData.get("disputeId"),
    note: formData.get("note")
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid dispute escalation request."
    );
  }

  const role = await resolveActorRole();

  const dispute = await prisma.dispute.findUnique({
    where: { id: parsed.data.disputeId },
    select: {
      id: true,
      status: true,
      reporterId: true,
      procurementRequestId: true,
      escalations: { select: { level: true } }
    }
  });

  if (!dispute) {
    throw new Error("Dispute was not found.");
  }

  // Authoritative current tier: the highest level the dispute has reached, read
  // from its own escalation history rather than any client-supplied value.
  const currentLevel = currentEscalationLevel(
    dispute.escalations.map((entry) => entry.level as EscalationLevel)
  );

  if (!canRespondAtLevel(currentLevel, role)) {
    throw new Error(
      `${role} is not permitted to act on a ${currentLevel} dispute.`
    );
  }

  const nextLevel = nextEscalationLevel(currentLevel);

  if (!nextLevel) {
    throw new Error("This dispute is already at the highest escalation tier.");
  }

  const tier = getEscalationTier(nextLevel);
  const sla = `${tier.slaBusinessHours} business hours`;

  await prisma.$transaction([
    prisma.disputeEscalation.create({
      data: {
        disputeId: dispute.id,
        // Auth is not wired yet: we know the acting role from the cookie but not
        // a user id, so leave actorId null rather than crediting the reporter.
        actorId: null,
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
    ...buildAuditEntries(prisma, {
      action: "STATUS_CHANGE",
      entityType: "Dispute",
      entityId: dispute.id,
      actorRole: role,
      eventType: "DISPUTE_ESCALATED",
      procurementRequestId: dispute.procurementRequestId,
      before: { status: dispute.status, level: currentLevel },
      after: {
        status: "ESCALATED",
        level: nextLevel,
        note: parsed.data.note
      },
      metadata: {
        disputeId: dispute.id,
        from: currentLevel,
        to: nextLevel,
        sla
      }
    })
  ]);

  revalidatePath("/dashboard/disputes");
  revalidatePath("/dashboard/audit");
}
