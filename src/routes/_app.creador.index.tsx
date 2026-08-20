import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { selectRanking, useStore } from "@/lib/store";
import { Gift, BookOpen, Truck, Trophy, Sparkles, Award } from "lucide-react";

export const Route = createFileRoute("/_app/creador/")({
  component: CreadorHome,
});

function CreadorHome() {
  const user = useStore((s) => s.user);
  const premios = useStore((s) => s.premios);
  const guias = useStore((s) => s.guias);
  const circuito = useStore((s) => s.circuito);
  const ranking = useStore(selectRanking);
  const totalPts = ranking.reduce((a, b) => a + b.puntos, 0);
  const totalCanjes = ranking.reduce((a, b) => a + b.canjes, 0);

  const cards = [
    { to: "/creador/premios", label: "Premios", n: premios.length, icon: Gift },
    { to: "/creador/educacion", label: "Guías", n: guias.length, icon: BookOpen },
    { to: "/creador/circuito", label: "Etapas", n: circuito.length, icon: Truck },
    { to: "/creador/ranking", label: "Ranking", n: ranking.length, icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      <PaperCard variant="kraft" tilt="r" className="p-6">
        <PaperTape color="sun" className="mb-2">
          Panel de creador
        </PaperTape>
        <h1 className="display text-4xl">Hola, {user?.nombre}</h1>
        <p className="mt-1 text-sm opacity-90">
          Gestioná premios, contenido educativo y el circuito de reciclaje.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Metric label="Puntos totales" value={totalPts} icon={Sparkles} />
          <Metric label="Canjes totales" value={totalCanjes} icon={Award} />
        </div>
      </PaperCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className={`paper-card hover-float flex flex-col items-center gap-2 p-5 text-center ${
                i % 2 ? "tilt-r" : "tilt-l"
              }`}
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary shadow-xs">
                <Icon className="h-6 w-6 stroke-[2.2]" />
              </div>
              <span className="display text-2xl leading-none text-primary">{c.n}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink">
                {c.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-cream/95 p-3 text-center text-ink shadow-[var(--shadow-cutout)]">
      <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
          {label}
        </span>
      </div>
      <p className="display text-2xl leading-none">{value.toLocaleString("es")}</p>
    </div>
  );
}
