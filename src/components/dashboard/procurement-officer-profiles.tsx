import { BadgeCheck, Languages, Phone, UserRoundCheck } from "lucide-react";
import { procurementOfficers } from "@/data/mock";

export function ProcurementOfficerProfiles() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <UserRoundCheck className="h-5 w-5 text-market-green" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Procurement officer profiles</h2>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {procurementOfficers.map((officer) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={officer.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{officer.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {officer.desk}
                </p>
              </div>
              <span className="rounded-md bg-market-mint px-2 py-1 text-xs font-black text-market-green">
                {officer.activeRequests} active
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex gap-2 text-sm text-zinc-600">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-market-blue" aria-hidden="true" />
                <span>{officer.phone}</span>
              </div>
              <div className="flex gap-2 text-sm text-zinc-600">
                <Languages className="mt-0.5 h-4 w-4 flex-none text-market-clay" aria-hidden="true" />
                <span>{officer.languages.join(", ")}</span>
              </div>
              <div className="flex gap-2 text-sm text-zinc-600">
                <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-market-green" aria-hidden="true" />
                <span>{officer.verification}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {officer.specialties.map((specialty) => (
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600" key={specialty}>
                  {specialty}
                </span>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-zinc-50 p-3 text-xs font-semibold leading-5 text-zinc-600">
              {officer.supervisor}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
