import { Navigation, ShieldAlert, Truck } from "lucide-react";
import { transportUpdates } from "@/data/mock";

function riskTone(risk: string) {
  if (risk === "Low") {
    return "bg-emerald-50 text-market-green";
  }

  if (risk === "Medium") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-blue-50 text-market-blue";
}

export function TransportVisibility() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-market-blue" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Transport visibility</h2>
      </div>
      <div className="mt-5 grid gap-3">
        {transportUpdates.map((update) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={update.lane}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{update.lane}</h3>
                <p className="mt-1 text-sm text-zinc-600">{update.carrier} - {update.vehicle}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-xs font-black ${riskTone(update.risk)}`}>
                {update.risk} risk
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-50 p-3">
                <Navigation className="h-4 w-4 text-market-green" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Checkpoint</p>
                <p className="mt-1 text-sm font-black text-ink">{update.checkpoint}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <Truck className="h-4 w-4 text-market-blue" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Driver</p>
                <p className="mt-1 text-sm font-black text-ink">{update.driver}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <ShieldAlert className="h-4 w-4 text-market-clay" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Next action</p>
                <p className="mt-1 text-sm font-black text-ink">{update.nextAction}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
