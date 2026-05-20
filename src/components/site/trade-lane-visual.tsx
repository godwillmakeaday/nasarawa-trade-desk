import Image from "next/image";
import { CheckCircle2, MapPin, Truck } from "lucide-react";

export function TradeLaneVisual() {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-soft">
        <Image
          src="/nigeria-trade-lanes.svg"
          alt="Map of procurement routes from Nasarawa markets to Nigerian regions"
          width={960}
          height={640}
          priority
          className="aspect-[1.5] w-full object-cover"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: CheckCircle2,
            title: "Verified markets",
            text: "Officer-led sourcing"
          },
          {
            icon: Truck,
            title: "Tracked dispatch",
            text: "Carrier milestones"
          },
          {
            icon: MapPin,
            title: "Regional reach",
            text: "Nigeria-wide delivery"
          }
        ].map((item) => (
          <div className="rounded-lg border border-black/5 bg-white p-4 shadow-line" key={item.title}>
            <item.icon className="h-5 w-5 text-market-green" aria-hidden="true" />
            <p className="mt-3 text-sm font-black text-ink">{item.title}</p>
            <p className="mt-1 text-xs font-semibold text-zinc-500">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
