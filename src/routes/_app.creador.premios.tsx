import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/forms/CrudManager";
import { PaperTape } from "@/components/paper/Paper";
import { remove, upsert, useStore } from "@/lib/store";
import type { Premio } from "@/lib/types";

export const Route = createFileRoute("/_app/creador/premios")({
  component: PremiosAdmin,
});

function PremiosAdmin() {
  const premios = useStore((s) => s.premios);
  return (
    <CrudManager<Premio>
      title="Premios"
      subtitle="Editá el catálogo que ven los alumnos."
      items={premios}
      fields={[
        { name: "nombre", label: "Nombre", placeholder: "Termo eco" },
        { name: "descripcion", label: "Descripción", type: "textarea" },
        { name: "puntos", label: "Puntos", type: "number" },
        { name: "stock", label: "Stock", type: "number" },
        { name: "imagen", label: "URL imagen", type: "url" },
      ]}
      empty={() => ({ nombre: "", descripcion: "", puntos: 100, stock: 10, imagen: "" })}
      onSave={(p) => upsert("premios", p)}
      onDelete={(id) => remove("premios", id)}
      render={(p) => (
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <img
            src={p.imagen || "https://placehold.co/120x90/e0d7c4/3d3428?text=premio"}
            alt={p.nombre}
            className="h-20 w-24 rounded-xl border-2 border-kraft/40 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink">{p.nombre}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{p.descripcion}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <PaperTape color="leaf" className="text-[10px]">
                {p.puntos} pts
              </PaperTape>
              <PaperTape color="kraft" className="text-[10px]">
                stock {p.stock}
              </PaperTape>
            </div>
          </div>
        </div>
      )}
    />
  );
}
