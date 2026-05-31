import { describe, expect, it } from "vitest";
import {
  procurementRequestSchema,
  requestStatusSchema
} from "@/lib/validators/procurement-request";

const validInput = {
  customerName: "Amina Bello",
  customerEmail: "amina@example.com",
  customerPhone: "08031234567",
  organizationName: "Bello Foods Ltd",
  title: "Bags of rice",
  quantity: "200",
  targetMarket: "Lafia Central Market",
  budgetRange: "2,000,000 - 2,500,000",
  deliveryAddress: "12 Independence Way, Garki",
  deliveryState: "FCT",
  deliveryLga: "Abuja Municipal",
  details: "Long-grain rice, 50kg bags, dry and clean stock for resale."
};

describe("procurementRequestSchema", () => {
  it("accepts a complete valid request", () => {
    expect(procurementRequestSchema.safeParse(validInput).success).toBe(true);
  });

  it("treats deliveryLga as optional", () => {
    const { deliveryLga, ...withoutLga } = validInput;
    expect(procurementRequestSchema.safeParse(withoutLga).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = procurementRequestSchema.safeParse({
      ...validInput,
      customerEmail: "not-an-email"
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-short details", () => {
    const result = procurementRequestSchema.safeParse({
      ...validInput,
      details: "too short"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a too-short delivery address", () => {
    const result = procurementRequestSchema.safeParse({
      ...validInput,
      deliveryAddress: "Garki"
    });
    expect(result.success).toBe(false);
  });
});

describe("requestStatusSchema", () => {
  it("accepts a known workflow status", () => {
    expect(
      requestStatusSchema.safeParse({ requestId: "req_1", status: "SOURCING" }).success
    ).toBe(true);
  });

  it("rejects an unknown status", () => {
    expect(
      requestStatusSchema.safeParse({ requestId: "req_1", status: "PENDING" }).success
    ).toBe(false);
  });

  it("rejects an empty requestId", () => {
    expect(
      requestStatusSchema.safeParse({ requestId: "", status: "QUOTED" }).success
    ).toBe(false);
  });
});
