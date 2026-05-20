import { MessageCircle, PhoneForwarded, SendHorizonal } from "lucide-react";
import { whatsappThreads } from "@/data/mock";

function threadTone(status: string) {
  if (status === "Sent") {
    return "bg-emerald-50 text-market-green";
  }

  if (status === "Awaiting customer") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-blue-50 text-market-blue";
}

export function WhatsappCommunicationHub() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-market-green" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">WhatsApp communication integration</h2>
      </div>
      <div className="mt-5 grid gap-3">
        {whatsappThreads.map((thread) => {
          const href = `https://wa.me/${thread.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
            `Hello ${thread.contact}, update on ${thread.order}: ${thread.lastMessage}`
          )}`;

          return (
            <article className="rounded-lg border border-zinc-100 p-4" key={`${thread.order}-${thread.template}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-ink">{thread.order} - {thread.template}</h3>
                  <p className="mt-1 text-xs font-bold text-zinc-500">{thread.contact} - {thread.phone}</p>
                </div>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${threadTone(thread.status)}`}>
                  {thread.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{thread.lastMessage}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                Linked record: {thread.linkedRecord}
              </p>
              <a
                className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-market-green px-3 py-2 text-sm font-black text-white"
                href={href}
              >
                <PhoneForwarded className="h-4 w-4" aria-hidden="true" />
                Open WhatsApp
              </a>
            </article>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-zinc-50 p-4 text-sm font-semibold leading-6 text-zinc-600">
        <SendHorizonal className="h-5 w-5 flex-none text-market-blue" aria-hidden="true" />
        WhatsApp messages are treated as communications, while the order record remains the official source of truth.
      </div>
    </section>
  );
}
