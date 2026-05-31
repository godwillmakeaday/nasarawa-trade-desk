import { z } from "zod";

export const escalationLevelSchema = z.enum(["L1", "L2", "L3"]);

export const disputeEscalationSchema = z.object({
  disputeId: z.string().min(1, "A dispute reference is required."),
  // The current tier is derived server-side from the dispute's escalation
  // history, never trusted from the client — so it is not accepted here.
  note: z.string().min(10, "Add a short note explaining the escalation.")
});

export type DisputeEscalationInput = z.infer<typeof disputeEscalationSchema>;
