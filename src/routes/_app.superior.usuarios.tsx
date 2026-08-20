import { createFileRoute } from "@tanstack/react-router";
import { PaperCard, PaperTape } from "@/components/paper/Paper";
import { ROL_LABEL, cambiarRol, eliminarUsuario, selectUsuarios, useStore } from "@/lib/store";
import type { Rol } from "@/lib/types";

export const Route = createFileRoute("/_app/superior/usuarios")({
  component: SuperiorUsuarios,
});

const ROLES: Rol[] = ["alumno", "creador", "asociado", "superior"];

function SuperiorUsuarios() {
  const usuarios = useStore(selectUsuarios);
  const actual = useStore((s) => s.user);

  return (
    <div className="space-y-5">
      <PaperCard variant="kraft">
        <PaperTape color="sun" className="mb-2">
          Permisos
        </PaperTape>
        <h1 className="display text-3xl">Usuarios de la plataforma</h1>
        <p className="mt-1 text-sm opacity-90">Cambiá roles o dá de baja cuentas.</p>
      </PaperCard>

      {usuarios.length === 0 ? (
        <PaperCard>
          <p className="text-sm text-muted-foreground">Todavía no hay cuentas registradas.</p>
        </PaperCard>
      ) : (
        <div className="space-y-3">
          {usuarios.map((u) => (
            <PaperCard key={u.id} className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-extrabold text-ink">{u.nombre}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.email} · {u.escuela || "—"} · {ROL_LABEL[u.rol]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={u.rol}
                  onChange={(e) => cambiarRol(u.id, e.target.value as Rol)}
                  className="rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-1.5 text-xs font-bold text-ink"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROL_LABEL[r]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => eliminarUsuario(u.id)}
                  disabled={u.id === actual?.id}
                  className="rounded-full border-2 border-earth/50 bg-cream px-3 py-1.5 text-xs font-bold text-earth disabled:opacity-40"
                >
                  Eliminar
                </button>
              </div>
            </PaperCard>
          ))}
        </div>
      )}
    </div>
  );
}
