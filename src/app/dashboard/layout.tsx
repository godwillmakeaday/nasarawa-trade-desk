import Link from "next/link";
import type { Route } from "next";
import {
  ClipboardList,
  FileClock,
  Gavel,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ReceiptText,
  ShieldCheck,
  Truck
} from "lucide-react";

const navItems: Array<{ href: Route; label: string; icon: typeof LayoutDashboard }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
  { href: "/dashboard/procurement", label: "Procurement", icon: PackageSearch },
  { href: "/dashboard/logistics", label: "Logistics", icon: Truck },
  { href: "/dashboard/disputes", label: "Disputes", icon: Gavel },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
  { href: "/dashboard/audit", label: "Audit", icon: FileClock }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-black/5 bg-ink text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-6">
            <Link className="focus-ring inline-flex items-center gap-3 rounded-md" href="/">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-market-green">
                <ReceiptText className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                  Operations
                </span>
                <span className="block text-lg font-black">Trade Desk</span>
              </span>
            </Link>
          </div>

          <nav className="grid gap-1 p-4" aria-label="Dashboard navigation">
            {navItems.map((item) => (
              <Link
                className="focus-ring inline-flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
                href={item.href}
                key={item.href}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/10 p-4">
            <button className="focus-ring inline-flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-market-green">
                Role based workspace
              </p>
              <h1 className="mt-1 text-xl font-black text-ink">Procurement operations</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-md bg-zinc-100 px-3 py-2 text-sm font-black text-zinc-700 sm:inline-flex">
                Admin view
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-market-blue text-sm font-black text-white">
                NT
              </span>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden" aria-label="Mobile dashboard navigation">
            {navItems.map((item) => (
              <Link
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-bold text-zinc-700"
                href={item.href}
                key={item.href}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
