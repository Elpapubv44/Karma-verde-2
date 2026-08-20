import { createFileRoute, Link } from "@tanstack/react-router";
import { selectRanking, selectEcoImpacto, useStore } from "@/lib/store";
import { PaperCard, PaperTape, PaperButton } from "@/components/paper/Paper";
import {
  QrCode,
  MapPin,
  Gift,
  Trophy,
  Truck,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Droplets,
  Wind,
  Zap,
  Target,
  Ticket,
} from "lucide-react";

export const Route = createFileRoute("/_app/alumno/")({
  component: AlumnoHome,
});

const quick = [
  { to: "/alumno/escaner", label: "Escanear QR", icon: QrCode, color: "leaf" as const },
  { to: "/alumno/premios", label: "Premios y Vouchers", icon: Gift, color: "kraft" as const },
  { to: "/alumno/aprende", label: "Trivia & Guías", icon: BookOpen, color: "leaf" as const },
  { to: "/alumno/mapa", label: "Puntos Verdes", icon: MapPin, color: "kraft" as const },
  { to: "/alumno/ranking", label: "Ranking Escolar", icon: Trophy, color: "leaf" as const },
  { to: "/alumno/viaje", label: "Circuito y Viaje", icon: Truck, color: "kraft" as const },
];

function AlumnoHome() {
  const user = useStore((s) => s.user);
  const ranking = useStore(selectRanking);
  const eco = useStore(selectEcoImpacto);
  const metas = useStore((s) => s.metasComunitarias);
  const tickets = useStore((s) => s.tickets);

  const miEscuelaMeta = metas.find((m) => m.escuela === (user?.escuela ?? "")) ?? metas[0];
  const misTicketsPendientes = tickets.filter(
    (t) => t.usuarioId === user?.id && t.estado === "pendiente_retiro",
  );

  const posicion =
    [...ranking].sort((a, b) => b.puntos - a.puntos).findIndex((r) => r.id === user?.id) + 1;

  const pctMeta = miEscuelaMeta
    ? Math.min(100, Math.round((miEscuelaMeta.acumuladoKg / miEscuelaMeta.metaKg) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <PaperCard variant="leaf" tilt="l" className="text-primary-foreground p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <PaperTape color="sun">Economía Circular Escolar</PaperTape>
          {user?.curso && (
            <span className="rounded-full bg-cream/20 px-3 py-1 text-xs font-bold">
              {user.curso}
            </span>
          )}
        </div>
        <h1 className="display text-4xl">¡Hola, {user?.nombre}!</h1>
        <p className="mt-1 text-sm opacity-90">{user?.escuela} · Sumá plástico limpio y ganá.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="Puntos" value={user?.puntos ?? 0} icon={Sparkles} />
          <Stat label="Canjes" value={user?.canjes ?? 0} icon={Award} />
          <Stat label="Puesto" value={posicion ? `#${posicion}` : "—"} icon={TrendingUp} />
        </div>
      </PaperCard>

      {/* Active Vouchers Alert */}
      {misTicketsPendientes.length > 0 && (
        <PaperCard variant="kraft" className="border-2 border-sun/60 bg-sun/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sun text-ink shadow-xs">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-earth">
                  ¡Tenés {misTicketsPendientes.length} voucher(s) listos para retirar!
                </p>
                <p className="text-sm font-bold text-ink">
                  {misTicketsPendientes[0].premioNombre} (Cód:{" "}
                  {misTicketsPendientes[0].codigoVoucher})
                </p>
              </div>
            </div>
            <Link
              to="/alumno/premios"
              className="rounded-full border-2 border-earth bg-cream px-3.5 py-1.5 text-xs font-extrabold text-ink transition hover:bg-kraft/20"
            >
              Ver QR de Retiro
            </Link>
          </div>
        </PaperCard>
      )}

      {/* Meta Comunitaria Escolar */}
      {miEscuelaMeta && (
        <PaperCard className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <h2 className="display text-2xl text-ink">Meta Grupal de la Escuela</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
              {pctMeta}% Completado
            </span>
          </div>
          <p className="text-xs font-bold text-earth">
            Objetivo: <strong className="text-ink">{miEscuelaMeta.titulo}</strong>
          </p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-kraft/30">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pctMeta}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-extrabold text-muted-foreground">
            <span>{miEscuelaMeta.acumuladoKg} kg recolectados</span>
            <span>Meta: {miEscuelaMeta.metaKg} kg</span>
          </div>
          <p className="rounded-xl bg-card p-2.5 text-xs text-earth">
            🎁 <strong>Recompensa para todos:</strong> {miEscuelaMeta.recompensa}.
          </p>
        </PaperCard>
      )}

      {/* Impacto Ambiental Científico */}
      <div>
        <h2 className="display mb-3 text-2xl text-ink">Impacto Ecológico Certificado</h2>
        <div className="grid grid-cols-3 gap-3">
          <PaperCard className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-sky-600 mb-1">
              <Droplets className="h-4 w-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                Agua Ahorrada
              </span>
            </div>
            <p className="display text-2xl text-primary font-bold">{eco.litrosAguaAhorrados} L</p>
            <p className="text-[10px] text-muted-foreground">en producción</p>
          </PaperCard>

          <PaperCard className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
              <Wind className="h-4 w-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                CO₂ Evitado
              </span>
            </div>
            <p className="display text-2xl text-primary font-bold">{eco.kgCo2Evitado} kg</p>
            <p className="text-[10px] text-muted-foreground">huella de carbono</p>
          </PaperCard>

          <PaperCard className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                Energía Ahorrada
              </span>
            </div>
            <p className="display text-2xl text-primary font-bold">{eco.kwhEnergiaAhorrada} kWh</p>
            <p className="text-[10px] text-muted-foreground">red eléctrica</p>
          </PaperCard>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="display mb-3 text-2xl text-ink">Módulos del Sistema</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {quick.map((q, i) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to}
                to={q.to}
                className={`paper-card hover-float flex flex-col items-center justify-center gap-2 p-5 text-center ${
                  i % 2 ? "tilt-r" : "tilt-l"
                } ${q.color === "leaf" ? "paper-card-leaf" : "paper-card-kraft"}`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cream/20 shadow-xs">
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider">{q.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
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
      <p className="display text-2xl leading-none">{value}</p>
    </div>
  );
}
