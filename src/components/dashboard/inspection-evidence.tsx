import { Camera, ClipboardCheck, FileCheck2 } from "lucide-react";
import { inspectionEvidence } from "@/data/mock";

function evidenceTone(status: string) {
  if (status === "Cleared") {
    return "bg-emerald-50 text-market-green";
  }

  if (status === "Needs approval") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-blue-50 text-market-blue";
}

export function InspectionEvidence() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-market-green" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Inspection evidence</h2>
      </div>
      <div className="mt-5 grid gap-3">
        {inspectionEvidence.map((item) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={item.title}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{item.title}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {item.order} - {item.market}
                </p>
              </div>
              <span className={`rounded-md px-2 py-1 text-xs font-black ${evidenceTone(item.status)}`}>
                {item.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.result}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-lg bg-zinc-50 p-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-market-blue" aria-hidden="true" />
                  <p className="text-xs font-bold text-zinc-500">Evidence pack</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-zinc-700">{item.evidence}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <FileCheck2 className="h-4 w-4 text-market-green" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Reviewer</p>
                <p className="mt-1 text-sm font-black text-ink">{item.reviewer}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
