import { CalendarClock, Database, Images, RefreshCw } from "lucide-react";
import { updateProcurementRequestStatus } from "@/app/dashboard/actions";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { humanizeStatus, statusTone, workflowTransitions } from "@/lib/workflow";
import type { WorkflowStatus } from "@/types";

const allStatuses: WorkflowStatus[] = [
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
];

async function getLiveRequests() {
  try {
    const requests = await prisma.procurementRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        customer: {
          include: {
            organization: true
          }
        },
        images: true,
        quotations: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        order: {
          include: {
            payment: true,
            shipment: true
          }
        }
      }
    });

    return { requests, error: null };
  } catch (error) {
    return {
      requests: [],
      error: error instanceof Error ? error.message : "Unable to load database requests."
    };
  }
}

function statusOptions(status: WorkflowStatus) {
  const allowed = workflowTransitions[status] ?? [];
  return [...new Set([status, ...allowed, ...allStatuses.filter((item) => item === "DISPUTED" || item === "CANCELLED")])];
}

export async function LiveProcurementRequests() {
  const { requests, error } = await getLiveRequests();

  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-market-green" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">
              Live database workflow
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-black text-ink">Submitted procurement requests</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Requests submitted from the customer form are loaded from PostgreSQL through Prisma.
            Admins can move them through controlled operational states.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-black text-market-blue">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Revalidates after updates
        </span>
      </div>

      {error ? (
        <div className="mt-5 rounded-lg bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-700">
          Database error: {error}. Check `DATABASE_URL`, run `prisma db push`, then seed or submit a request.
        </div>
      ) : null}

      {!error && requests.length === 0 ? (
        <div className="mt-5 rounded-lg bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
          No live requests yet. Submit one from the request page or run the seed command.
        </div>
      ) : null}

      {requests.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-4 py-4">Request</th>
                  <th className="px-4 py-4">Buyer</th>
                  <th className="px-4 py-4">Market</th>
                  <th className="px-4 py-4">Budget</th>
                  <th className="px-4 py-4">Evidence</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {requests.map((request) => {
                  const status = request.status as WorkflowStatus;
                  const quote = request.quotations[0];

                  return (
                    <tr className="align-top" key={request.id}>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{request.requestNumber}</p>
                        <p className="mt-1 max-w-64 text-zinc-600">{request.title}</p>
                        <p className="mt-2 flex items-center gap-1 text-xs font-bold text-zinc-400">
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                          {request.createdAt.toLocaleDateString("en-NG")}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-zinc-700">{request.customer.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">{request.customer.organization?.name}</p>
                      </td>
                      <td className="px-4 py-4 text-zinc-600">{request.targetMarkets.join(", ")}</td>
                      <td className="px-4 py-4 font-semibold text-zinc-700">
                        {request.budgetMin || request.budgetMax
                          ? `${formatCurrency(Number(request.budgetMin ?? 0))} - ${formatCurrency(
                              Number(request.budgetMax ?? request.budgetMin ?? 0)
                            )}`
                          : quote
                            ? formatCurrency(Number(quote.total))
                            : "Pending quote"}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">
                          <Images className="h-3.5 w-3.5 text-market-blue" aria-hidden="true" />
                          {request.images.length} image{request.images.length === 1 ? "" : "s"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-black ring-1 ${statusTone[status]}`}>
                          {humanizeStatus(status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <form action={updateProcurementRequestStatus} className="flex min-w-56 gap-2">
                          <input name="requestId" type="hidden" value={request.id} />
                          <select
                            className="w-full rounded-md border border-zinc-200 bg-white px-2 py-2 text-xs font-bold text-zinc-700 outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
                            name="status"
                            defaultValue={status}
                          >
                            {statusOptions(status).map((option) => (
                              <option key={option} value={option}>
                                {humanizeStatus(option)}
                              </option>
                            ))}
                          </select>
                          <button
                            className="focus-ring rounded-md bg-ink px-3 py-2 text-xs font-black text-white"
                            type="submit"
                          >
                            Save
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
