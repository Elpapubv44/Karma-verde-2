import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import { canjearPremioConTicket, useStore } from "@/lib/store";
import type { CanjeTicket, Premio } from "@/lib/types";
import { PremioImage } from "@/components/ui/premio-image";
import { triggerConfetti } from "@/components/ui/confetti";
import { QRCodeSVG } from "qrcode.react";
import {
  Gift,
  Ticket,
  QrCode,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Printer,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/alumno/premios")({
  component: PremiosPage,
});

export function PremiosPage() {
  const premios = useStore((s) => s.premios);
  const user = useStore((s) => s.user);
  const tickets = useStore((s) => s.tickets);

  const [tab, setTab] = useState<"catalogo" | "vouchers">("catalogo");
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");

  // Confirmation modal
  const [premioAConfirmar, setPremioAConfirmar] = useState<Premio | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<CanjeTicket | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const misTickets = tickets.filter((t) => t.usuarioId === user?.id);

  // Categories with count calculation
  const categoriasList = useMemo(() => {
    const cats = [
      { id: "todas", label: "Todos los premios", count: premios.length },
      {
        id: "utiles",
        label: "Útiles Escolares",
        count: premios.filter((p) => p.categoria === "utiles").length,
      },
      {
        id: "accesorios",
        label: "Accesorios Eco",
        count: premios.filter((p) => p.categoria === "accesorios").length,
      },
      {
        id: "kits",
        label: "Kits y Otros",
        count: premios.filter((p) => p.categoria !== "utiles" && p.categoria !== "accesorios")
          .length,
      },
    ];
    return cats;
  }, [premios]);

  // Filtered premios
  const premiosFiltrados = useMemo(() => {
    return premios.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        categoria === "todas"
          ? true
          : categoria === "kits"
            ? p.categoria !== "utiles" && p.categoria !== "accesorios"
            : p.categoria === categoria;
      return matchSearch && matchCat;
    });
  }, [premios, search, categoria]);

  async function ejecutarCanje(p: Premio) {
    setIsProcessing(true);
    try {
      const res = await canjearPremioConTicket(p.id);
      if (res.ok && res.ticket) {
        setPremioAConfirmar(null);
        setSelectedTicket(res.ticket);
        triggerConfetti();
        toast.success(`¡Felicitaciones! Voucher generado para ${p.nombre}`);
        setTab("vouchers");
      } else {
        toast.error(res.error ?? "Puntos o stock insuficiente");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-3xl text-ink">Recompensas y Vouchers</h1>
          <p className="text-sm text-muted-foreground">
            Canjeá tus puntos por productos ecológicos y obtené tu ticket oficial de retiro.
          </p>
        </div>
        <PaperTape color="sun" className="shrink-0">
          ⭐ {user?.puntos ?? 0} pts disponibles
        </PaperTape>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-dashed border-kraft/60 pb-2">
        <button
          onClick={() => setTab("catalogo")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition ${
            tab === "catalogo"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-cream text-earth hover:bg-kraft/20"
          }`}
        >
          <Gift className="h-4 w-4" />
          <span>Catálogo ({premios.length})</span>
        </button>
        <button
          onClick={() => setTab("vouchers")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition ${
            tab === "vouchers"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-cream text-earth hover:bg-kraft/20"
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>Mis Vouchers de Retiro ({misTickets.length})</span>
        </button>
      </div>

      {/* Tab: Catálogo */}
      {tab === "catalogo" && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar premios por nombre o descripción..."
                className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2 pl-9 text-sm text-ink outline-none focus:border-primary"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-ink"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {categoriasList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoria(cat.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                    categoria === cat.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-cream text-earth hover:bg-kraft/20 border border-kraft/50"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Premios */}
          {premiosFiltrados.length === 0 ? (
            <PaperCard className="p-8 text-center space-y-2">
              <Gift className="mx-auto h-10 w-10 text-muted-foreground opacity-40" />
              <p className="text-sm font-bold text-ink">No encontramos premios con ese filtro.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategoria("todas");
                }}
                className="text-xs text-primary font-extrabold underline"
              >
                Restablecer filtros
              </button>
            </PaperCard>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {premiosFiltrados.map((p, i) => {
                const puede = (user?.puntos ?? 0) >= p.puntos && p.stock > 0;
                return (
                  <PaperCard
                    key={p.id}
                    tilt={i % 2 ? "r" : "l"}
                    className="overflow-hidden p-0 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] w-full overflow-hidden bg-kraft/10">
                        <PremioImage
                          src={p.imagen}
                          alt={p.nombre}
                          categoria={p.categoria}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-extrabold text-ink leading-snug">
                            {p.nombre}
                          </h3>
                          <PaperTape color="leaf" className="shrink-0 text-xs">
                            {p.puntos} pts
                          </PaperTape>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {p.descripcion}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between pt-2 border-t border-kraft/30">
                        <span className="text-[11px] font-bold text-earth">
                          Stock:{" "}
                          <strong className={p.stock > 0 ? "text-ink" : "text-destructive"}>
                            {p.stock > 0 ? `${p.stock} un.` : "Agotado"}
                          </strong>
                        </span>
                        <PaperButton
                          variant={puede ? "leaf" : "cream"}
                          disabled={!puede}
                          onClick={() => setPremioAConfirmar(p)}
                        >
                          {p.stock === 0 ? "Agotado" : puede ? "Canjear Voucher" : "Faltan Puntos"}
                        </PaperButton>
                      </div>
                    </div>
                  </PaperCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Mis Vouchers */}
      {tab === "vouchers" && (
        <div className="space-y-4">
          {misTickets.length === 0 ? (
            <PaperCard className="p-8 text-center space-y-3">
              <Ticket className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-sm font-bold text-ink">Todavía no canjeaste ningún voucher.</p>
              <p className="text-xs text-muted-foreground">
                Sumá puntos escaneando plásticos y canjeá premios para retirar en tu escuela.
              </p>
              <PaperButton onClick={() => setTab("catalogo")}>Ver Catálogo</PaperButton>
            </PaperCard>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {misTickets.map((t) => {
                const esEntregado = t.estado === "entregado";
                return (
                  <PaperCard
                    key={t.id}
                    variant={esEntregado ? "default" : "kraft"}
                    className="space-y-3 p-4 border-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-card px-3 py-1 font-mono text-xs font-black text-ink shadow-xs">
                        {t.codigoVoucher}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          esEntregado ? "bg-primary/20 text-primary" : "bg-sun/40 text-ink"
                        }`}
                      >
                        {esEntregado ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Retirado
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" /> Pendiente de Retiro
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-ink text-base">{t.premioNombre}</h4>
                      <p className="text-xs text-earth">
                        Canjeado el {t.fechaCanje} · Vence: {t.fechaVencimiento}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-card p-3">
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-ink">Punto de Retiro:</p>
                        <p className="text-muted-foreground">{t.escuela}</p>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="inline-flex items-center gap-1 rounded-xl border border-kraft bg-cream px-3 py-1.5 text-xs font-bold text-ink hover:bg-kraft/20 transition active:scale-95"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        Ver QR
                      </button>
                    </div>
                  </PaperCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmación de Canje */}
      {premioAConfirmar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <PaperCard className="relative w-full max-w-md p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setPremioAConfirmar(null)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-kraft bg-cream text-ink hover:bg-kraft/20"
              aria-label="Cerrar confirmación"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <PaperTape color="sun">Confirmación de Canje</PaperTape>
            </div>

            <h3 className="display text-2xl text-ink">¿Canjear {premioAConfirmar.nombre}?</h3>

            <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <PremioImage
                  src={premioAConfirmar.imagen}
                  alt={premioAConfirmar.nombre}
                  categoria={premioAConfirmar.categoria}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-ink text-sm">{premioAConfirmar.nombre}</p>
                <p className="text-earth">
                  Costo: <strong className="text-primary">{premioAConfirmar.puntos} puntos</strong>
                </p>
                <p className="text-muted-foreground">
                  Te quedarán: {(user?.puntos ?? 0) - premioAConfirmar.puntos} puntos
                </p>
              </div>
            </div>

            <p className="text-xs text-earth leading-relaxed">
              Al confirmar se generará un código voucher oficial con validez de 30 días para retirar
              en tu escuela.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <PaperButton
                variant="cream"
                disabled={isProcessing}
                onClick={() => setPremioAConfirmar(null)}
              >
                Cancelar
              </PaperButton>
              <PaperButton
                variant="leaf"
                disabled={isProcessing}
                onClick={() => ejecutarCanje(premioAConfirmar)}
              >
                {isProcessing ? "Generando..." : "Confirmar y Canjear"}
              </PaperButton>
            </div>
          </PaperCard>
        </div>
      )}

      {/* Modal QR Voucher Oficial y Descargable */}
      {selectedTicket && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <PaperCard className="relative w-full max-w-sm space-y-4 p-6 text-center shadow-2xl">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-kraft bg-cream text-ink hover:bg-kraft/20"
              aria-label="Cerrar voucher"
            >
              <X className="h-4 w-4" />
            </button>

            <PaperTape color="sun">Voucher Oficial Karmaverde</PaperTape>
            <h3 className="display text-2xl font-bold text-ink">{selectedTicket.premioNombre}</h3>

            {/* QR Code SVG Render */}
            <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-primary bg-white p-4 shadow-inner">
              <QRCodeSVG
                value={`KARMAVERDE-VOUCHER:${selectedTicket.codigoVoucher}:${selectedTicket.id}`}
                size={160}
                level="H"
              />
              <span className="mt-2 text-[10px] font-bold text-earth uppercase tracking-wider">
                Presentar al docente
              </span>
            </div>

            <div className="rounded-xl bg-kraft/15 p-3 text-xs space-y-1">
              <p className="font-mono text-base font-black text-primary">
                {selectedTicket.codigoVoucher}
              </p>
              <p className="text-earth">
                Punto de retiro: <strong>{selectedTicket.escuela}</strong>.
              </p>
              <p className="text-[10px] text-muted-foreground">
                Válido hasta: {selectedTicket.fechaVencimiento}
              </p>
            </div>

            <div className="flex gap-2">
              <PaperButton variant="cream" className="flex-1 gap-1" onClick={handlePrintTicket}>
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir</span>
              </PaperButton>
              <PaperButton
                variant="leaf"
                className="flex-1"
                onClick={() => setSelectedTicket(null)}
              >
                Listo
              </PaperButton>
            </div>
          </PaperCard>
        </div>
      )}
    </div>
  );
}
