import { CalendarClock, PackageCheck, Search, Truck } from "lucide-react";
import { InspectionEvidence } from "@/components/dashboard/inspection-evidence";
import { InspectionEvidenceGallery } from "@/components/dashboard/inspection-evidence-gallery";
import { ProofOfDeliveryUploads } from "@/components/dashboard/proof-of-delivery-uploads";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Timeline } from "@/components/dashboard/timeline";
import { TransportAssignmentSystem } from "@/components/dashboard/transport-assignment-system";
import { TransportVisibility } from "@/components/dashboard/transport-visibility";
import { WhatsappCommunicationHub } from "@/components/dashboard/whatsapp-communication-hub";
import { WhatsappEscalation } from "@/components/dashboard/whatsapp-escalation";
import { SiteHeader } from "@/components/site/header";
import { orders, trackingTimeline } from "@/data/mock";
import { databaseSetupHint, isDatabaseConfigured, logDatabaseError } from "@/lib/database-status";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { humanizeStatus } from "@/lib/workflow";
import type { TimelineEvent, WorkflowStatus } from "@/types";

export const dynamic = "force-dynamic";

type TrackPageProps = {
  searchParams?: Promise<{
    requestNumber?: string;
  }>;
};

async function getTrackedRequest(requestNumber?: string) {
  if (!isDatabaseConfigured()) {
    return { request: null, error: null, demoMode: true };
  }

  try {
    const request = requestNumber
      ? await prisma.procurementRequest.findUnique({
          where: { requestNumber },
          include: trackedRequestInclude
        })
      : await prisma.procurementRequest.findFirst({
          orderBy: { createdAt: "desc" },
          include: trackedRequestInclude
        });

    return { request, error: null, demoMode: false };
  } catch (error) {
    logDatabaseError("track-page", error);
    return {
      request: null,
      error: "Live tracking is temporarily unavailable.",
      demoMode: true
    };
  }
}

const trackedRequestInclude = {
  customer: {
    include: {
      organization: true
    }
  },
  images: true,
  quotations: {
    orderBy: { createdAt: "desc" as const },
    take: 1
  },
  tasks: {
    orderBy: { createdAt: "desc" as const }
  },
  disputes: {
    orderBy: { createdAt: "desc" as const }
  },
  auditTrails: {
    orderBy: { createdAt: "desc" as const },
    take: 6
  },
  order: {
    include: {
      payment: true,
      shipment: {
        include: {
          events: {
            orderBy: { occurredAt: "desc" as const }
          }
        }
      },
      transportAssignments: true,
      proofOfDeliveries: true,
      communications: true
    }
  }
};

