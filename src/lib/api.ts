/**
 * Karmaverde — Cliente HTTP hacia el backend PHP externo / SQL.
 *
 * ▸ Si VITE_API_BASE_URL está definida en .env, todas las peticiones
 *   van al backend PHP y se guardan directamente en SQL.
 * ▸ Incluye endpoints completos para todos los roles (alumno, creador, superior, asociado).
 */

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const BASE = RAW_BASE.replace(/\/+$/, "");

export const usingMocks = () => BASE.length === 0;

export const OFFLINE_MESSAGE = "__API_OFFLINE__";
export const isOffline = (e: unknown) => e instanceof ApiError && e.status === 0;

export class ApiError extends Error {
  constructor(
    public status: number,
    public payload: unknown,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  if (usingMocks()) {
    throw new ApiError(0, null, "API no configurada (mock mode)");
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: "include", // cookie PHPSESSID
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(opts.headers ?? {}),
      },
      ...opts,
    });
  } catch {
    throw new ApiError(0, null, OFFLINE_MESSAGE);
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `HTTP ${res.status}`) || `HTTP ${res.status}`;
    throw new ApiError(res.status, data, msg);
  }
  return data as T;
}

/* ————— Endpoints tipados hacia PHP/SQL ————— */

export const api = {
  // Auth
  register: (body: {
    nombre: string;
    email: string;
    password: string;
    rol: "alumno" | "creador" | "superior" | "asociado";
    escuela: string;
    codigo?: string;
  }) =>
    apiFetch<{ user: unknown }>("/auth/register.php", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ user: unknown }>("/auth/login.php", { method: "POST", body: JSON.stringify(body) }),

  logout: () => apiFetch<{ ok: true }>("/auth/logout.php", { method: "POST" }),
  me: () => apiFetch<{ user: unknown | null }>("/auth/me.php"),

  // Alumno
  scan: (body: { material: string; puntos: number }) =>
    apiFetch<{ ok: true; puntos: number }>("/alumno/scan.php", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  scanQr: (body: { codigo: string }) =>
    apiFetch<{ ok: true; puntos: number; material: string; total: number }>("/alumno/scan_qr.php", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  canjear: (premio_id: string) =>
    apiFetch<{ ok: true }>("/alumno/canjear.php", {
      method: "POST",
      body: JSON.stringify({ premio_id }),
    }),

  ranking: () => apiFetch<unknown[]>("/alumno/ranking.php"),

  // Creador
  premios: {
    list: () => apiFetch<unknown[]>("/creador/premios.php"),
    save: (item: unknown) =>
      apiFetch<unknown>("/creador/premios.php", { method: "POST", body: JSON.stringify(item) }),
    remove: (id: string) =>
      apiFetch<{ ok: true }>(`/creador/premios.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
  },

  guias: {
    list: () => apiFetch<unknown[]>("/creador/guias.php"),
    save: (item: unknown) =>
      apiFetch<unknown>("/creador/guias.php", { method: "POST", body: JSON.stringify(item) }),
    remove: (id: string) =>
      apiFetch<{ ok: true }>(`/creador/guias.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
  },

  circuito: {
    list: () => apiFetch<unknown[]>("/creador/circuito.php"),
    save: (item: unknown) =>
      apiFetch<unknown>("/creador/circuito.php", { method: "POST", body: JSON.stringify(item) }),
    remove: (id: string) =>
      apiFetch<{ ok: true }>(`/creador/circuito.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
  },

  // Superior
  usuarios: {
    list: () => apiFetch<unknown[]>("/superior/usuarios.php"),
    cambiarRol: (id: string, rol: string) =>
      apiFetch<{ ok: true }>("/superior/usuarios.php", {
        method: "POST",
        body: JSON.stringify({ id, rol }),
      }),
    remove: (id: string) =>
      apiFetch<{ ok: true }>(`/superior/usuarios.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    escuelas: () => apiFetch<unknown[]>("/superior/usuarios.php?action=escuelas"),
  },

  // Asociado
  tareas: {
    list: () => apiFetch<unknown[]>("/asociado/tareas.php"),
    save: (item: unknown) =>
      apiFetch<unknown>("/asociado/tareas.php", { method: "POST", body: JSON.stringify(item) }),
    remove: (id: string) =>
      apiFetch<{ ok: true }>(`/asociado/tareas.php?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
  },
};
