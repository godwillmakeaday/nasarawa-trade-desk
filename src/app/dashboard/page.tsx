import { CircleDollarSign, PackageCheck, ShieldAlert, Truck } from "lucide-react";
import { AuthenticatedRolesPanel } from "@/components/dashboard/authenticated-roles-panel";
import { DisputeEscalationWorkflow } from "@/components/dashboard/dispute-escalation-workflow";
import { InspectionEvidence } from "@/components/dashboard/inspection-evidence";
import { InspectionEvidenceGallery } from "@/components/dashboard/inspection-evidence-gallery";
import { MarketIntelligence } from "@/components/dashboard/market-intelligence";
import { MetricCard } from "@/components/dashboard/metric-card";
import { LiveProcurementRequests } from "@/components/dashboard/live-procurement-requests";
import { OrderTable } from "@/components/dashboard/order-table";
import { ProcurementOfficerProfiles } from "@/components/dashboard/procurement-officer-profiles";
import { ProcurementProgression } from "@/components/dashboard/procurement-progression";
import { ProofOfDeliveryUploads } from "@/components/dashboard/proof-of-delivery-uploads";
import { StateTransitionControls } from "@/components/dashboard/state-transition-controls";
import { Timeline } from "@/components/dashboard/timeline";
import { TransactionAuditLog } from "@/components/dashboard/transaction-audit-log";
import { TransportAssignmentSystem } from "@/components/dashboard/transport-assignment-system";
import { TransportVisibility } from "@/components/dashboard/transport-visibility";
import { TrustVerificationPanel } from "@/components/dashboard/trust-verification-panel";
import { WhatsappCommunicationHub } from "@/components/dashboard/whatsapp-communication-hub";
import { WhatsappEscalation } from "@/components/dashboard/whatsapp-escalation";
import { auditTrail, dashboardStats, orders, trackingTimeline, transactionLogs } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <AuthenticatedRolesPanel />
      <LiveProcurementRequests />
      <MarketIntelligence />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-market-blue">
                Active orders
              </p>
              <h2 className="mt-1 text-2xl font-black text-ink">Procurement pipeline</h2>
            </div>
          </div>
          <OrderTable orders={orders} />
        </div>

        <div>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">
              Current order
            </p>
            <h2 className="mt-1 text-2xl font-black text-ink">Live timeline</h2>
          </div>
          <Timeline events={trackingTimeline} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <ProcurementProgression />
        <TrustVerificationPanel />
      </section>

      <ProcurementOfficerProfiles />
      <StateTransitionControls />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
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

      <DisputeEscalationWorkflow />
      <TransactionAuditLog />

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
          <PackageCheck className="h-5 w-5 text-market-green" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-black text-ink">Procurement workflow</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Officers move requests through sourcing, quotation, procurement, inspection, and dispatch readiness.
          </p>
        </article>
        <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
          <Truck className="h-5 w-5 text-market-blue" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-black text-ink">Logistics tracking</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Shipments carry carrier details, tracking codes, delivery events, ETAs, and exception flags.
          </p>
        </article>
        <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
          <ShieldAlert className="h-5 w-5 text-market-clay" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-black text-ink">Dispute handling</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Quality, payment, and delivery disputes are routed with evidence, status history, and closure notes.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-market-green" aria-hidden="true" />
            <h2 className="text-lg font-black text-ink">Transaction logs</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {transactionLogs.map((log) => (
              <div className="grid gap-2 rounded-lg bg-zinc-50 p-4 sm:grid-cols-[1fr_auto]" key={log.id}>
                <div>
                  <p className="text-sm font-black text-ink">{log.event}</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {log.order} by {log.actor}
                  </p>
                </div>
                <p className="text-sm font-black text-ink">{formatCurrency(log.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
          <h2 className="text-lg font-black text-ink">Audit trail</h2>
          <div className="mt-5 grid gap-3">
            {auditTrail.map((event) => (
              <div className="rounded-lg border border-zinc-100 p-4" key={`${event.entity}-${event.time}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-black text-ink">{event.action}</p>
                  <p className="text-xs font-bold text-zinc-500">{event.time}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {event.actor} changed {event.entity}: {event.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