function buildTimeline(request: NonNullable<Awaited<ReturnType<typeof getTrackedRequest>>["request"]>): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      title: "Request submitted",
      description: `${request.customer.name} submitted ${request.title} for ${request.targetMarkets.join(", ")}.`,
      timestamp: request.createdAt.toLocaleString("en-NG"),
      status: "done"
    },
    {
      title: humanizeStatus(request.status as WorkflowStatus),
      description: "Current procurement status from the operational database.",
      timestamp: request.updatedAt.toLocaleString("en-NG"),
      status: "current"
    }
  ];

  const quote = request.quotations[0];
  if (quote) {
    events.push({
      title: "Quotation issued",
      description: `${formatCurrency(Number(quote.total))} quote valid until ${quote.validUntil.toLocaleDateString(
        "en-NG"
      )}.`,
      timestamp: quote.createdAt.toLocaleString("en-NG"),
      status: quote.acceptedAt ? "done" : "current"
    });
  }

  if (request.order?.payment) {
    events.push({
      title: "Payment event",
      description: `${request.order.payment.status} through ${request.order.payment.provider}.`,
      timestamp: request.order.payment.updatedAt.toLocaleString("en-NG"),
      status: request.order.payment.status === "PAID" ? "done" : "current"
    });
  }

  if (request.order?.shipment) {
    events.push({
      title: "Shipment tracking",
      description: `${request.order.shipment.carrierName} tracking code ${request.order.shipment.trackingCode}.`,
      timestamp: request.order.shipment.updatedAt.toLocaleString("en-NG"),
      status: request.order.shipment.status === "DELIVERED" ? "done" : "current"
    });
  }

  return events;
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const params = await searchParams;
  const requestNumber = params?.requestNumber?.trim();
  const { request, error, demoMode } = await getTrackedRequest(requestNumber);
  const demoOrder = orders[0];
  const selectedNumber = requestNumber || request?.requestNumber || demoOrder.requestNumber;
  const quote = request?.quotations[0];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-black/5 bg-white p-6 shadow-soft">
          <Truck className="h-7 w-7 text-market-blue" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-black text-ink">Track procurement and delivery</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Enter your request number to see procurement status, inspection updates, transport
            movement, and delivery evidence.
          </p>

          <form className="mt-6 flex flex-col gap-3 sm:flex-row" method="get">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                className="w-full rounded-md border border-zinc-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
                name="requestNumber"
                placeholder="NRP-20260519-0001"
                defaultValue={selectedNumber}
              />
            </label>
            <button className="focus-ring rounded-md bg-ink px-4 py-3 text-sm font-black text-white" type="submit">
              Track
            </button>
          </form>
        </section>

        {demoMode ? (
          <section className="mt-6 rounded-lg bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-800">
            {error ? `${error} ` : ""}
            {databaseSetupHint()} Showing a sample tracking record for now.
          </section>
        ) : null}

        {!demoMode && !request ? (
          <section className="mt-6 rounded-lg bg-zinc-50 p-5 text-sm leading-6 text-zinc-600">
            No order was found for that request number. Check the number and try again, or create a new procurement request.
          </section>
        ) : null}

        {demoMode ? (
          <>
            <section className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
              <aside className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">Demo order</p>
                    <h2 className="mt-3 text-xl font-black text-ink">{demoOrder.requestNumber}</h2>
                  </div>
                  <StatusPill status={demoOrder.status} />
                </div>
                <dl className="mt-5 grid gap-4 text-sm">
                  <div>
                    <dt className="font-bold text-zinc-500">Product</dt>
                    <dd className="mt-1 font-black text-ink">{demoOrder.title}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Buyer</dt>
                    <dd className="mt-1 font-black text-ink">{demoOrder.customer}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Market</dt>
                    <dd className="mt-1 font-black text-ink">{demoOrder.market}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Destination</dt>
                    <dd className="mt-1 font-black text-ink">{demoOrder.destination}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Estimated value</dt>
                    <dd className="mt-1 font-black text-ink">{formatCurrency(demoOrder.amount)}</dd>
                  </div>
                </dl>
              </aside>

              <Timeline events={trackingTimeline} />
            </section>
          </>
        ) : null}

        {!demoMode && request ? (
          <>
            <section className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
              <aside className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">Live order</p>
                    <h2 className="mt-3 text-xl font-black text-ink">{request.requestNumber}</h2>
                  </div>
                  <StatusPill status={request.status as WorkflowStatus} />
                </div>
                <dl className="mt-5 grid gap-4 text-sm">
                  <div>
                    <dt className="font-bold text-zinc-500">Product</dt>
                    <dd className="mt-1 font-black text-ink">{request.title}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Buyer</dt>
                    <dd className="mt-1 font-black text-ink">{request.customer.name}</dd>
                    <dd className="mt-1 text-xs font-semibold text-zinc-500">
                      {request.customer.organization?.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Market</dt>
                    <dd className="mt-1 font-black text-ink">{request.targetMarkets.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Destination</dt>
                    <dd className="mt-1 font-black text-ink">
                      {request.deliveryLga ? `${request.deliveryLga}, ` : ""}
                      {request.deliveryState}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Quote</dt>
                    <dd className="mt-1 font-black text-ink">
                      {quote ? formatCurrency(Number(quote.total)) : "Pending quotation"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-zinc-500">Reference images</dt>
                    <dd className="mt-1 font-black text-ink">{request.images.length}</dd>
                  </div>
                </dl>
              </aside>

              <Timeline events={buildTimeline(request)} />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
                <PackageCheck className="h-5 w-5 text-market-green" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-ink">Operational status</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {humanizeStatus(request.status as WorkflowStatus)} updated {request.updatedAt.toLocaleString("en-NG")}.
                </p>
              </article>
              <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
                <CalendarClock className="h-5 w-5 text-market-blue" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-ink">Audit records</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {request.auditTrails.length} recent audit event{request.auditTrails.length === 1 ? "" : "s"} attached.
                </p>
              </article>
              <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
                <Truck className="h-5 w-5 text-market-clay" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-ink">Transport records</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {request.order?.transportAssignments.length ?? 0} assignment
                  {(request.order?.transportAssignments.length ?? 0) === 1 ? "" : "s"} and{" "}
                  {request.order?.proofOfDeliveries.length ?? 0} POD record
                  {(request.order?.proofOfDeliveries.length ?? 0) === 1 ? "" : "s"}.
                </p>
              </article>
            </section>
          </>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-6">
            <InspectionEvidence />
            <InspectionEvidenceGallery />
            <TransportAssignmentSystem />
            <TransportVisibility />
            <ProofOfDeliveryUploads />
          </div>
          <div className="grid gap-6">
            <WhatsappEscalation />
            <WhatsappCommunicationHub />
          </div>
        </section>
      </main>
    </>
  );
}
