import { createFileRoute } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/alumno/viaje")({
  component: ViajePage,
});

const estadoColor = {
  activa: "bg-primary text-primary-foreground",
  en_proceso: "bg-sun text-ink",
  pendiente: "bg-kraft text-kraft-foreground",
} as const;

function ViajePage() {
  const etapas = useStore((s) => [...s.circuito].sort((a, b) => a.orden - b.orden));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl text-ink">El viaje del reciclaje</h1>
        <p className="text-sm text-muted-foreground">
          De la escuela a un nuevo producto. Seguí cada etapa.
        </p>
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
              className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-extrabold text-ink">{e.titulo}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${estadoColor[e.estado]}`}
                  >
                    {e.estado.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{e.descripcion}</p>
                {e.video && (
                  <PaperTape color="kraft" className="mt-3 text-[10px]">
                    ▶︎ Video disponible
                  </PaperTape>
                )}
              </div>
              {e.imagen && (
                <img
                  src={e.imagen}
                  alt={e.titulo}
                  className="aspect-[4/3] w-full max-w-[220px] rounded-2xl border-2 border-kraft/40 object-cover md:w-[220px]"
                  loading="lazy"
                />
              )}
            </PaperCard>
          </li>
        ))}
      </ol>
    </div>
  );
}
