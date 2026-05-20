import { ClipboardCheck, PhoneCall, Route, Truck } from "lucide-react";
import { transportAssignments } from "@/data/mock";

function assignmentTone(status: string) {
  if (status === "In transit") {
    return "bg-blue-50 text-market-blue";
  }

  if (status === "Assigned") {
    return "bg-emerald-50 text-market-green";
  }

  return "bg-amber-50 text-amber-700";
}

export function TransportAssignmentSystem() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-market-blue" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Transport assignment system</h2>
      </div>
      <div className="mt-5 grid gap-3">
        {transportAssignments.map((assignment) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={assignment.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{assignment.id} - {assignment.order}</h3>
                <p className="mt-1 text-sm text-zinc-600">{assignment.lane}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-xs font-black ${assignmentTone(assignment.status)}`}>
                {assignment.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-zinc-50 p-3">
                <Truck className="h-4 w-4 text-market-blue" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Carrier and vehicle</p>
                <p className="mt-1 text-sm font-black text-ink">{assignment.carrier}</p>
                <p className="mt-1 text-xs font-semibold text-zinc-500">{assignment.vehicle}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <PhoneCall className="h-4 w-4 text-market-green" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Driver contact</p>
                <p className="mt-1 text-sm font-black text-ink">{assignment.driver}</p>
                <p className="mt-1 text-xs font-semibold text-zinc-500">{assignment.driverPhone}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3">
                <Route className="h-4 w-4 text-market-clay" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-zinc-500">Release gate</p>
                <p className="mt-1 text-sm font-black text-ink">{assignment.releaseGate}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2 rounded-lg bg-ink p-3 text-sm font-semibold leading-6 text-white/75">
              <ClipboardCheck className="mt-0.5 h-4 w-4 flex-none text-emerald-200" aria-hidden="true" />
              <span>{assignment.manifest}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
