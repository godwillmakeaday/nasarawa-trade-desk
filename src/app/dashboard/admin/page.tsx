import { ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { AuthenticatedRolesPanel } from "@/components/dashboard/authenticated-roles-panel";
import { StateTransitionControls } from "@/components/dashboard/state-transition-controls";
import { roleLabels } from "@/lib/auth";

const adminModules = [
  "User and role management",
  "Quotation approval",
  "Payment reconciliation",
  "Workflow override controls",
  "Dispute escalation",
  "Audit export"
];

export default function AdminPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/5 bg-white p-6 shadow-line">
        <ShieldCheck className="h-6 w-6 text-market-green" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-ink">Admin dashboard</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
          Admins manage users, roles, operational overrides, quotation controls,
          dispute escalation, transaction visibility, and audit exports.
        </p>
      </section>

      <AuthenticatedRolesPanel />
      <StateTransitionControls />

      <section className="grid gap-4 lg:grid-cols-3">
        {adminModules.map((module) => (
          <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line" key={module}>
            <UserCog className="h-5 w-5 text-market-blue" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-black text-ink">{module}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Guarded by admin role checks and logged to the audit trail.
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-market-clay" aria-hidden="true" />
          <h3 className="text-lg font-black text-ink">Role matrix</h3>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(roleLabels).map(([role, label]) => (
            <div className="rounded-lg bg-zinc-50 p-4" key={role}>
              <p className="text-sm font-black text-ink">{label}</p>
              <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                {role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
