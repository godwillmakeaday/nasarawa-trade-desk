import { MapPinned, Truck, Waypoints } from "lucide-react";
import { ProofOfDeliveryUploads } from "@/components/dashboard/proof-of-delivery-uploads";
import { TransportAssignmentSystem } from "@/components/dashboard/transport-assignment-system";
import { TransportVisibility } from "@/components/dashboard/transport-visibility";
import { WhatsappCommunicationHub } from "@/components/dashboard/whatsapp-communication-hub";
import { WhatsappEscalation } from "@/components/dashboard/whatsapp-escalation";
import { orders } from "@/data/mock";
import { StatusPill } from "@/components/dashboard/status-pill";

const lanes = [
  { route: "Lafia to Kano", carrier: "NorthLink Haulage", status: "In transit", eta: "May 20" },
  { route: "Keffi to Lagos", carrier: "BlueRoad Logistics", status: "At Abuja hub", eta: "May 21" },
  { route: "Akwanga to Enugu", carrier: "EastGate Dispatch", status: "Scheduled", eta: "May 23" }
];

export default function LogisticsPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/5 bg-white p-6 shadow-line">
        <Truck className="h-6 w-6 text-market-blue" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-ink">Logistics tracking</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
          Logistics officers create shipments, assign carriers, issue tracking codes, update
          route events, and manage delivery exceptions from dispatch to confirmation.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-6">
          <TransportAssignmentSystem />
          <TransportVisibility />
          <ProofOfDeliveryUploads />
        </div>
        <div className="grid gap-6">
          <WhatsappEscalation />
          <WhatsappCommunicationHub />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {lanes.map((lane) => (
          <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line" key={lane.route}>
            <MapPinned className="h-5 w-5 text-market-green" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-black text-ink">{lane.route}</h3>
            <p className="mt-2 text-sm text-zinc-600">{lane.carrier}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-market-blue">
                {lane.status}
              </span>
              <span className="text-xs font-bold text-zinc-500">ETA {lane.eta}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-black/5 bg-white shadow-line">
        <div className="flex items-center gap-2 border-b border-zinc-100 p-5">
          <Waypoints className="h-5 w-5 text-market-clay" aria-hidden="true" />
          <h3 className="text-lg font-black text-ink">Shipment queue</h3>
        </div>
        <div className="divide-y divide-zinc-100">
          {orders.map((order) => (
            <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto]" key={order.id}>
              <div>
                <p className="font-black text-ink">{order.requestNumber}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {order.title} to {order.destination}
                </p>
              </div>
              <StatusPill status={order.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
