import { describe, expect, it } from "vitest";
import type { WorkflowStatus } from "@/types";
import {
  canTransition,
  evaluateTransition,
  getTransitionControl,
  humanizeStatus,
  statusTone,
  transitionControls,
  workflowStages,
  workflowTransitions
} from "@/lib/workflow";

const allStatuses = Object.keys(workflowTransitions) as WorkflowStatus[];

describe("workflowTransitions", () => {
  it("allows only declared forward transitions", () => {
    expect(canTransition("SUBMITTED", "SOURCING")).toBe(true);
    expect(canTransition("SOURCING", "QUOTED")).toBe(true);
    expect(canTransition("IN_TRANSIT", "DELIVERED")).toBe(true);
    expect(canTransition("DELIVERED", "COMPLETED")).toBe(true);
  });

  it("rejects undeclared or backward transitions", () => {
    expect(canTransition("SUBMITTED", "DELIVERED")).toBe(false);
    expect(canTransition("QUOTED", "SOURCING")).toBe(false);
    expect(canTransition("COMPLETED", "DISPUTED")).toBe(false);
  });

  it("treats COMPLETED and CANCELLED as terminal", () => {
    expect(workflowTransitions.COMPLETED).toEqual([]);
    expect(workflowTransitions.CANCELLED).toEqual([]);
  });

  it("only ever transitions to known statuses", () => {
    for (const targets of Object.values(workflowTransitions)) {
      for (const target of targets) {
        expect(allStatuses).toContain(target);
      }
    }
  });

  it("allows DISPUTED to resolve to COMPLETED", () => {
    expect(canTransition("DISPUTED", "COMPLETED")).toBe(true);
  });
});

describe("getTransitionControl", () => {
  it("returns role + evidence rules for a guarded transition", () => {
    const control = getTransitionControl("AWAITING_PAYMENT", "PROCUREMENT_STARTED");
    expect(control).toBeDefined();
    expect(control?.allowedRoles).toContain("FINANCE_OFFICER");
    expect(control?.requiredEvidence.length).toBeGreaterThan(0);
    expect(control?.auditAction).toBe("PAYMENT_CONFIRMED");
  });

  it("returns undefined for a transition that does not exist", () => {
    expect(getTransitionControl("SUBMITTED", "DELIVERED")).toBeUndefined();
  });

  it("only references valid from/to statuses", () => {
    for (const control of transitionControls) {
      expect(allStatuses).toContain(control.from);
      expect(allStatuses).toContain(control.to);
      expect(canTransition(control.from, control.to)).toBe(true);
    }
  });
});

describe("every non-terminal transition is guarded by a control", () => {
  it("has a TransitionControl for each declared forward transition", () => {
    // No transition (including CANCELLED/DISPUTED branches) may slip through
    // evaluateTransition ungated; each must define roles + evidence + audit.
    for (const [from, targets] of Object.entries(workflowTransitions)) {
      for (const to of targets) {
        const control = getTransitionControl(from as never, to);
        expect(
          control,
          `missing control for ${from} -> ${to}`
        ).toBeDefined();
        expect(control!.allowedRoles.length).toBeGreaterThan(0);
        expect(control!.requiredEvidence.length).toBeGreaterThan(0);
        expect(control!.auditAction).toBeTruthy();
      }
    }
  });

  it("blocks a CANCELLED move by a role with no stake in the stage", () => {
    const result = evaluateTransition({
      from: "SOURCING",
      to: "CANCELLED",
      role: "LOGISTICS_OFFICER",
      providedEvidence: ["cancellation reason"]
    });
    expect(result.ok).toBe(false);
  });

  it("blocks a DISPUTED move with no dispute reason evidence", () => {
    const result = evaluateTransition({
      from: "IN_TRANSIT",
      to: "DISPUTED",
      role: "CUSTOMER",
      providedEvidence: []
    });
    expect(result.ok).toBe(false);
  });

  it("allows a permitted DISPUTED move with evidence", () => {
    const result = evaluateTransition({
      from: "DELIVERED",
      to: "DISPUTED",
      role: "CUSTOMER",
      providedEvidence: ["dispute reason"]
    });
    expect(result.ok).toBe(true);
  });
});

