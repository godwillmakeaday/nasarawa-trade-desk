import { ArrowUpRight, Gavel, TimerReset, Users } from "lucide-react";
import { escalationTiers } from "@/lib/dispute-sla";
import { roleLabels } from "@/lib/auth";

export function DisputeEscalationWorkflow() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <Gavel className="h-5 w-5 text-market-clay" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Dispute escalation workflow</h2>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {escalationTiers.map((tier) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={tier.level}>
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-sm font-black text-market-clay">
                {tier.level}
              </span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-sm font-black text-ink">{tier.owner}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{tier.trigger}</p>
            <div className="mt-4 rounded-lg bg-zinc-50 p-3">
              <div className="flex items-center gap-2">
                <TimerReset className="h-4 w-4 text-market-blue" aria-hidden="true" />
                <p className="text-xs font-bold text-zinc-500">SLA</p>
              </div>
              <p className="mt-1 text-sm font-black text-ink">
                {tier.slaBusinessHours} business hour{tier.slaBusinessHours === 1 ? "" : "s"}
              </p>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-zinc-500">
              <Users className="mt-0.5 h-3.5 w-3.5 flex-none text-zinc-400" aria-hidden="true" />
              <p className="font-bold">
                {tier.responders.map((role) => roleLabels[role]).join(", ")}
              </p>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-zinc-700">{tier.action}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
