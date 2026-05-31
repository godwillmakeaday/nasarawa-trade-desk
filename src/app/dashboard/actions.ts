"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requestStatusSchema } from "@/lib/validators/procurement-request";
import { evaluateTransition, getTransitionControl } from "@/lib/workflow";
import { resolveActorRole } from "@/lib/auth";
import type { WorkflowStatus } from "@/types";

export async function updateProcurementRequestStatus(formData: FormData) {
  const parsed = requestStatusSchema.safeParse({
    requestId: formData.get("requestId"),
    status: formData.get("status")
  });

  if (!parsed.success) {
    throw new Error("Invalid status update.");
  }

  const role = await resolveActorRole();

  const request = await prisma.procurementRequest.findUnique({
    where: { id: parsed.data.requestId },
    select: {
      id: true,
      requestNumber: true,
      status: true,
      customerId: true
    }
  });

  if (!request) {
    throw new Error("Procurement request was not found.");
  }

  const currentStatus = request.status as WorkflowStatus;
  const nextStatus = parsed.data.status as WorkflowStatus;

  // A no-op status save is allowed; any real move must satisfy the state
  // machine plus the role and evidence gate for that transition.
  let auditAction: string | undefined;
  if (currentStatus !== nextStatus) {
    const control = getTransitionControl(currentStatus, nextStatus);

    // The officer attests that the operational evidence this transition
    // requires is in hand. Guarded moves must carry that attestation; the
    // audit trail then records exactly what was attested to.
    const attested = formData.get("evidenceAttested") === "on";
    const providedEvidence =
      control && attested ? control.requiredEvidence : [];

    const evaluation = evaluateTransition({
      from: currentStatus,
      to: nextStatus,
      role,
      providedEvidence
    });

    if (!evaluation.ok) {
      throw new Error(evaluation.reason);
    }

    auditAction = evaluation.control?.auditAction;
  }

  await prisma.$transaction([
    prisma.procurementRequest.update({
      where: { id: request.id },
      data: { status: nextStatus }
    }),
    prisma.auditTrail.create({
      data: {
        // Authentication is not wired yet, so we only know the acting role from
        // the cookie, not a user id. Record null rather than falsely crediting
        // the customer; the role and semantic workflow action go in the payload.
        actorId: null,
        procurementRequestId: request.id,
        action: "STATUS_CHANGE",
        entityType: "ProcurementRequest",
        entityId: request.requestNumber,
        before: { status: currentStatus },
        after: {
          status: nextStatus,
          actorRole: role,
          workflowAction: auditAction ?? null
        }
      }
    }),
    prisma.transactionLog.create({
      data: {
        actorId: null,
        eventType: "REQUEST_STATUS_CHANGED",
        metadata: {
          requestId: request.id,
          requestNumber: request.requestNumber,
          from: currentStatus,
          to: nextStatus,
          actorRole: role,
          workflowAction: auditAction ?? null
        }
      }
    })
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/track");
}
