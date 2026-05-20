import { CheckCircle2, CircleDot, Clock3 } from "lucide-react";
import { procurementProgression } from "@/data/mock";

function stageIcon(status: string) {
  if (status === "Complete") {
    return CheckCircle2;
  }

  if (status === "Active") {
    return CircleDot;
  }

  return Clock3;
}

function stageTone(status: string) {
  if (status === "Complete") {
    return "bg-emerald-50 text-market-green";
  }

  if (status === "Active") {
    return "bg-blue-50 text-market-blue";
  }

  return "bg-zinc-100 text-zinc-500";
}

export function ProcurementProgression() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-market-blue">
        Procurement status
      </p>
      <h2 className="mt-2 text-xl font-black text-ink">Progression with accountable evidence</h2>
      <div className="mt-5 grid gap-3">
        {procurementProgression.map((item, index) => {
          const Icon = stageIcon(item.status);

          return (
            <article className="grid gap-3 rounded-lg border border-zinc-100 p-4 md:grid-cols-[44px_minmax(0,1fr)_auto]" key={item.stage}>
              <span className={`grid h-11 w-11 place-items-center rounded-lg ${stageTone(item.status)}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-black text-ink">{index + 1}. {item.stage}</h3>
                  <span className="text-xs font-bold text-zinc-400">{item.owner}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{item.evidence}</p>
              </div>
              <span className={`h-fit rounded-md px-2 py-1 text-xs font-black ${stageTone(item.status)}`}>
                {item.status}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
