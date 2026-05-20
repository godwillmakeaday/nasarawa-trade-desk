import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { stateTransitionRules } from "@/data/mock";

export function StateTransitionControls() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <LockKeyhole className="h-5 w-5 text-market-blue" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Realistic procurement state controls</h2>
      </div>
      <div className="mt-5 grid gap-3">
        {stateTransitionRules.map((rule) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={`${rule.from}-${rule.to}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-700">
                {rule.from}
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-market-blue">
                {rule.to}
              </span>
              <span className="ml-auto rounded-md bg-market-mint px-2 py-1 text-xs font-black text-market-green">
                {rule.actor}
              </span>
            </div>
            <div className="mt-3 flex gap-2 text-sm leading-6 text-zinc-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-market-green" aria-hidden="true" />
              <p>{rule.guard}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
