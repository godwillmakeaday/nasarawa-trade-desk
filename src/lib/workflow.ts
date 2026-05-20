import type { UserRole, WorkflowStatus } from "@/types";

export type TransitionControl = {
  from: WorkflowStatus;
  to: WorkflowStatus;
  allowedRoles: UserRole[];
  requiredEvidence: string[];
  auditAction: string;
};

export const workflowStages: Array<{
  status: WorkflowStatus;
  label: string;
  owner: UserRole[];
  description: string;
}> = [
  {
    status: "SUBMITTED",
    label: "Request submitted",
    owner: ["CUSTOMER", "PROCUREMENT_OFFICER"],
    description: "Customer details, destination, budget, and reference images are captured."
  },
  {
    status: "SOURCING",
    label: "Market sourcing",
    owner: ["PROCUREMENT_OFFICER", "ADMIN"],
    description: "Officers compare availability, quality, and market pricing across assigned Nasarawa markets."
  },
  {
    status: "QUOTED",
    label: "Quotation issued",
    owner: ["PROCUREMENT_OFFICER", "ADMIN"],
    description: "A structured quote is sent with goods, service fee, logistics, tax, validity, and notes."
  },
  {
    status: "AWAITING_PAYMENT",
    label: "Secure payment",
    owner: ["CUSTOMER", "FINANCE_OFFICER"],
    description: "Customer accepts and pays while finance verifies provider webhooks and transaction logs."
  },
  {
    status: "PROCUREMENT_STARTED",
    label: "Procurement active",
    owner: ["PROCUREMENT_OFFICER"],
    description: "Paid order is released to the market team for purchase and vendor coordination."
  },
  {
    status: "QUALITY_CHECK",
    label: "Quality check",
    owner: ["PROCUREMENT_OFFICER", "ADMIN"],
    description: "Items are inspected against the request and reference images before dispatch approval."
  },
  {
    status: "READY_FOR_DISPATCH",
    label: "Dispatch ready",
    owner: ["LOGISTICS_OFFICER"],
    description: "Shipment is packaged, carrier is assigned, and tracking code is generated."
  },
  {
    status: "IN_TRANSIT",
    label: "In transit",
    owner: ["LOGISTICS_OFFICER"],
    description: "Logistics updates location, exceptions, and estimated delivery time."
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    owner: ["CUSTOMER", "LOGISTICS_OFFICER"],
    description: "Customer receives order and can confirm delivery or raise a dispute."
  },
  {
    status: "COMPLETED",
    label: "Completed",
    owner: ["ADMIN"],
    description: "Order is closed after customer confirmation, dispute resolution, or admin approval."
  }
];

export const workflowTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
  SUBMITTED: ["SOURCING", "CANCELLED"],
  SOURCING: ["QUOTED", "CANCELLED"],
  QUOTED: ["AWAITING_PAYMENT", "CANCELLED"],
  AWAITING_PAYMENT: ["PROCUREMENT_STARTED", "CANCELLED"],
  PROCUREMENT_STARTED: ["QUALITY_CHECK", "DISPUTED"],
  QUALITY_CHECK: ["READY_FOR_DISPATCH", "DISPUTED"],
  READY_FOR_DISPATCH: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED", "DISPUTED"],
  DELIVERED: ["COMPLETED", "DISPUTED"],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: ["COMPLETED"]
};

export const transitionControls: TransitionControl[] = [
  {
    from: "SUBMITTED",
    to: "SOURCING",
    allowedRoles: ["PROCUREMENT_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["verified buyer profile", "target market", "assigned procurement officer"],
    auditAction: "REQUEST_ACCEPTED_FOR_SOURCING"
  },
  {
    from: "SOURCING",
    to: "QUOTED",
    allowedRoles: ["PROCUREMENT_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["supplier reference", "market price note", "availability note", "transport estimate"],
    auditAction: "QUOTE_READY_FOR_CUSTOMER"
  },
  {
    from: "QUOTED",
    to: "AWAITING_PAYMENT",
    allowedRoles: ["CUSTOMER"],
    requiredEvidence: ["accepted quotation", "valid quote window"],
    auditAction: "QUOTE_ACCEPTED"
  },
  {
    from: "AWAITING_PAYMENT",
    to: "PROCUREMENT_STARTED",
    allowedRoles: ["FINANCE_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["provider reference", "paid amount match", "payment webhook verified"],
    auditAction: "PAYMENT_CONFIRMED"
  },
  {
    from: "PROCUREMENT_STARTED",
    to: "QUALITY_CHECK",
    allowedRoles: ["PROCUREMENT_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["purchase note", "supplier handover", "inspection task"],
    auditAction: "INSPECTION_OPENED"
  },
  {
    from: "QUALITY_CHECK",
    to: "READY_FOR_DISPATCH",
    allowedRoles: ["PROCUREMENT_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["inspection gallery", "quality reviewer", "variance approval if needed"],
    auditAction: "QUALITY_RELEASED"
  },
  {
    from: "READY_FOR_DISPATCH",
    to: "IN_TRANSIT",
    allowedRoles: ["LOGISTICS_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["transport assignment", "carrier contact", "vehicle plate", "manifest"],
    auditAction: "DISPATCH_RELEASED"
  },
  {
    from: "IN_TRANSIT",
    to: "DELIVERED",
    allowedRoles: ["LOGISTICS_OFFICER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["proof of delivery", "recipient name", "delivery timestamp", "location note"],
    auditAction: "DELIVERY_CONFIRMED"
  },
  {
    from: "DELIVERED",
    to: "COMPLETED",
    allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
    requiredEvidence: ["customer confirmation or closed dispute window"],
    auditAction: "ORDER_CLOSED"
  }
];

export function canTransition(from: WorkflowStatus, to: WorkflowStatus) {
  return workflowTransitions[from]?.includes(to) ?? false;
}

export function getTransitionControl(from: WorkflowStatus, to: WorkflowStatus) {
  return transitionControls.find((control) => control.from === from && control.to === to);
}

export const statusTone: Record<WorkflowStatus, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-200",
  SOURCING: "bg-amber-50 text-amber-700 ring-amber-200",
  QUOTED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  AWAITING_PAYMENT: "bg-orange-50 text-orange-700 ring-orange-200",
  PROCUREMENT_STARTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  QUALITY_CHECK: "bg-teal-50 text-teal-700 ring-teal-200",
  READY_FOR_DISPATCH: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  IN_TRANSIT: "bg-sky-50 text-sky-700 ring-sky-200",
  DELIVERED: "bg-green-50 text-green-700 ring-green-200",
  COMPLETED: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  DISPUTED: "bg-red-50 text-red-700 ring-red-200"
};

export function humanizeStatus(status: WorkflowStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
