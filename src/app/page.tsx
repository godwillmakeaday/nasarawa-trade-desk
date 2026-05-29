import Link from "next/link";
import { ArrowRight, BadgeCheck, LockKeyhole, MapPinned, ReceiptText, Route, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { TradeLaneVisual } from "@/components/site/trade-lane-visual";
import { marketNodes } from "@/data/mock";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verified market operators",
    body: "Every request is tied to an officer, market desk, supplier reference, and payment release control."
  },
  {
    icon: ReceiptText,
    title: "Inspection-backed quotations",
    body: "Quotes carry source market, availability notes, logistics estimate, and evidence required before dispatch."
  },
  {
    icon: Route,
    title: "Transport visibility",
    body: "Carrier, driver, checkpoint, ETA, route risk, and escalation events live on the same order timeline."
  }
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8 lg:pb-20 lg:pt-14">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-market-green shadow-line">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                Trusted Nasarawa market procurement
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.03] text-ink sm:text-5xl lg:text-6xl">
                Nasarawa Trade Desk
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-zinc-600">
                A secure procurement and logistics workspace for Nigerian buyers who need verified
                sourcing, structured quotations, protected payments, and delivery visibility from
                Nasarawa State markets.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  className="focus-ring inline-flex items-center gap-2 rounded-md bg-market-green px-5 py-3 text-sm font-black text-white shadow-line transition hover:bg-emerald-700"
                  href="/request"
                >
                  Create procurement request
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-ink shadow-line transition hover:border-zinc-300 hover:bg-zinc-50"
                  href="/track"
                >
                  Track an order
                </Link>
              </div>
            </div>
          </div>

          <TradeLaneVisual />
        </section>

        <section className="border-y border-black/5 bg-white/70">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
            {trustItems.map((item) => (
              <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line" key={item.title}>
                <item.icon className="h-5 w-5 text-market-blue" aria-hidden="true" />
                <h2 className="mt-4 text-sm font-black text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-market-blue">
                Regional operating network
              </p>
              <h2 className="mt-3 text-3xl font-black text-ink">Built around real Nasarawa trade desks.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                The platform treats each market as an operating node with a sourcing role,
                verification state, commodity focus, and route intelligence.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md bg-market-mint px-3 py-2 text-sm font-black text-market-green">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Officer verified
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {marketNodes.map((node) => (
              <article className="rounded-lg border border-black/5 bg-white p-4 shadow-line" key={node.name}>
                <MapPinned className="h-5 w-5 text-market-green" aria-hidden="true" />
                <h3 className="mt-4 text-sm font-black text-ink">{node.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                  {node.lga}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{node.role}</p>
                <p className="mt-3 text-xs font-black text-market-blue">{node.signal}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
