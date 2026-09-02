import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaperCard, PaperTape, PaperButton } from "@/components/paper/Paper";
import { PremioImage } from "@/components/ui/premio-image";
import { useStore } from "@/lib/store";
import { Truck, CheckCircle2, PlayCircle, ExternalLink, X, Factory, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/alumno/viaje")({
  component: ViajePage,
});

const estadoColor = {
  activa: "bg-primary text-primary-foreground",
  en_proceso: "bg-sun text-ink",
  pendiente: "bg-kraft text-kraft-foreground",
} as const;

export function ViajePage() {
  const etapas = useStore((s) => [...s.circuito].sort((a, b) => a.orden - b.orden));
  const [videoModal, setVideoModal] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-3xl text-ink">El viaje del reciclaje</h1>
          <p className="text-sm text-muted-foreground">
            De la escuela a un nuevo producto. Seguí la trazabilidad completa en tiempo real.
          </p>
        </div>
        <PaperTape color="leaf" className="shrink-0 flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" /> {etapas.length} Etapas del Circuito
        </PaperTape>
      </div>

      <ol className="relative space-y-6 pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-1 rounded-full bg-kraft/50" />
        {etapas.map((e, i) => (
          <li key={e.id} className="relative">
            <span className="absolute -left-6 top-2 grid h-8 w-8 place-items-center rounded-full border-4 border-cream bg-primary text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-cutout)]">
              {e.orden}
            </span>
            <PaperCard
              tilt={i % 2 ? "r" : "l"}
              className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center p-5"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-extrabold text-ink">{e.titulo}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${estadoColor[e.estado]}`}
                  >
                    {e.estado.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-earth leading-relaxed">{e.descripcion}</p>

                {e.video && (
                  <div className="pt-2">
                    <button
                      onClick={() => setVideoModal(e.video ?? null)}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition active:scale-95"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Ver video explicativo
                    </button>
                  </div>
                )}
              </div>

              {e.imagen && (
                <div className="aspect-[4/3] w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl border-2 border-kraft/40 md:w-[220px]">
                  <PremioImage
                    src={e.imagen}
                    alt={e.titulo}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
            </PaperCard>
          </li>
        ))}
      </ol>

      {/* Video Modal */}
      {videoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs animate-in fade-in"
        >
          <PaperCard className="relative w-full max-w-lg p-5 space-y-3">
            <button
              onClick={() => setVideoModal(null)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-kraft bg-cream text-ink hover:bg-kraft/20"
              aria-label="Cerrar video"
            >
              <X className="h-4 w-4" />
            </button>

            <PaperTape color="sun">Video del Proceso</PaperTape>
            <h3 className="display text-xl text-ink">Circuito de Transformación</h3>

            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src={videoModal}
                title="Video del proceso"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex justify-end">
              <PaperButton variant="cream" onClick={() => setVideoModal(null)}>
                Cerrar
              </PaperButton>
            </div>
          </PaperCard>
        </div>
      )}
    </div>
  );
}
