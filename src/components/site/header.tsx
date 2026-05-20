import Link from "next/link";
import type { Route } from "next";
import { PackageCheck, ShieldCheck } from "lucide-react";

const navItems: Array<{ href: Route; label: string }> = [
  { href: "/request", label: "Request" },
  { href: "/track", label: "Track" },
  { href: "/dashboard", label: "Dashboard" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 focus-ring rounded-md" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white shadow-line">
            <PackageCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.18em] text-market-green">
              Nasarawa
            </span>
            <span className="block text-lg font-black text-ink">Trade Desk</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-ink focus-ring"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-md px-3 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 focus-ring sm:inline-flex"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-market-green px-4 py-2 text-sm font-black text-white shadow-line transition hover:bg-emerald-700 focus-ring"
            href="/register"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}
