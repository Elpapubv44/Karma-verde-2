import { createFileRoute } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { selectEscuelas, useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/asociado/escuelas")({
  component: AsociadoEscuelas,
});

function AsociadoEscuelas() {
  const escuelas = useStore(selectEscuelas);
  const tareas = useStore((s) => s.tareas);

  return (
    <div className="space-y-5">
      <PaperCard variant="kraft">
        <PaperTape color="sun" className="mb-2">
          Seguimiento
        </PaperTape>
        <h1 className="display text-3xl">Metas y puntos por escuela</h1>
        <p className="mt-1 text-sm opacity-90">Avance de cada institución del circuito.</p>
      </PaperCard>

      {escuelas.length === 0 ? (
        <PaperCard>
          <p className="text-sm text-muted-foreground">
            Aún no hay escuelas con alumnos registrados.
          </p>
        </PaperCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {escuelas.map((e) => {
            const t = tareas.filter((x) => x.escuela === e.escuela);
            const meta = t.reduce((a, x) => a + x.meta, 0);
            const prog = t.reduce((a, x) => a + x.progreso, 0);
            const pct = meta ? Math.min(100, Math.round((prog / meta) * 100)) : 0;
            return (
              <PaperCard key={e.escuela}>
                <p className="display text-2xl text-ink">{e.escuela}</p>
                <p className="text-xs font-extrabold uppercase tracking-wider text-earth">
                  {e.alumnos} alumnos · {e.puntos} pts · {e.canjes} canjes
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-kraft/25">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-[11px] font-bold text-muted-foreground">
                  {t.length} tareas · {prog}/{meta} kg ({pct}%)
                </p>
              </PaperCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
