import { FileClock, ReceiptText } from "lucide-react";
import { TransactionAuditLog } from "@/components/dashboard/transaction-audit-log";
import { auditTrail, transactionLogs } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export default function AuditPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/5 bg-white p-6 shadow-line">
        <FileClock className="h-6 w-6 text-market-blue" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-ink">Audit trails and transaction logs</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
          Sensitive actions are recorded with actor, entity, before and after values, source
          metadata, and timestamps. Financial events are stored separately for reconciliation.
        </p>
      </section>

      <TransactionAuditLog />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-black/5 bg-white shadow-line">
          <div className="border-b border-zinc-100 p-5">
            <h3 className="text-lg font-black text-ink">Audit trail</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {auditTrail.map((event) => (
              <div className="p-5" key={`${event.entity}-${event.time}`}>
                <p className="font-black text-ink">{event.action}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  {event.actor} changed {event.entity}: {event.detail}
                </p>
                <p className="mt-2 text-xs font-bold text-zinc-500">{event.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/5 bg-white shadow-line">
          <div className="flex items-center gap-2 border-b border-zinc-100 p-5">
            <ReceiptText className="h-5 w-5 text-market-green" aria-hidden="true" />
            <h3 className="text-lg font-black text-ink">Transaction log</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {transactionLogs.map((log) => (
              <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]" key={log.id}>
                <div>
                  <p className="font-black text-ink">{log.event}</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {log.order} by {log.actor}
                  </p>
                  <p className="mt-2 text-xs font-bold text-zinc-500">{log.time}</p>
                </div>
                <p className="font-black text-ink">{formatCurrency(log.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
