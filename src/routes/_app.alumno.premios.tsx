import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import { canjearPremioConTicket, useStore } from "@/lib/store";
import type { CanjeTicket } from "@/lib/types";
import { Gift, Ticket, QrCode, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/alumno/premios")({
  component: PremiosPage,
});

function PremiosPage() {
  const premios = useStore((s) => s.premios);
  const user = useStore((s) => s.user);
  const tickets = useStore((s) => s.tickets);
  const [tab, setTab] = useState<"catalogo" | "vouchers">("catalogo");
  const [selectedTicket, setSelectedTicket] = useState<CanjeTicket | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const misTickets = tickets.filter((t) => t.usuarioId === user?.id);

  async function tryCanjear(id: string) {
    const res = await canjearPremioConTicket(id);
    if (res.ok && res.ticket) {
      setSelectedTicket(res.ticket);
      setToast(`¡Voucher generado! Cód: ${res.ticket.codigoVoucher}`);
      setTab("vouchers");
    } else {
      setToast(res.error ?? "Puntos o stock insuficiente");
    }
    setTimeout(() => setToast(null), 3000);
  }

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {premios.map((p, i) => {
            const puede = (user?.puntos ?? 0) >= p.puntos && p.stock > 0;
            return (
              <PaperCard key={p.id} tilt={i % 2 ? "r" : "l"} className="overflow-hidden p-0">
                <div className="aspect-[4/3] w-full overflow-hidden bg-kraft/10">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-extrabold text-ink leading-snug">{p.nombre}</h3>
                    <PaperTape color="leaf" className="shrink-0 text-xs">
                      {p.puntos} pts
                    </PaperTape>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{p.descripcion}</p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-kraft/30">
                    <span className="text-[11px] font-bold text-earth">
                      Stock: <strong className="text-ink">{p.stock} un.</strong>
                    </span>
                    <PaperButton
                      variant={puede ? "leaf" : "cream"}
                      disabled={!puede}
                      onClick={() => tryCanjear(p.id)}
                    >
                      {puede ? "Canjear Voucher" : "Faltan Puntos"}
                    </PaperButton>
                  </div>
                </div>
              </PaperCard>
            );
          })}
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
                        className="inline-flex items-center gap-1 rounded-xl border border-kraft bg-cream px-3 py-1.5 text-xs font-bold text-ink hover:bg-kraft/20"
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

      {/* Modal QR Voucher */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs">
          <PaperCard className="relative w-full max-w-sm space-y-4 p-6 text-center shadow-2xl">
            <PaperTape color="sun">Voucher Oficial Karmaverde</PaperTape>
            <h3 className="display text-2xl font-bold text-ink">{selectedTicket.premioNombre}</h3>

            {/* QR Mock simulation */}
            <div className="mx-auto grid h-44 w-44 place-items-center rounded-2xl border-4 border-dashed border-primary bg-white p-3 shadow-inner">
              <QrCode className="h-36 w-36 text-ink" />
            </div>

            <div className="rounded-xl bg-kraft/15 p-3 text-xs space-y-1">
              <p className="font-mono text-base font-black text-primary">
                {selectedTicket.codigoVoucher}
              </p>
              <p className="text-earth">
                Presentá este código o QR al referente docente o cooperativa en{" "}
                <strong>{selectedTicket.escuela}</strong>.
              </p>
            </div>

            <PaperButton variant="leaf" className="w-full" onClick={() => setSelectedTicket(null)}>
              Cerrar
            </PaperButton>
          </PaperCard>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit animate-stamp rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-lift)]">
          {toast}
        </div>
      )}
    </div>
  );
}