describe("status metadata coverage", () => {
  it("defines a tone for every status", () => {
    for (const status of allStatuses) {
      expect(statusTone[status]).toBeTruthy();
    }
  });

  it("lists every stage status in the transition map", () => {
    for (const stage of workflowStages) {
      expect(allStatuses).toContain(stage.status);
    }
  });
});

describe("evaluateTransition", () => {
  // QUALITY_CHECK -> READY_FOR_DISPATCH requires a procurement officer plus a
  // full inspection evidence set; a convenient fixture to exercise the gate.
  const evidence = ["inspection gallery", "quality reviewer", "variance approval if needed"];

  it("accepts a legal transition with the right role and full evidence", () => {
    const result = evaluateTransition({
      from: "QUALITY_CHECK",
      to: "READY_FOR_DISPATCH",
      role: "PROCUREMENT_OFFICER",
      providedEvidence: evidence
    });
    expect(result.ok).toBe(true);
  });

  it("rejects a move the state machine does not allow", () => {
    const result = evaluateTransition({
      from: "SUBMITTED",
      to: "DELIVERED",
      role: "ADMIN",
      providedEvidence: []
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/Cannot move/);
    }
  });

  it("rejects a legal transition performed by a disallowed role", () => {
    const result = evaluateTransition({
      from: "QUALITY_CHECK",
      to: "READY_FOR_DISPATCH",
      role: "CUSTOMER",
      providedEvidence: evidence
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/not allowed/);
    }
  });

  it("rejects an allowed role that is missing required evidence", () => {
    const result = evaluateTransition({
      from: "QUALITY_CHECK",
      to: "READY_FOR_DISPATCH",
      role: "PROCUREMENT_OFFICER",
      providedEvidence: ["inspection gallery"]
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/Missing required evidence/);
      expect(result.reason).toMatch(/quality reviewer/);
    }
  });

  it("matches evidence case-insensitively and ignoring surrounding space", () => {
    const result = evaluateTransition({
      from: "QUALITY_CHECK",
      to: "READY_FOR_DISPATCH",
      role: "PROCUREMENT_OFFICER",
      providedEvidence: ["  Inspection Gallery ", "QUALITY REVIEWER", "Variance Approval If Needed"]
    });
    expect(result.ok).toBe(true);
  });

  it("now gates the SUBMITTED -> CANCELLED branch on role + evidence", () => {
    // Previously control-free; a customer may cancel their own SUBMITTED
    // request, but only with a stated cancellation reason.
    expect(
      evaluateTransition({
        from: "SUBMITTED",
        to: "CANCELLED",
        role: "CUSTOMER",
        providedEvidence: []
      }).ok
    ).toBe(false);

    expect(
      evaluateTransition({
        from: "SUBMITTED",
        to: "CANCELLED",
        role: "CUSTOMER",
        providedEvidence: ["cancellation reason"]
      }).ok
    ).toBe(true);
  });

  it("treats SUPER_ADMIN as permitted on every guarded transition", () => {
    for (const control of transitionControls) {
      const result = evaluateTransition({
        from: control.from,
        to: control.to,
        role: control.allowedRoles[0],
        providedEvidence: control.requiredEvidence
      });
      expect(result.ok).toBe(true);
    }
  });
});

describe("humanizeStatus", () => {
  it("formats snake_case statuses into title case", () => {
    expect(humanizeStatus("AWAITING_PAYMENT")).toBe("Awaiting Payment");
    expect(humanizeStatus("IN_TRANSIT")).toBe("In Transit");
    expect(humanizeStatus("SUBMITTED")).toBe("Submitted");
  });
});
