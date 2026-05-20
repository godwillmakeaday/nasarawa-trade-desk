import { BadgeCheck, Clock3, LockKeyhole } from "lucide-react";
import { verificationChecks } from "@/data/mock";

function checkTone(status: string) {
  if (status === "Verified") {
    return "bg-emerald-50 text-market-green ring-emerald-200";
  }

  if (status === "Protected") {
    return "bg-blue-50 text-market-blue ring-blue-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export function TrustVerificationPanel() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">
            Trust controls
          </p>
          <h2 className="mt-2 text-xl font-black text-ink">Verification indicators</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-market-mint text-market-green">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {verificationChecks.map((check) => {
          const Icon = check.status === "In review" ? Clock3 : BadgeCheck;

          return (
            <article className="rounded-lg bg-zinc-50 p-4" key={check.label}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-market-green" aria-hidden="true" />
                  <h3 className="text-sm font-black text-ink">{check.label}</h3>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-black ring-1 ${checkTone(check.status)}`}>
                  {check.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{check.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
