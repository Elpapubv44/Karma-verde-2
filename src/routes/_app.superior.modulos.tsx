import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/superior/modulos")({
  component: SuperiorModulos,
});

function SuperiorModulos() {
  const premios = useStore((s) => s.premios);
  const guias = useStore((s) => s.guias);
  const circuito = useStore((s) => s.circuito);
  const puntosVerdes = useStore((s) => s.puntosVerdes);

  const mods = [
    { icon: "🎁", label: "Premios", n: premios.length, desc: "Catálogo de canje" },
    { icon: "📚", label: "Guías", n: guias.length, desc: "Contenido educativo" },
    { icon: "🚚", label: "Circuito", n: circuito.length, desc: "Etapas del viaje" },
    { icon: "🗺️", label: "Puntos verdes", n: puntosVerdes.length, desc: "Mapa de acopio" },
  ];

  return (
    <div className="space-y-5">
      <PaperCard variant="kraft">
        <PaperTape color="sun" className="mb-2">
          Módulos
        </PaperTape>
        <h1 className="display text-3xl">Administración global</h1>
        <p className="mt-1 text-sm opacity-90">
          Todos los módulos de creador, disponibles desde el panel superior.
        </p>
      </PaperCard>

      <div className="grid gap-3 sm:grid-cols-2">
        {mods.map((m) => (
          <PaperCard key={m.label} className="flex items-center gap-4">
            <span className="text-3xl">{m.icon}</span>
            <div>
              <p className="display text-2xl leading-none text-primary">{m.n}</p>
              <p className="text-sm font-extrabold text-ink">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          </PaperCard>
        ))}
      </div>

      <PaperCard>
        <p className="text-sm text-muted-foreground">
          Las herramientas de edición viven en el panel de creador y comparten el mismo
          almacenamiento.{" "}
          <Link
            to="/superior/usuarios"
            className="font-bold text-primary underline underline-offset-4"
          >
            Gestionar permisos
          </Link>
        </p>
      </PaperCard>
    </div>
  );
}
