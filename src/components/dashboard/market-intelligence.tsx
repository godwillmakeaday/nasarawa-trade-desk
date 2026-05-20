import { Activity, BarChart3, MapPinned } from "lucide-react";
import { marketNodes, marketSignals } from "@/data/mock";

const signalTone: Record<string, string> = {
  green: "bg-emerald-50 text-market-green",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-market-blue",
  clay: "bg-red-50 text-market-clay"
};

export function MarketIntelligence() {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
        <div className="flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-market-green" aria-hidden="true" />
          <h2 className="text-xl font-black text-ink">Nasarawa market network</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {marketNodes.map((node) => (
            <article className="rounded-lg border border-zinc-100 p-4" key={node.name}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-ink">{node.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    {node.lga}
                  </p>
                </div>
                <span className="rounded-md bg-market-mint px-2 py-1 text-xs font-black text-market-green">
                  {node.confidence}%
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{node.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {node.commodities.map((commodity) => (
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600" key={commodity}>
                    {commodity}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold leading-5 text-zinc-500">{node.verification}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-market-blue" aria-hidden="true" />
          <h2 className="text-xl font-black text-ink">Market intelligence</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {marketSignals.map((signal) => (
            <article className="rounded-lg bg-zinc-50 p-4" key={signal.label}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-ink">{signal.label}</h3>
                  <p className="mt-1 text-xs font-bold text-zinc-500">{signal.market}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${signalTone[signal.tone]}`}>
                  {signal.value}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{signal.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-ink p-4 text-sm font-semibold leading-6 text-white/75">
          <Activity className="h-5 w-5 flex-none text-emerald-200" aria-hidden="true" />
          Signals are designed to become a daily price, supply, route, and inspection-risk feed.
        </div>
      </div>
    </section>
  );
}
