export type UserRole =
  | "CUSTOMER"
  | "PROCUREMENT_OFFICER"
  | "LOGISTICS_OFFICER"
  | "FINANCE_OFFICER"
  | "DISPUTE_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export type WorkflowStatus =
  | "SUBMITTED"
  | "SOURCING"
  | "QUOTED"
  | "AWAITING_PAYMENT"
  | "PROCUREMENT_STARTED"
  | "QUALITY_CHECK"
  | "READY_FOR_DISPATCH"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type ShipmentStatus =
  | "NOT_READY"
  | "SCHEDULED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "AT_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "EXCEPTION";

export type DashboardOrder = {
  id: string;
  requestNumber: string;
  customer: string;
  title: string;
  destination: string;
  market: string;
  amount: number;
  status: WorkflowStatus;
  paymentStatus: "INITIATED" | "PAID" | "FAILED" | "REFUNDED";
  eta: string;
};

export type TimelineEvent = {
  title: string;
  description: string;
  timestamp: string;
  status: "done" | "current" | "upcoming" | "issue";
};
