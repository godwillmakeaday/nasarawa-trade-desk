import { ArrowUpRight, Gavel, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { DisputeEscalationWorkflow } from "@/components/dashboard/dispute-escalation-workflow";
import { TransactionAuditLog } from "@/components/dashboard/transaction-audit-log";
import { WhatsappCommunicationHub } from "@/components/dashboard/whatsapp-communication-hub";
import { escalateDispute } from "@/app/dashboard/disputes/actions";
import { disputes } from "@/data/mock";

export default function DisputesPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/5 bg-white p-6 shadow-line">
        <Gavel className="h-6 w-6 text-market-clay" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-ink">Dispute handling</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
          Disputes collect customer complaints, procurement evidence, logistics events,
          transaction references, staff notes, resolution decisions, and final audit entries.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-black/5 bg-white shadow-line">
          <div className="border-b border-zinc-100 p-5">
            <h3 className="text-lg font-black text-ink">Open dispute queue</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {disputes.map((dispute) => (
              <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto]" key={dispute.id}>
                <div>
                  <p className="font-black text-ink">{dispute.id}</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {dispute.order}: {dispute.reason}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Owner: {dispute.owner}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-700">
                    {dispute.status}
                  </span>
                  <p className="mt-2 text-xs font-bold text-zinc-500">{dispute.age}</p>
                  <form action={escalateDispute} className="mt-3 grid gap-1.5 md:justify-items-end">
                    <input name="disputeId" type="hidden" value={dispute.id} />
                    <input name="currentLevel" type="hidden" value={dispute.level} />
                    <input
                      name="note"
                      type="text"
                      placeholder="Escalation note"
                      className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs text-zinc-700 outline-none focus:border-market-clay focus:ring-2 focus:ring-market-clay/15 md:w-52"
                    />
                    <button
                      type="submit"
                      className="focus-ring inline-flex items-center gap-1 rounded-md bg-market-clay px-3 py-1.5 text-xs font-black text-white"
                    >
                      Escalate
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-black/5 bg-ink p-6 text-white shadow-line">
          <MessageSquareWarning className="h-6 w-6 text-rose-200" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-black">Resolution checklist</h3>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-white/75">
            <li>Confirm issue category and customer evidence.</li>
            <li>Attach procurement notes and quality images.</li>
            <li>Review transaction logs before refund approval.</li>
            <li>Record decision and notify all parties.</li>
          </ul>
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-white/10 p-3 text-sm font-bold">
            <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden="true" />
            Every dispute decision creates an audit event.
          </div>
        </aside>
      </section>

      <DisputeEscalationWorkflow />
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <TransactionAuditLog />
        <WhatsappCommunicationHub />
      </section>
    </div>
  );
}
