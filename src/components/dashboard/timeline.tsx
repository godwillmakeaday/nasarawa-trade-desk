import { CheckCircle2, Circle, Clock3, TriangleAlert } from "lucide-react";
import type { TimelineEvent } from "@/types";

const eventIcon = {
  done: CheckCircle2,
  current: Clock3,
  upcoming: Circle,
  issue: TriangleAlert
};

const eventTone = {
  done: "text-market-green bg-emerald-50",
  current: "text-market-blue bg-blue-50",
  upcoming: "text-zinc-500 bg-zinc-100",
  issue: "text-rose-700 bg-rose-50"
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      {events.map((event, index) => {
        const Icon = eventIcon[event.status];

        return (
          <li className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-3 pb-6 last:pb-0" key={event.title}>
            {index < events.length - 1 ? (
              <span className="absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px bg-zinc-200" aria-hidden="true" />
            ) : null}
            <span className={`z-10 grid h-10 w-10 place-items-center rounded-lg ${eventTone[event.status]}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-black text-ink">{event.title}</span>
                <span className="text-xs font-bold text-zinc-500">{event.timestamp}</span>
              </span>
              <span className="mt-1 block text-sm leading-6 text-zinc-600">{event.description}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
