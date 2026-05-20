import { CheckCircle2, FileImage, UploadCloud } from "lucide-react";
import { proofOfDeliveryRecords } from "@/data/mock";

export function ProofOfDeliveryUploads() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <UploadCloud className="h-5 w-5 text-market-green" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Proof-of-delivery uploads</h2>
      </div>

      <label className="mt-5 grid cursor-pointer place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-7 text-center transition hover:border-market-green hover:bg-emerald-50">
        <FileImage className="h-8 w-8 text-market-green" aria-hidden="true" />
        <span className="mt-3 text-sm font-black text-ink">Upload POD photo, signed waybill, or delivery note</span>
        <span className="mt-1 text-xs font-semibold text-zinc-500">
          Captures recipient, timestamp, driver, and order reference before completion.
        </span>
        <input className="sr-only" type="file" multiple accept="image/*,.pdf" />
      </label>

      <div className="mt-5 grid gap-3">
        {proofOfDeliveryRecords.map((record) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={record.order}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{record.order}</h3>
                <p className="mt-1 text-sm text-zinc-600">{record.destination}</p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-market-green">
                {record.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Received by {record.recipient} via {record.capturedBy} at {record.capturedAt}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {record.evidence.map((item) => (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600" key={item}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-market-green" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
