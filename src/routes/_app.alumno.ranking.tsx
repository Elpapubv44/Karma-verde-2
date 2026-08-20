import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { selectRanking, togglePrivacidad, useStore } from "@/lib/store";
import { Trophy, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/alumno/ranking")({
  component: RankingPage,
});

function RankingPage() {
  const ranking = useStore(selectRanking);
  const privacidadNombres = useStore((s) => s.privacidadNombres);
  const user = useStore((s) => s.user);
  const [orden, setOrden] = useState<"puntos" | "canjes">("puntos");

  const sorted = useMemo(() => [...ranking].sort((a, b) => b[orden] - a[orden]), [ranking, orden]);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display truncate text-3xl text-ink">Ranking y Mérito Escolar</h1>
          <p className="text-sm text-muted-foreground">
            Reconocimiento a los estudiantes y escuelas con mayor impacto ecológico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Privacy Toggle */}
          <button
            onClick={togglePrivacidad}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              privacidadNombres
                ? "border-primary bg-primary/15 text-primary"
                : "border-kraft/60 bg-cream text-earth hover:bg-kraft/20"
            }`}
            title="Oculta apellidos para cumplir con normativas de protección de menores"
          >
            {privacidadNombres ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span>{privacidadNombres ? "Privacidad Activa (Iniciales)" : "Modo Completo"}</span>
          </button>

          {/* Selector de orden */}
          <div className="flex shrink-0 gap-1 rounded-full border-2 border-kraft bg-cream p-1">
            {(["puntos", "canjes"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOrden(o)}
                className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase transition ${
                  orden === o ? "bg-primary text-primary-foreground shadow-xs" : "text-ink"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Podio Top 3 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-2">
        {sorted.slice(0, 3).map((r, i) => {
          const isCurrentUser = r.id === user?.id;
          return (
            <PaperCard
              key={r.id}
              variant={i === 0 ? "leaf" : "kraft"}
              tilt={i === 0 ? "none" : i === 1 ? "l" : "r"}
              className={`flex flex-col items-center text-center p-3 sm:p-4 ${
                i === 0 ? "translate-y-[-8px] border-2 border-sun" : ""
              } ${isCurrentUser ? "ring-2 ring-primary" : ""}`}
            >
              <span className="text-3xl sm:text-4xl">{medals[i]}</span>
              <p className="mt-1 truncate w-full text-xs sm:text-sm font-extrabold text-ink">
                {r.nombre} {isCurrentUser && " (Vos)"}
              </p>
              <p className="truncate w-full text-[10px] text-muted-foreground">{r.escuela}</p>
              <p className="display mt-1 text-xl sm:text-2xl text-primary font-bold">{r[orden]}</p>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                {orden}
              </p>
            </PaperCard>
          );
        })}
      </div>

      {/* Tabla Posiciones 4+ */}
      <PaperCard className="p-0 overflow-hidden">
        <div className="bg-kraft/15 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-earth flex items-center justify-between">
          <span>Tabla General de Posiciones</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Puntos Verificados
          </span>
        </div>
        <ul className="divide-y-2 divide-dashed divide-kraft/30">
          {sorted.map((r, i) => {
            const isMe = r.id === user?.id;
            return (
              <li
                key={r.id}
                className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition ${
                  isMe ? "bg-primary/10 font-bold" : "hover:bg-kraft/10"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-extrabold text-xs shadow-xs ${
                    i < 3 ? "bg-sun text-ink" : "bg-cream text-earth border border-kraft/40"
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink">
                    {r.nombre} {isMe && <span className="text-xs text-primary">(Tu perfil)</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{r.escuela}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="display text-xl leading-none text-primary font-bold">
                    {r.puntos.toLocaleString("es")}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-earth">{r.canjes} canjes</p>
                </div>
              </li>
            );
          })}
        </ul>
      </PaperCard>
    </div>
  );
}
