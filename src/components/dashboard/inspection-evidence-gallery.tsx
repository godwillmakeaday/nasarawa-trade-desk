import { Camera, FileAudio, ImageIcon } from "lucide-react";
import { inspectionGallery } from "@/data/mock";

function galleryTone(status: string) {
  if (status === "Passed" || status === "Cleared") {
    return "bg-emerald-50 text-market-green";
  }

  return "bg-amber-50 text-amber-700";
}

export function InspectionEvidenceGallery() {
  return (
    <section className="rounded-lg border border-black/5 bg-white p-5 shadow-line">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-market-green" aria-hidden="true" />
        <h2 className="text-xl font-black text-ink">Inspection evidence gallery</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {inspectionGallery.map((item) => {
          const Icon = item.type === "Voice note" ? FileAudio : ImageIcon;

          return (
            <article className="overflow-hidden rounded-lg border border-zinc-100" key={item.id}>
              <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
                <div className="grid h-16 w-16 place-items-center rounded-lg bg-white text-market-green shadow-line">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs font-bold text-zinc-500">{item.order}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${galleryTone(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.caption}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">{item.type}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
