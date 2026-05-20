import { Camera, CheckCircle2, PackageSearch } from "lucide-react";
import { InspectionEvidence } from "@/components/dashboard/inspection-evidence";
import { InspectionEvidenceGallery } from "@/components/dashboard/inspection-evidence-gallery";
import { MarketIntelligence } from "@/components/dashboard/market-intelligence";
import { ProcurementOfficerProfiles } from "@/components/dashboard/procurement-officer-profiles";
import { ProcurementProgression } from "@/components/dashboard/procurement-progression";
import { StateTransitionControls } from "@/components/dashboard/state-transition-controls";
import { orders } from "@/data/mock";
import { StatusPill } from "@/components/dashboard/status-pill";

const checklist = [
  "Confirm product description, quantity, grade, and destination.",
  "Review customer reference images and flag unclear requirements.",
  "Assign target market and officer responsible for sourcing.",
  "Capture quotation notes with availability, quality, and vendor constraints.",
  "Record inspection notes before dispatch release."
];

export default function ProcurementPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-black/5 bg-white p-6 shadow-line">
          <PackageSearch className="h-6 w-6 text-market-green" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-black text-ink">Procurement workflow</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
            This queue gives market officers a clean path from request validation to quotation,
            procurement start, quality inspection, and dispatch approval.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <div className="flex gap-3 rounded-lg bg-zinc-50 p-4" key={item}>
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-market-green" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-zinc-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/5 bg-ink p-6 text-white shadow-line">
          <Camera className="h-6 w-6 text-emerald-200" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-black">Reference image review</h3>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Product photos are stored as request evidence and are available during sourcing,
            quotation, quality check, and dispute review.
          </p>
          <button className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-black text-ink">
            Open image queue
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <ProcurementProgression />
        <InspectionEvidence />
      </section>

      <MarketIntelligence />
      <ProcurementOfficerProfiles />
      <InspectionEvidenceGallery />
      <StateTransitionControls />

      <section className="rounded-lg border border-black/5 bg-white shadow-line">
        <div className="border-b border-zinc-100 p-5">
          <h3 className="text-lg font-black text-ink">Market sourcing queue</h3>
        </div>
        <div className="divide-y divide-zinc-100">
          {orders
            .filter((order) => ["SOURCING", "QUOTED", "QUALITY_CHECK", "PROCUREMENT_STARTED"].includes(order.status))
            .map((order) => (
              <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto]" key={order.id}>
                <div>
                  <p className="font-black text-ink">{order.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {order.requestNumber} from {order.customer} at {order.market}
                  </p>
                </div>
                <StatusPill status={order.status} />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
