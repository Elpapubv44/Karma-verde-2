import { createFileRoute, Link } from "@tanstack/react-router";
import { selectRanking, selectEcoImpacto, useStore } from "@/lib/store";
import { PaperCard, PaperTape, PaperButton } from "@/components/paper/Paper";
import { AnimatedCounter } from "@/components/ui/animated-counter";
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
  Megaphone,
  Calendar,
  Flame,
  CheckCircle2,
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
  const anuncios = useStore((s) => s.anuncios || []);

  const miEscuelaMeta = metas.find((m) => m.escuela === (user?.escuela ?? "")) ?? metas[0];
  const misTicketsPendientes = tickets.filter(
    (t) => t.usuarioId === user?.id && t.estado === "pendiente_retiro",
  );

  const posicion =
    [...ranking].sort((a, b) => b.puntos - a.puntos).findIndex((r) => r.id === user?.id) + 1;

  const pctMeta = miEscuelaMeta
    ? Math.min(100, Math.round((miEscuelaMeta.acumuladoKg / miEscuelaMeta.metaKg) * 100))
    : 0;

  // Level calculation
  const puntos = user?.puntos ?? 0;
  const nivelActual =
    puntos >= 1000
      ? { nombre: "Titán Ambiental", sigNivel: "Nivel Máximo", meta: 1000, icono: "🏆" }
      : puntos >= 500
        ? { nombre: "Eco-Máster", sigNivel: "Titán Ambiental", meta: 1000, icono: "⭐" }
        : puntos >= 200
          ? { nombre: "Guardián Forestal", sigNivel: "Eco-Máster", meta: 500, icono: "🌿" }
          : { nombre: "Brote Verde", sigNivel: "Guardián Forestal", meta: 200, icono: "🌱" };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <PaperCard variant="leaf" tilt="l" className="text-primary-foreground p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <PaperTape color="sun">Economía Circular Escolar</PaperTape>
          <div className="flex items-center gap-2">
            {user?.curso && (
              <span className="rounded-full bg-cream/20 px-3 py-1 text-xs font-bold">
                {user.curso}
              </span>
            )}
            <span className="rounded-full bg-sun/30 border border-sun text-ink px-2.5 py-0.5 text-xs font-black flex items-center gap-1">
              <span>{nivelActual.icono}</span>
              <span>{nivelActual.nombre}</span>
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="display text-4xl">¡Hola, {user?.nombre}!</h1>
            <p className="mt-1 text-sm opacity-90">
              {user?.escuela} · Sumá plástico limpio y ganá.
            </p>
          </div>
          <div className="hidden sm:grid h-16 w-16 place-items-center rounded-2xl bg-cream/20 text-3xl shadow-xs">
            {user?.avatar ?? "🌱"}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl bg-cream/95 p-3 text-center text-ink shadow-[var(--shadow-cutout)]">
            <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                Puntos
              </span>
            </div>
            <p className="display text-2xl leading-none">
              <AnimatedCounter value={user?.puntos ?? 0} />
            </p>
          </div>

          <Stat label="Canjes" value={user?.canjes ?? 0} icon={Award} />
          <Stat label="Puesto" value={posicion ? `#${posicion}` : "—"} icon={TrendingUp} />
        </div>
      </PaperCard>

      {/* Tablón de Anuncios Oficiales */}
      {anuncios.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl text-ink flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Novedades y Campañas
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              {anuncios.length} anuncio(s)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {anuncios.slice(0, 2).map((a) => (
              <PaperCard
                key={a.id}
                className={`p-4 ${a.importante ? "border-2 border-sun/80 bg-sun/10" : "bg-cream"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      a.importante ? "bg-sun text-ink" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {a.importante ? "★ Importante" : "Aviso"}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                    <Calendar className="h-3 w-3" />
                    {a.fecha}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-ink">{a.titulo}</h3>
                <p className="text-xs text-earth mt-1 leading-relaxed">{a.mensaje}</p>
                <p className="text-[10px] font-bold text-muted-foreground mt-2 text-right">
                  Por: {a.autor}
                </p>
              </PaperCard>
            ))}
          </div>
        </div>
      )}

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
            <p className="display text-2xl text-primary font-bold">
              <AnimatedCounter value={eco.litrosAguaAhorrados} suffix=" L" />
            </p>
            <p className="text-[10px] text-muted-foreground">en producción</p>
          </PaperCard>

          <PaperCard className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
              <Wind className="h-4 w-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                CO₂ Evitado
              </span>
            </div>
            <p className="display text-2xl text-primary font-bold">
              <AnimatedCounter value={eco.kgCo2Evitado} suffix=" kg" />
            </p>
            <p className="text-[10px] text-muted-foreground">huella de carbono</p>
          </PaperCard>

          <PaperCard className="p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-earth">
                Energía Ahorrada
              </span>
            </div>
            <p className="display text-2xl text-primary font-bold">
              <AnimatedCounter value={eco.kwhEnergiaAhorrada} suffix=" kWh" />
            </p>
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
