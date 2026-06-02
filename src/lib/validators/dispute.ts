import { z } from "zod";
import { escalationOrder } from "@/lib/dispute-sla";

// Derived from the single escalation-tier tuple so the accepted levels can
// never drift from the SLA engine's definition.
export const escalationLevelSchema = z.enum(escalationOrder);

export const disputeEscalationSchema = z.object({
  disputeId: z.string().min(1, "A dispute reference is required."),
  // The current tier is derived server-side from the dispute's escalation
  // history, never trusted from the client — so it is not accepted here.
  note: z.string().min(10, "Add a short note explaining the escalation.")
});

export type DisputeEscalationInput = z.infer<typeof disputeEscalationSchema>;
