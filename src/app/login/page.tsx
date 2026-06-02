import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { LoginForm } from "@/components/site/login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

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

          <LoginForm next={next} />

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
