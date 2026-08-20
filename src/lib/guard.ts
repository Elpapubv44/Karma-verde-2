import { redirect } from "@tanstack/react-router";
import type { Rol } from "./types";
import { ROL_HOME, getActiveUser } from "./store";

/**
 * Guardia de rutas por rol.
 * Se usa en el `beforeLoad` de cada layout de panel.
 */
export function guardRol(rol: Rol) {
  if (typeof window === "undefined") return;
  const user = getActiveUser();
  if (!user) throw redirect({ to: "/" });
  if (user.rol !== rol) {
    throw redirect({ to: ROL_HOME[user.rol ?? "alumno"] });
  }
}
