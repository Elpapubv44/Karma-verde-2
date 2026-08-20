import { createFileRoute } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/asociado/logistica")({
  component: AsociadoLogistica,
});

function AsociadoLogistica() {
  const circuito = useStore((s) => s.circuito);
  const puntos = useStore((s) => s.puntosVerdes);
  const tareas = useStore((s) => s.tareas);

  const enCurso = tareas.filter((t) => t.estado !== "completada");

  return (
    <div className="space-y-5">
      <PaperCard variant="kraft">
        <PaperTape color="sun" className="mb-2">
          Logística
        </PaperTape>
        <h1 className="display text-3xl">Coordinación de retiros</h1>
        <p className="mt-1 text-sm opacity-90">Puntos de acopio, etapas y tareas abiertas.</p>
      </PaperCard>

      <PaperCard>
        <h2 className="display text-2xl text-ink">Tareas abiertas</h2>
        {enCurso.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No hay retiros pendientes.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {enCurso.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-2xl border-2 border-dashed border-kraft/50 px-3 py-2"
              >
                <span className="text-sm font-bold text-ink">{t.titulo}</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-earth">
                  {t.escuela} · {t.estado === "en_curso" ? "En curso" : "Pendiente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PaperCard>

      <PaperCard>
        <h2 className="display text-2xl text-ink">Puntos verdes</h2>
        <ul className="mt-3 space-y-2">
          {puntos.map((p) => (
            <li key={p.id} className="rounded-2xl border-2 border-dashed border-kraft/50 px-3 py-2">
              <p className="text-sm font-bold text-ink">{p.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {p.escuela} · {p.materiales.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </PaperCard>

      <PaperCard>
        <h2 className="display text-2xl text-ink">Etapas del circuito</h2>
        <ol className="mt-3 space-y-2">
          {circuito
            .slice()
            .sort((a, b) => a.orden - b.orden)
            .map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-2xl border-2 border-dashed border-kraft/50 px-3 py-2"
              >
                <span className="text-sm font-bold text-ink">
                  {e.orden}. {e.titulo}
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-earth">
                  {e.estado.replace("_", " ")}
                </span>
              </li>
            ))}
        </ol>
      </PaperCard>
    </div>
  );
}
