import { ArrowRight } from "lucide-react";
import { InspectionEvidence } from "@/components/dashboard/inspection-evidence";
import { InspectionEvidenceGallery } from "@/components/dashboard/inspection-evidence-gallery";
import { OrderTable } from "@/components/dashboard/order-table";
import { ProcurementProgression } from "@/components/dashboard/procurement-progression";
import { ProofOfDeliveryUploads } from "@/components/dashboard/proof-of-delivery-uploads";
import { StateTransitionControls } from "@/components/dashboard/state-transition-controls";
import { TransportAssignmentSystem } from "@/components/dashboard/transport-assignment-system";
import { TrustVerificationPanel } from "@/components/dashboard/trust-verification-panel";
import { WhatsappCommunicationHub } from "@/components/dashboard/whatsapp-communication-hub";
import { WhatsappEscalation } from "@/components/dashboard/whatsapp-escalation";
import { orders } from "@/data/mock";
import { workflowStages } from "@/lib/workflow";

export default function OrdersPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/5 bg-white p-6 shadow-line">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">
          Order tracking
        </p>
        <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-3xl font-black text-ink">Unified order workflow</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
              Requests become orders after quote acceptance and payment verification. The same
              record carries procurement, quality, dispatch, logistics, disputes, transactions,
              and audit history.
            </p>
          </div>
          <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-market-green px-4 py-3 text-sm font-black text-white">
            Create manual request
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <OrderTable orders={orders} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <ProcurementProgression />
        <div className="grid gap-6">
          <TrustVerificationPanel />
          <WhatsappEscalation />
        </div>
      </section>

      <InspectionEvidence />
      <InspectionEvidenceGallery />
      <StateTransitionControls />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <TransportAssignmentSystem />
        <div className="grid gap-6">
          <ProofOfDeliveryUploads />
          <WhatsappCommunicationHub />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {workflowStages.map((stage, index) => (
          <article className="rounded-lg border border-black/5 bg-white p-4 shadow-line" key={stage.status}>
            <span className="grid h-8 w-8 place-items-center rounded-md bg-zinc-100 text-sm font-black text-ink">
              {index + 1}
            </span>
            <h3 className="mt-4 text-sm font-black text-ink">{stage.label}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{stage.description}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
              {stage.owner.join(", ")}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
