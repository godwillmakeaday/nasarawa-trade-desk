import { MessageCircle, PhoneForwarded } from "lucide-react";
import { whatsappEscalations } from "@/data/mock";

export function WhatsappEscalation() {
  const message = encodeURIComponent(
    "Hello Nasarawa Trade Desk, I need help with order NRP-2026-0418. Last status: QUALITY_CHECK."
  );
  const whatsappHref = `https://wa.me/2348000000000?text=${message}`;

  return (
    <section className="rounded-lg border border-black/5 bg-ink p-5 text-white shadow-line">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
            Escalation
          </p>
          <h2 className="mt-2 text-xl font-black">WhatsApp operations flow</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-emerald-200">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {whatsappEscalations.map((step) => (
          <article className="rounded-lg bg-white/10 p-4" key={step.step}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
              {step.step}
            </p>
            <h3 className="mt-2 text-sm font-black text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{step.detail}</p>
          </article>
        ))}
      </div>

      <a
        className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-black text-ink"
        href={whatsappHref}
      >
        <PhoneForwarded className="h-4 w-4" aria-hidden="true" />
        Escalate on WhatsApp
      </a>
    </section>
  );
}
