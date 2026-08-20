import { createFileRoute } from "@tanstack/react-router";
import { PaperCard } from "@/components/paper/Paper";
import { selectRanking, useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/creador/ranking")({
  component: RankingAdmin,
});

function RankingAdmin() {
  const ranking = useStore((s) => [...selectRanking(s)].sort((a, b) => b.puntos - a.puntos));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="display text-3xl text-ink">Ranking automático</h1>
        <p className="text-sm text-muted-foreground">
          Se actualiza a medida que los alumnos suman puntos y realizan canjes.
        </p>
      </div>
      <PaperCard className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-dashed border-kraft/40 text-left text-[10px] uppercase tracking-wider text-earth">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Alumno</th>
              <th className="px-4 py-3">Escuela</th>
              <th className="px-4 py-3 text-right">Puntos</th>
              <th className="px-4 py-3 text-right">Canjes</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r, i) => (
              <tr key={r.id} className="border-b border-dashed border-kraft/20 last:border-0">
                <td className="px-4 py-3 font-extrabold text-ink">{i + 1}</td>
                <td className="px-4 py-3 font-bold text-ink">{r.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.escuela}</td>
                <td className="px-4 py-3 text-right font-extrabold text-primary">{r.puntos}</td>
                <td className="px-4 py-3 text-right text-earth">{r.canjes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PaperCard>
    </div>
  );
}
