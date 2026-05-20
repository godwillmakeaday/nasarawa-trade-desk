import { Camera, ChevronRight, UploadCloud } from "lucide-react";
import { marketNodes } from "@/data/mock";

const fieldClass =
  "w-full rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm text-ink outline-none transition placeholder:text-zinc-400 focus:border-market-green focus:ring-2 focus:ring-market-green/15";

export function HeroRequestPanel() {
  return (
    <form className="rounded-lg border border-black/5 bg-white p-4 shadow-soft sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-market-blue">
            New procurement
          </p>
          <h2 className="mt-1 text-xl font-black text-ink">Create request</h2>
        </div>
        <span className="rounded-md bg-market-mint px-3 py-1 text-xs font-black text-market-green">
          Draft
        </span>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Product or commodity</span>
          <input className={fieldClass} placeholder="Eg. sesame seed, yam tubers, spare parts" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-700">Target market</span>
            <select className={fieldClass} defaultValue="Lafia Main Market">
              {marketNodes.map((market) => (
                <option key={market.name}>{market.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-700">Destination state</span>
            <select className={fieldClass} defaultValue="Lagos">
              <option>Lagos</option>
              <option>Kano</option>
              <option>Enugu</option>
              <option>Plateau</option>
              <option>Rivers</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Budget range</span>
          <input className={fieldClass} placeholder="NGN 2m - 5m" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-700">Request details</span>
          <textarea
            className={`${fieldClass} min-h-28 resize-none`}
            placeholder="Quantity, grade, preferred market, packaging, delivery timing"
          />
        </label>

        <label className="group grid cursor-pointer place-items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center transition hover:border-market-green hover:bg-emerald-50">
          <UploadCloud className="mb-3 h-7 w-7 text-market-green" aria-hidden="true" />
          <span className="text-sm font-black text-ink">Upload reference images</span>
          <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-zinc-500">
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            JPG, PNG, or WebP up to 12MB
          </span>
          <input className="sr-only" type="file" multiple accept="image/*" />
        </label>

        <button
          className="focus-ring mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-black text-white transition hover:bg-zinc-800"
          type="button"
        >
          Submit request
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
