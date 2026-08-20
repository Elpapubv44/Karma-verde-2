import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import {
  removeTarea,
  selectEscuelas,
  upsertTarea,
  useStore,
  validarEntregaReciclaje,
  marcarTicketEntregado,
} from "@/lib/store";
import type { Tarea } from "@/lib/types";
import {
  Scale,
  CheckCircle2,
  Clock,
  Ticket,
  ClipboardList,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_app/asociado/")({
  component: AsociadoHome,
});

const vacia = (escuela: string): Tarea => ({
  id: crypto.randomUUID(),
  titulo: "",
  escuela,
  material: "Plástico",
  meta: 100,
  progreso: 0,
  estado: "pendiente",
  responsable: "",
});

function AsociadoHome() {
  const user = useStore((s) => s.user);
  const tareas = useStore((s) => s.tareas);
  const escuelas = useStore(selectEscuelas);
  const entregas = useStore((s) => s.entregas);
  const tickets = useStore((s) => s.tickets);

  const [draft, setDraft] = useState<Tarea | null>(null);
  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [voucherFeedback, setVoucherFeedback] = useState<string | null>(null);

  const propias = tareas;
  const completadas = propias.filter((t) => t.estado === "completada").length;
  const metaTotal = propias.reduce((a, t) => a + t.meta, 0);
  const progresoTotal = propias.reduce((a, t) => a + t.progreso, 0);

  const entregasPendientes = entregas.filter((e) => e.estado === "pendiente_pesaje");

  const handleValidarVoucher = () => {
    const code = voucherCodeInput.trim().toUpperCase();
    const found = tickets.find(
      (t) => t.codigoVoucher.toUpperCase() === code && t.estado === "pendiente_retiro",
    );

    if (found) {
      marcarTicketEntregado(found.id, user?.nombre ?? "Cooperativa Verde Sur");
      setVoucherFeedback(
        `✅ ¡Premio "${found.premioNombre}" entregado con éxito a ${found.usuarioNombre}!`,
      );
      setVoucherCodeInput("");
    } else {
      setVoucherFeedback("❌ Código no encontrado o ya retirado previamente.");
    }
    setTimeout(() => setVoucherFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal */}
      <PaperCard variant="kraft">
        <PaperTape color="sun" className="mb-2">
          Panel de Logística y Trazabilidad Escolar
        </PaperTape>
        <h1 className="display text-4xl">Hola, {user?.nombre}</h1>
        <p className="mt-1 text-sm opacity-90">
          Coordiná el pesaje en balanza, retiro de fardos y validación de vouchers de premios.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Metric label="Tareas Activas" value={propias.length} />
          <Metric label="Fardos Retirados" value={completadas} />
          <Metric
            label="Avance Logístico"
            value={metaTotal ? Math.round((progresoTotal / metaTotal) * 100) : 0}
            suffix="%"
          />
        </div>
      </PaperCard>

      {/* Validador de Vouchers de Premios de Alumnos */}
      <PaperCard className="space-y-3 p-5 border-2 border-primary/50">
        <div className="flex items-center gap-2 text-primary">
          <Ticket className="h-5 w-5" />
          <h2 className="display text-2xl text-ink">Recepción y Entrega de Premios Físicos</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Ingresá el código alfanumérico del voucher que te presente el alumno al retirar su premio.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: KV-TKT-9842A"
            value={voucherCodeInput}
            onChange={(e) => setVoucherCodeInput(e.target.value)}
            className="flex-1 rounded-2xl border-2 border-kraft/60 bg-cream px-4 py-2 text-sm font-mono font-bold text-ink uppercase"
          />
          <PaperButton variant="leaf" onClick={handleValidarVoucher}>
            Validar y Entregar
          </PaperButton>
        </div>

        {voucherFeedback && (
          <p className="rounded-xl bg-card p-2 text-xs font-bold text-ink border border-kraft/40">
            {voucherFeedback}
          </p>
        )}
      </PaperCard>

      {/* Bandeja de Pesajes Pendientes de Validación */}
      <PaperCard className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-earth">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="display text-2xl text-ink">
              Solicitudes de Pesaje en Balanza ({entregasPendientes.length})
            </h2>
          </div>
        </div>

        {entregasPendientes.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No hay pesajes pendientes en este momento. Todas las entregas están certificadas.
          </p>
        ) : (
          <div className="space-y-2">
            {entregasPendientes.map((ent) => (
              <div
                key={ent.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-dashed border-kraft/60 bg-card p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-ink">
                    {ent.alumnoNombre} · {ent.escuela}
                  </p>
                  <p className="text-muted-foreground">
                    Material: <strong>{ent.tipoPlastico}</strong> · Peso declarado:{" "}
                    <strong>{ent.pesoKg} kg</strong> (+{ent.puntosOtorgados} pts)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      validarEntregaReciclaje(ent.id, user?.nombre ?? "Cooperativa Verde Sur")
                    }
                    className="inline-flex items-center gap-1 rounded-full border-2 border-primary bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:brightness-105 active:scale-95"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Aprobar Pesaje y Acreditar Puntos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PaperCard>

      {/* Tareas de recolección y remitos */}
      <PaperCard className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-2xl text-ink">Hoja de Ruta de Recolección</h2>
          <PaperButton onClick={() => setDraft(vacia(user?.escuela ?? ""))}>
            + Nueva Tarea
          </PaperButton>
        </div>

        {draft && (
          <div className="space-y-2 rounded-2xl border-2 border-dashed border-kraft/60 p-3">
            <Input
              label="Título"
              value={draft.titulo}
              onChange={(v) => setDraft({ ...draft, titulo: v })}
            />
            <Input
              label="Escuela"
              value={draft.escuela}
              onChange={(v) => setDraft({ ...draft, escuela: v })}
            />
            <Input
              label="Material"
              value={draft.material}
              onChange={(v) => setDraft({ ...draft, material: v })}
            />
            <Input
              label="Responsable"
              value={draft.responsable ?? ""}
              onChange={(v) => setDraft({ ...draft, responsable: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Meta (kg)"
                value={String(draft.meta)}
                onChange={(v) => setDraft({ ...draft, meta: Number(v) || 0 })}
                type="number"
              />
              <Input
                label="Progreso (kg)"
                value={String(draft.progreso)}
                onChange={(v) => setDraft({ ...draft, progreso: Number(v) || 0 })}
                type="number"
              />
            </div>
            <div className="flex gap-2">
              <PaperButton
                onClick={() => {
                  if (!draft.titulo.trim() || !draft.escuela.trim()) return;
                  upsertTarea(draft);
                  setDraft(null);
                }}
              >
                Guardar
              </PaperButton>
              <PaperButton variant="ghost" onClick={() => setDraft(null)}>
                Cancelar
              </PaperButton>
            </div>
          </div>
        )}

        {propias.length === 0 && !draft ? (
          <p className="text-sm text-muted-foreground">Todavía no cargaste tareas.</p>
        ) : (
          <ul className="space-y-2">
            {propias.map((t) => (
              <li key={t.id} className="rounded-2xl border-2 border-dashed border-kraft/50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-extrabold text-ink">{t.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.escuela} · {t.material} · {t.responsable || "sin responsable"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={t.estado}
                      onChange={(e) =>
                        upsertTarea({ ...t, estado: e.target.value as Tarea["estado"] })
                      }
                      className="rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-1.5 text-xs font-bold text-ink"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_curso">En curso</option>
                      <option value="completada">Completada</option>
                    </select>
                    <button
                      onClick={() => setDraft(t)}
                      className="rounded-full border-2 border-kraft bg-cream px-3 py-1.5 text-xs font-bold text-ink"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => removeTarea(t.id)}
                      className="rounded-full border-2 border-earth/50 bg-cream px-3 py-1.5 text-xs font-bold text-earth"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-kraft/25">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${t.meta ? Math.min(100, (t.progreso / t.meta) * 100) : 0}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-earth">
                  {t.progreso} / {t.meta} kg
                </p>
              </li>
            ))}
          </ul>
        )}
      </PaperCard>
    </div>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-2xl bg-cream/90 px-3 py-2 text-ink">
      <p className="display text-3xl leading-none text-primary">
        {value}
        {suffix}
      </p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-earth">{label}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-4 py-2 text-sm text-ink outline-none focus:border-primary"
      />
    </label>
  );
}
