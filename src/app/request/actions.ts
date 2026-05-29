"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { isDatabaseConfigured, logDatabaseError } from "@/lib/database-status";
import { prisma } from "@/lib/prisma";
import { procurementRequestSchema } from "@/lib/validators/procurement-request";

export type RequestActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

class SafeActionError extends Error {}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
}

function parseBudgetRange(value: string) {
  const numbers = value
    .replace(/,/g, "")
    .match(/\d+(\.\d+)?/g)
    ?.map((item) => Number(item));

  if (!numbers?.length) {
    return { budgetMin: undefined, budgetMax: undefined };
  }

  if (numbers.length === 1) {
    return { budgetMin: numbers[0], budgetMax: numbers[0] };
  }

  return {
    budgetMin: Math.min(numbers[0], numbers[1]),
    budgetMax: Math.max(numbers[0], numbers[1])
  };
}

async function buildRequestNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const count = await prisma.procurementRequest.count();
  return `NRP-${stamp}-${String(count + 1).padStart(4, "0")}`;
}

async function saveReferenceImages(files: File[], requestNumber: string) {
  const saved = [];
  const uploadableFiles = files.filter((file) => file.size > 0);

  if (uploadableFiles.length > 0 && process.env.VERCEL === "1") {
    throw new SafeActionError(
      "Production image uploads need persistent object storage. Configure an upload adapter before accepting reference images on Vercel."
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", requestNumber);
  await mkdir(uploadDir, { recursive: true });

  for (const file of uploadableFiles) {
    if (!file.type.startsWith("image/")) {
      throw new SafeActionError(`${file.name} is not an image file.`);
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new SafeActionError(`${file.name} is larger than 12MB.`);
    }

    const safeName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, safeName), buffer);

    saved.push({
      url: `/uploads/${requestNumber}/${safeName}`,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size
    });
  }

  return saved;
}

export async function createProcurementRequest(
  _previousState: RequestActionState,
  formData: FormData
): Promise<RequestActionState> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      message:
        "Live procurement submissions are not enabled yet. You can still review the request flow, but the operations desk must connect the production database before accepting orders."
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = procurementRequestSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const requestNumber = await buildRequestNumber();
  const imageFiles = formData
    .getAll("referenceImages")
    .filter((item): item is File => item instanceof File && item.size > 0);

  try {
    const images = await saveReferenceImages(imageFiles, requestNumber);
    const budget = parseBudgetRange(parsed.data.budgetRange);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingOrganization = await tx.organization.findFirst({
        where: { name: parsed.data.organizationName }
      });

      const organization =
        existingOrganization ??
        (await tx.organization.create({
          data: {
          name: parsed.data.organizationName,
          state: parsed.data.deliveryState,
          address: parsed.data.deliveryAddress
          }
        }));

      const customer = await tx.user.upsert({
        where: { email: parsed.data.customerEmail },
        update: {
          name: parsed.data.customerName,
          phone: parsed.data.customerPhone,
          organizationId: organization.id,
          status: "ACTIVE"
        },
        create: {
          name: parsed.data.customerName,
          email: parsed.data.customerEmail,
          phone: parsed.data.customerPhone,
          passwordHash: "external-auth-pending",
          role: "CUSTOMER",
          status: "ACTIVE",
          organizationId: organization.id
        }
      });

      const request = await tx.procurementRequest.create({
        data: {
          requestNumber,
          customerId: customer.id,
          title: parsed.data.title,
          description: `${parsed.data.quantity}\n\n${parsed.data.details}`,
          marketState: "Nasarawa",
          targetMarkets: [parsed.data.targetMarket],
          deliveryAddress: parsed.data.deliveryAddress,
          deliveryState: parsed.data.deliveryState,
          deliveryLga: parsed.data.deliveryLga || null,
          budgetMin: budget.budgetMin,
          budgetMax: budget.budgetMax,
          status: "SUBMITTED",
          images: {
            create: images
          },
          auditTrails: {
            create: {
              actorId: customer.id,
              action: "CREATE",
              entityType: "ProcurementRequest",
              entityId: requestNumber,
              after: {
                status: "SUBMITTED",
                targetMarket: parsed.data.targetMarket,
                imageCount: images.length
              }
            }
          }
        }
      });

      await tx.transactionLog.create({
        data: {
          actorId: customer.id,
          eventType: "REQUEST_SUBMITTED",
          metadata: {
            requestId: request.id,
            requestNumber,
            targetMarket: parsed.data.targetMarket
          }
        }
      });
    });
  } catch (error) {
    if (error instanceof SafeActionError) {
      return {
        ok: false,
        message: error.message
      };
    }

    logDatabaseError("create-procurement-request", error);

    return {
      ok: false,
      message:
        "Unable to submit this request right now. Please try again or contact the procurement desk if the issue continues."
    };
  }

  redirect(`/track?requestNumber=${encodeURIComponent(requestNumber)}`);
}
