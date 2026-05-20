import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/header";

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full max-w-2xl rounded-lg border border-black/5 bg-white p-6 shadow-soft">
          <ShieldCheck className="h-7 w-7 text-market-green" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-black text-ink">Create customer account</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Register as a buyer, submit procurement requests, receive quotations, pay securely,
            track deliveries, and open disputes when needed.
          </p>

          <form className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Full name", "Aisha Mohammed", "text"],
              ["Email address", "name@example.com", "email"],
              ["Phone number", "+234...", "tel"],
              ["Organization", "Company or business name", "text"]
            ].map(([label, placeholder, type]) => (
              <label className="grid gap-2" key={label}>
                <span className="text-sm font-bold text-zinc-700">{label}</span>
                <input
                  className="rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
                  placeholder={placeholder}
                  type={type}
                />
              </label>
            ))}
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-bold text-zinc-700">Delivery address</span>
              <textarea
                className="min-h-24 rounded-md border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-market-green focus:ring-2 focus:ring-market-green/15"
                placeholder="Street, LGA, state"
              />
            </label>
            <div className="rounded-lg bg-zinc-50 p-4 sm:col-span-2">
              <div className="flex gap-3">
                <Building2 className="mt-0.5 h-5 w-5 flex-none text-market-blue" aria-hidden="true" />
                <p className="text-sm leading-6 text-zinc-600">
                  Business verification can be added later with RC number, tax ID, and address
                  documents for higher transaction limits.
                </p>
              </div>
            </div>
            <button
              className="focus-ring rounded-md bg-ink px-4 py-3 text-sm font-black text-white sm:col-span-2"
              type="button"
            >
              Create account
            </button>
          </form>

          <p className="mt-5 text-sm font-semibold text-zinc-600">
            Already registered?{" "}
            <Link className="font-black text-market-blue hover:text-blue-700" href="/login">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
