import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { SiteHeader } from "@/components/site/header";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-lg border border-black/5 bg-white p-6 shadow-soft">
          <LockKeyhole className="h-7 w-7 text-market-green" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-black text-ink">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Access customer requests, quotations, payments, tracking, disputes, and admin workspaces.
          </p>

          <form className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-700">Email address</span>
              <input
                className="rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
                placeholder="name@example.com"
                type="email"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-700">Password</span>
              <input
                className="rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
                placeholder="Enter password"
                type="password"
              />
            </label>
            <button
              className="focus-ring rounded-md bg-market-green px-4 py-3 text-sm font-black text-white"
              type="button"
            >
              Continue
            </button>
          </form>

          <p className="mt-5 text-sm font-semibold text-zinc-600">
            New buyer?{" "}
            <Link className="font-black text-market-blue hover:text-blue-700" href="/register">
              Create account
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
