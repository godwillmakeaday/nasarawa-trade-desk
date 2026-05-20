import { z } from "zod";

export const procurementRequestSchema = z.object({
  customerName: z.string().min(2, "Enter the customer's full name."),
  customerEmail: z.string().email("Enter a valid email address."),
  customerPhone: z.string().min(8, "Enter a valid phone number."),
  organizationName: z.string().min(2, "Enter the buyer or business name."),
  title: z.string().min(3, "Enter the product or commodity name."),
  quantity: z.string().min(1, "Enter the requested quantity."),
  targetMarket: z.string().min(2, "Select a target market."),
  budgetRange: z.string().min(2, "Enter a budget range."),
  deliveryAddress: z.string().min(10, "Enter a full delivery address."),
  deliveryState: z.string().min(2, "Enter the delivery state."),
  deliveryLga: z.string().optional(),
  details: z.string().min(20, "Add more procurement details for the market team.")
});

export const requestStatusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum([
    "SUBMITTED",
    "SOURCING",
    "QUOTED",
    "AWAITING_PAYMENT",
    "PROCUREMENT_STARTED",
    "QUALITY_CHECK",
    "READY_FOR_DISPATCH",
    "IN_TRANSIT",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "DISPUTED"
  ])
});

export type ProcurementRequestInput = z.infer<typeof procurementRequestSchema>;
