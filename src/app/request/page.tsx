import { ReceiptText } from "lucide-react";
import { ProcurementRequestForm } from "@/components/site/procurement-request-form";
import { SiteHeader } from "@/components/site/header";

export default function RequestPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-black/5 bg-white p-6 shadow-soft">
          <ReceiptText className="h-7 w-7 text-market-green" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-black text-ink">Create procurement request</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Capture what you need, where it should be delivered, target quantity, budget, and
            product references. The procurement desk will respond with a structured quotation.
          </p>

          <ProcurementRequestForm />
        </section>
      </main>
    </>
  );
}
