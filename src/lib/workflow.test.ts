import { describe, expect, it } from "vitest";
import type { WorkflowStatus } from "@/types";
import {
  canTransition,
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

  it("returns undefined for a transition without a control", () => {
    expect(getTransitionControl("SUBMITTED", "CANCELLED")).toBeUndefined();
  });

  it("only references valid from/to statuses", () => {
    for (const control of transitionControls) {
      expect(allStatuses).toContain(control.from);
      expect(allStatuses).toContain(control.to);
      expect(canTransition(control.from, control.to)).toBe(true);
    }
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

describe("humanizeStatus", () => {
  it("formats snake_case statuses into title case", () => {
    expect(humanizeStatus("AWAITING_PAYMENT")).toBe("Awaiting Payment");
    expect(humanizeStatus("IN_TRANSIT")).toBe("In Transit");
    expect(humanizeStatus("SUBMITTED")).toBe("Submitted");
  });
});
