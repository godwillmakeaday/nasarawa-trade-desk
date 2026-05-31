import type { Prisma, PrismaClient } from "@prisma/client";
import type { UserRole } from "@/types";

// A Prisma client or an interactive-transaction client — both expose the model
// delegates this helper needs, so callers can use it inside or outside $transaction.
type Db = PrismaClient | Prisma.TransactionClient;

type AuditAction = Prisma.AuditTrailCreateInput["action"];

/**
 * Records a state change to both the audit trail and the transaction log in a
 * single, consistent shape. Centralising this keeps the two sinks from drifting
 * (e.g. one carrying actorRole and the other not) and gives every mutation one
 * place to evolve the audit contract.
 *
 * Authentication is not wired yet, so we know the acting role but not a user id:
 * `actorId` is left null and `actorRole` is recorded in the payload rather than
 * falsely attributing the change to an unrelated user.
 *
 * Returns the two create operations so the caller can include them in its own
 * `$transaction([...])` alongside the entity update.
 */
export function buildAuditEntries(
  db: Db,
  input: {
    action: AuditAction;
    entityType: string;
    entityId: string;
    actorRole: UserRole;
    eventType: string;
    procurementRequestId?: string | null;
    before?: Prisma.InputJsonValue;
    after?: Prisma.InputJsonValue;
    metadata?: Prisma.InputJsonValue;
  }
) {
  const after =
    input.after === undefined
      ? undefined
      : { ...(input.after as object), actorRole: input.actorRole };

  const metadata = { ...(input.metadata as object), actorRole: input.actorRole };

  return [
    db.auditTrail.create({
      data: {
        actorId: null,
        procurementRequestId: input.procurementRequestId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        before: input.before,
        after
      }
    }),
    db.transactionLog.create({
      data: {
        actorId: null,
        eventType: input.eventType,
        metadata
      }
    })
  ];
}
