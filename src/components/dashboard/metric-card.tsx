export function MetricCard({
  label,
  value,
  delta,
  detail
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
}) {
  const isPositive = delta.startsWith("+");

  return (
    <article className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold text-zinc-500">{label}</p>
        <span
          className={`rounded-md px-2 py-1 text-xs font-black ${
            isPositive ? "bg-emerald-50 text-market-green" : "bg-rose-50 text-rose-700"
          }`}
        >
          {delta}
        </span>
      </div>
      <p className="mt-4 text-3xl font-black text-ink">{value}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-500">{detail}</p>
    </article>
  );
}
