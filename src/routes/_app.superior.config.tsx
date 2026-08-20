import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { ASOCIADO_CODE, CREATOR_CODE, SUPERIOR_CODE } from "@/lib/store";

export const Route = createFileRoute("/_app/superior/config")({
  component: SuperiorConfig,
});

function SuperiorConfig() {
  const [reveal, setReveal] = useState(false);
  const [flags, setFlags] = useState({
    escaner: true,
    canjes: true,
    mapa: true,
    registroAbierto: true,
  });

  const labels: Record<keyof typeof flags, string> = {
    escaner: "Escáner de materiales activo",
    canjes: "Canje de premios habilitado",
    mapa: "Mapa de puntos verdes visible",
    registroAbierto: "Registro de nuevas cuentas abierto",
  };

  return (
    <div className="space-y-5">
      <PaperCard variant="kraft">
        <PaperTape color="sun" className="mb-2">
          Configuración
        </PaperTape>
        <h1 className="display text-3xl">Ajustes globales</h1>
        <p className="mt-1 text-sm opacity-90">Activá o pausá funciones para toda la app.</p>
      </PaperCard>

      <PaperCard className="space-y-2">
        {(Object.keys(flags) as (keyof typeof flags)[]).map((k) => (
          <label
            key={k}
            className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-kraft/50 px-3 py-2"
          >
            <span className="text-sm font-bold text-ink">{labels[k]}</span>
            <input
              type="checkbox"
              checked={flags[k]}
              onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))}
              className="h-5 w-5 accent-[var(--color-primary,green)]"
            />
          </label>
        ))}
      </PaperCard>

      <PaperCard>
        <h2 className="display text-2xl text-ink">Códigos de acceso</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Necesarios para registrar cuentas con permisos especiales.
        </p>
        <button
          onClick={() => setReveal((r) => !r)}
          className="mt-3 rounded-full border-2 border-kraft bg-cream px-3 py-1.5 text-xs font-bold text-ink"
        >
          {reveal ? "Ocultar" : "Mostrar códigos"}
        </button>
        {reveal && (
          <ul className="mt-3 space-y-1 text-sm font-bold text-ink">
            <li>
              Creador: <code>{CREATOR_CODE}</code>
            </li>
            <li>
              Asociado: <code>{ASOCIADO_CODE}</code>
            </li>
            <li>
              Superior: <code>{SUPERIOR_CODE}</code>
            </li>
          </ul>
        )}
      </PaperCard>
    </div>
  );
}
