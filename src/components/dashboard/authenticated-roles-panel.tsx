import { KeyRound, ShieldCheck, UserCheck } from "lucide-react";
import { authenticatedUsers, roleAccessMatrix } from "@/data/mock";

export function AuthenticatedRolesPanel() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-market-blue">
            Authenticated access
          </p>
          <h2 className="mt-2 text-xl font-black text-ink">Role controlled workspaces</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-market-blue">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {authenticatedUsers.map((user) => (
          <article className="rounded-lg border border-zinc-100 p-4" key={user.email}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-ink">{user.name}</h3>
                <p className="mt-1 text-xs font-bold text-zinc-500">{user.email}</p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-market-green">
                {user.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-700">
                {user.role}
              </span>
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-market-blue">
                {user.organization}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{user.assurance}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-4">
        {roleAccessMatrix.map((role) => (
          <article className="rounded-lg bg-zinc-50 p-4" key={role.role}>
            <ShieldCheck className="h-4 w-4 text-market-green" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-black text-ink">{role.role}</h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Can access</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{role.canAccess.join(", ")}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Blocked from</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{role.blockedFrom.join(", ")}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg bg-ink p-4 text-sm font-semibold leading-6 text-white/75">
        <UserCheck className="h-5 w-5 flex-none text-emerald-200" aria-hidden="true" />
        Role decisions should come from the session token and be rechecked inside every server action.
      </div>
    </section>
  );
}
