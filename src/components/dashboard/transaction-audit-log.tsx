import { DatabaseZap, FileClock } from "lucide-react";
import { enterpriseAuditEvents } from "@/data/mock";

export function TransactionAuditLog() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <DatabaseZap className="h-5 w-5 text-market-blue" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Transaction audit log</h2>
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-zinc-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              <tr>
                <th className="px-4 py-4">Event</th>
                <th className="px-4 py-4">Actor</th>
                <th className="px-4 py-4">Entity</th>
                <th className="px-4 py-4">Before</th>
                <th className="px-4 py-4">After</th>
                <th className="px-4 py-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {enterpriseAuditEvents.map((event) => (
                <tr className="align-top" key={event.id}>
                  <td className="px-4 py-4">
                    <p className="font-black text-ink">{event.action}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">{event.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-zinc-700">{event.actor}</p>
                    <p className="mt-1 text-xs font-bold text-zinc-400">{event.role}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-zinc-700">{event.entity}</td>
                  <td className="px-4 py-4 text-zinc-600">{event.before}</td>
                  <td className="px-4 py-4 text-zinc-600">{event.after}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">
                      {event.source}
                    </span>
                    <p className="mt-2 text-xs text-zinc-400">{event.ip}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-ink p-4 text-sm font-semibold leading-6 text-white/75">
        <FileClock className="h-5 w-5 flex-none text-emerald-200" aria-hidden="true" />
        Each operational mutation should be written with actor, role, source, before state, after state, and timestamp.
      </div>
    </section>
  );
}
