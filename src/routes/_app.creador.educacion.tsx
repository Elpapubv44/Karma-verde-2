import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/forms/CrudManager";
import { PaperTape } from "@/components/paper/Paper";
import { remove, upsert, useStore } from "@/lib/store";
import type { Guia } from "@/lib/types";

export const Route = createFileRoute("/_app/creador/educacion")({
  component: EducacionAdmin,
});

function EducacionAdmin() {
  const guias = useStore((s) => s.guias);
  return (
    <CrudManager<Guia>
      title="Aprende a reciclar"
      subtitle="Guías y tips para los alumnos."
      items={guias}
      fields={[
        { name: "titulo", label: "Título" },
        { name: "categoria", label: "Categoría", placeholder: "Plásticos, Papel, Orgánicos…" },
        { name: "icono", label: "Emoji ícono", placeholder: "♻️" },
        { name: "contenido", label: "Contenido", type: "textarea" },
      ]}
      empty={() => ({ titulo: "", categoria: "", contenido: "", icono: "♻️" })}
      onSave={(g) => upsert("guias", g)}
      onDelete={(id) => remove("guias", id)}
      render={(g) => (
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground shadow-[var(--shadow-cutout)]">
            {g.icono}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink">{g.titulo}</p>
            <PaperTape color="kraft" className="mt-1 text-[10px]">
              {g.categoria}
            </PaperTape>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{g.contenido}</p>
          </div>
        </div>
      )}
    />
  );
}
