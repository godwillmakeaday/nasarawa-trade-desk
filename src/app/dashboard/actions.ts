"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requestStatusSchema } from "@/lib/validators/procurement-request";
import { canTransition, humanizeStatus } from "@/lib/workflow";
import type { WorkflowStatus } from "@/types";

export async function updateProcurementRequestStatus(formData: FormData) {
  const parsed = requestStatusSchema.safeParse({
    requestId: formData.get("requestId"),
    status: formData.get("status")
  });

  if (!parsed.success) {
    throw new Error("Invalid status update.");
  }

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
  const isSameStatus = currentStatus === nextStatus;
  const isAllowedTransition = canTransition(currentStatus, nextStatus);

  if (!isSameStatus && !isAllowedTransition) {
    throw new Error(
      `Cannot move ${humanizeStatus(currentStatus)} directly to ${humanizeStatus(nextStatus)}.`
    );
  }

  await prisma.$transaction([
    prisma.procurementRequest.update({
      where: { id: request.id },
      data: { status: nextStatus }
    }),
    prisma.auditTrail.create({
      data: {
        actorId: request.customerId,
        procurementRequestId: request.id,
        action: "STATUS_CHANGE",
        entityType: "ProcurementRequest",
        entityId: request.requestNumber,
        before: { status: currentStatus },
        after: { status: nextStatus }
      }
    }),
    prisma.transactionLog.create({
      data: {
        actorId: request.customerId,
        eventType: "REQUEST_STATUS_CHANGED",
        metadata: {
          requestId: request.id,
          requestNumber: request.requestNumber,
          from: currentStatus,
          to: nextStatus
        }
      }
    })
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/track");
}
