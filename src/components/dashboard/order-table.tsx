import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DashboardOrder } from "@/types";
import { StatusPill } from "./status-pill";

export function OrderTable({ orders }: { orders: DashboardOrder[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-line">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            <tr>
              <th className="px-4 py-4">Request</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Market</th>
              <th className="px-4 py-4">Destination</th>
              <th className="px-4 py-4">Amount</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">ETA</th>
              <th className="px-4 py-4" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.map((order) => (
              <tr className="align-top transition hover:bg-zinc-50" key={order.id}>
                <td className="px-4 py-4">
                  <p className="font-black text-ink">{order.requestNumber}</p>
                  <p className="mt-1 max-w-52 text-zinc-500">{order.title}</p>
                </td>
                <td className="px-4 py-4 font-semibold text-zinc-700">{order.customer}</td>
                <td className="px-4 py-4 text-zinc-600">{order.market}</td>
                <td className="px-4 py-4 text-zinc-600">{order.destination}</td>
                <td className="px-4 py-4 font-black text-ink">{formatCurrency(order.amount)}</td>
                <td className="px-4 py-4">
                  <StatusPill status={order.status} />
                </td>
                <td className="px-4 py-4 font-semibold text-zinc-600">{order.eta}</td>
                <td className="px-4 py-4">
                  <Link
                    className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:border-market-green hover:text-market-green"
                    href={`/dashboard/orders#${order.id}`}
                    aria-label={`Open ${order.requestNumber}`}
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
