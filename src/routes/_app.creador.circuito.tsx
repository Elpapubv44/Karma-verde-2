import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/forms/CrudManager";
import { PaperTape } from "@/components/paper/Paper";
import { remove, upsert, useStore } from "@/lib/store";
import type { EtapaCircuito } from "@/lib/types";

export const Route = createFileRoute("/_app/creador/circuito")({
  component: CircuitoAdmin,
});

function CircuitoAdmin() {
  const circuito = useStore((s) => [...s.circuito].sort((a, b) => a.orden - b.orden));
  return (
    <CrudManager<EtapaCircuito>
      title="Circuito de reciclaje"
      subtitle="Etapas que forman El Viaje del Reciclaje."
      items={circuito}
      fields={[
        { name: "orden", label: "Orden", type: "number" },
        { name: "titulo", label: "Título" },
        { name: "descripcion", label: "Descripción", type: "textarea" },
        { name: "estado", label: "Estado (activa|en_proceso|pendiente)" },
        { name: "imagen", label: "URL imagen", type: "url" },
        { name: "video", label: "URL video (opcional)", type: "url" },
      ]}
      empty={() => ({
        orden: 1,
        titulo: "",
        descripcion: "",
        estado: "activa" as const,
      })}
      onSave={(e) => upsert("circuito", e)}
      onDelete={(id) => remove("circuito", id)}
      render={(e) => (
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
              {e.orden}
            </span>
            <p className="truncate text-sm font-extrabold text-ink">{e.titulo}</p>
          </div>
          <PaperTape color="kraft" className="text-[10px]">
            {e.estado.replace("_", " ")}
          </PaperTape>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{e.descripcion}</p>
        </div>
      )}
    />
  );
}
