import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { selectEscuelas, selectRanking, selectUsuarios, useStore } from "@/lib/store";
import {
  Users,
  Settings,
  Puzzle,
  Sparkles,
  Award,
  GraduationCap,
  ClipboardList,
} from "lucide-react";

export const Route = createFileRoute("/_app/superior/")({
  component: SuperiorHome,
});

function SuperiorHome() {
  const user = useStore((s) => s.user);
  const usuarios = useStore(selectUsuarios);
  const escuelas = useStore(selectEscuelas);
  const ranking = useStore(selectRanking);
  const premios = useStore((s) => s.premios);
  const guias = useStore((s) => s.guias);
  const circuito = useStore((s) => s.circuito);
  const tareas = useStore((s) => s.tareas);

  const totalPts = ranking.reduce((a, b) => a + b.puntos, 0);
  const totalCanjes = ranking.reduce((a, b) => a + b.canjes, 0);

  const modulos = [
    { to: "/superior/usuarios", label: "Usuarios y permisos", n: usuarios.length, icon: Users },
    { to: "/superior/config", label: "Configuración global", n: 4, icon: Settings },
    {
      to: "/superior/modulos",
      label: "Módulos de admin",
      n: premios.length + guias.length + circuito.length,
      icon: Puzzle,
    },
  ];

  return (
    <div className="space-y-6">
      <PaperCard variant="kraft" className="p-6">
        <PaperTape color="sun" className="mb-2">
          Panel superior · acceso total
        </PaperTape>
        <h1 className="display text-4xl">Hola, {user?.nombre}</h1>
        <p className="mt-1 text-sm opacity-90">
          Control global de Karmaverde: usuarios, módulos, métricas y configuración.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Usuarios" value={usuarios.length} icon={Users} />
          <Metric label="Escuelas" value={escuelas.length} icon={GraduationCap} />
          <Metric label="Puntos totales" value={totalPts} icon={Sparkles} />
          <Metric label="Canjes" value={totalCanjes} icon={Award} />
        </div>
      </PaperCard>

      <div className="grid gap-3 sm:grid-cols-3">
        {modulos.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.to}
              to={m.to}
              className="paper-card hover-float flex flex-col items-center gap-2 p-5 text-center"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary shadow-xs">
                <Icon className="h-6 w-6 stroke-[2.2]" />
              </div>
              <span className="display text-2xl leading-none text-primary">{m.n}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink">
                {m.label}
              </span>
            </Link>
          );
        })}
      </div>

      <PaperCard className="p-6">
        <h2 className="display text-2xl text-ink">Métricas por escuela</h2>
        {escuelas.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Todavía no hay escuelas con alumnos registrados.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {escuelas.map((e) => (
              <li
                key={e.escuela}
                className="flex items-center justify-between rounded-2xl border-2 border-dashed border-kraft/50 bg-cream/50 px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 text-earth" />
                  <span className="text-sm font-bold text-ink">{e.escuela}</span>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-earth">
                  {e.alumnos} alumnos · {e.puntos} pts · {e.canjes} canjes
                </span>
              </li>
            ))}
          </ul>
        )}
      </PaperCard>

      <PaperCard className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-kraft/30 text-earth">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h2 className="display text-xl text-ink">Operación en curso</h2>
            <p className="text-sm text-muted-foreground">
              {tareas.length} tareas de recolección cargadas por los asociados.
            </p>
          </div>
        </div>
      </PaperCard>
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
      <div className="flex items-center justify-center gap-1 text-primary mb-1">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
          {label}
        </span>
      </div>
      <p className="display text-2xl leading-none">{value.toLocaleString("es")}</p>
    </div>
  );
}
