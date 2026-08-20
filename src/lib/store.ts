/**
 * Karmaverde — Store del frontend con soporte dual: Local / SQL vía PHP.
 * Incluye motor de trazabilidad, cupones de canje verificados, metas comunitarias,
 * cálculo de impacto ambiental y quizzes educativos.
 */
import { useSyncExternalStore } from "react";
import type {
  Premio,
  Guia,
  EtapaCircuito,
  PuntoVerde,
  RankingRow,
  Tarea,
  User,
  Rol,
  CanjeTicket,
  EntregaReciclaje,
  MetaComunitariaEscolar,
  QuizPregunta,
  EcoMetricas,
} from "./types";
import {
  seedPremios,
  seedGuias,
  seedCircuito,
  seedPuntosVerdes,
  seedUsers,
  seedTareas,
  seedMetasComunitarias,
  seedCanjeTickets,
  seedEntregas,
  seedQuizPreguntas,
} from "./mock-data";
import { api, usingMocks, ApiError, isOffline } from "./api";
import { parseQr, yaUsado, marcarUsado } from "./qr";

export const CREATOR_CODE = "KARMA-VERDE-2026";
export const SUPERIOR_CODE = "KARMA-SUPER-2026";
export const ASOCIADO_CODE = "KARMA-ESCUELA-2026";

export const ROL_HOME: Record<Rol, string> = {
  alumno: "/alumno",
  creador: "/creador",
  superior: "/superior",
  asociado: "/asociado",
};

export const ROL_LABEL: Record<Rol, string> = {
  alumno: "Alumno",
  creador: "Creador",
  superior: "Superior",
  asociado: "Asociado",
};

export function validarPasswordFuerte(pw: string): string | null {
  if (pw.length < 10) return "La contraseña debe tener al menos 10 caracteres.";
  if (!/[A-Z]/.test(pw)) return "Debe incluir al menos una mayúscula.";
  if (!/[a-z]/.test(pw)) return "Debe incluir al menos una minúscula.";
  if (!/[0-9]/.test(pw)) return "Debe incluir al menos un número.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Debe incluir al menos un símbolo (!@#$...).";
  return null;
}

interface StoredUser extends User {
  password: string;
}

interface State {
  user: User | null;
  users: StoredUser[];
  premios: Premio[];
  guias: Guia[];
  circuito: EtapaCircuito[];
  puntosVerdes: PuntoVerde[];
  tareas: Tarea[];
  tickets: CanjeTicket[];
  entregas: EntregaReciclaje[];
  metasComunitarias: MetaComunitariaEscolar[];
  quizPreguntas: QuizPregunta[];
  quizzesCompletados: string[];
  privacidadNombres: boolean;
}

const KEY = "karmaverde-state-v4";
const isBrowser = typeof window !== "undefined";

const initial: State = {
  user: null,
  users: seedUsers,
  premios: seedPremios,
  guias: seedGuias,
  circuito: seedCircuito,
  puntosVerdes: seedPuntosVerdes,
  tareas: seedTareas,
  tickets: seedCanjeTickets,
  entregas: seedEntregas,
  metasComunitarias: seedMetasComunitarias,
  quizPreguntas: seedQuizPreguntas,
  quizzesCompletados: [],
  privacidadNombres: false,
};

let state: State = initial;
const listeners = new Set<() => void>();

export function getActiveUser(): User | null {
  if (state.user) return state.user;
  if (!isBrowser) return null;
  try {
    const raw =
      localStorage.getItem(KEY) ??
      localStorage.getItem("karmaverde-state-v3") ??
      localStorage.getItem("karmaverde-state-v2") ??
      localStorage.getItem("karmaverde-state-v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.user ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function load() {
  if (!isBrowser) return;
  try {
    const raw =
      localStorage.getItem(KEY) ??
      localStorage.getItem("karmaverde-state-v3") ??
      localStorage.getItem("karmaverde-state-v2") ??
      localStorage.getItem("karmaverde-state-v1");
    if (raw) {
      const prev = JSON.parse(raw) as Partial<State>;
      state = {
        ...initial,
        ...prev,
        puntosVerdes: initial.puntosVerdes,
        users: prev.users && prev.users.length > 0 ? prev.users : initial.users,
        tareas: prev.tareas && prev.tareas.length > 0 ? prev.tareas : initial.tareas,
        tickets: prev.tickets && prev.tickets.length > 0 ? prev.tickets : initial.tickets,
        entregas: prev.entregas && prev.entregas.length > 0 ? prev.entregas : initial.entregas,
        metasComunitarias:
          prev.metasComunitarias && prev.metasComunitarias.length > 0
            ? prev.metasComunitarias
            : initial.metasComunitarias,
        quizPreguntas:
          prev.quizPreguntas && prev.quizPreguntas.length > 0
            ? prev.quizPreguntas
            : initial.quizPreguntas,
        quizzesCompletados: prev.quizzesCompletados ?? [],
      };
    }
  } catch {
    /* ignore */
  }
}

function save() {
  if (!isBrowser) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function setState(updater: Partial<State> | ((prev: State) => Partial<State>)) {
  const patch = typeof updater === "function" ? updater(state) : updater;
  state = { ...state, ...patch };
  save();
  listeners.forEach((l) => l());
}

load();

const snapshotCache = new WeakMap<object, Map<(s: State) => unknown, unknown>>();

function getCachedSnapshot<T>(targetState: State, selector: (s: State) => T): T {
  let cache = snapshotCache.get(targetState);
  if (!cache) {
    cache = new Map();
    snapshotCache.set(targetState, cache);
  }
  const selKey = selector as (s: State) => unknown;
  if (cache.has(selKey)) {
    return cache.get(selKey) as T;
  }
  const result = selector(targetState);
  cache.set(selKey, result);
  return result;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
    () => getCachedSnapshot(state, selector),
    () => getCachedSnapshot(initial, selector),
  );
}

/* ————— Autenticación ————— */

export async function loginDemo(rol: Rol) {
  const found = state.users.find((u) => u.rol === rol);
  if (!found) return;
  const { password: _pw, ...publicUser } = found;
  setState({ user: publicUser });
}

export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  escuela: string;
  codigo?: string;
  curso?: string;
}

export async function register(input: RegisterInput): Promise<{ ok: boolean; error?: string }> {
  const pwErr = validarPasswordFuerte(input.password);
  if (pwErr) return { ok: false, error: pwErr };

  if (input.rol === "creador" && input.codigo !== CREATOR_CODE) {
    return { ok: false, error: "Código de Creador inválido." };
  }
  if (input.rol === "superior" && input.codigo !== SUPERIOR_CODE) {
    return { ok: false, error: "Código de Superior inválido." };
  }
  if (input.rol === "asociado" && input.codigo !== ASOCIADO_CODE) {
    return { ok: false, error: "Código de Asociado inválido." };
  }

  const em = input.email.trim().toLowerCase();

  if (!usingMocks()) {
    try {
      const res = await api.register({
        nombre: input.nombre.trim(),
        email: em,
        password: input.password,
        rol: input.rol,
        escuela: input.escuela.trim(),
      });
      setState({
        user: {
          id: res.id,
          nombre: res.nombre,
          email: res.email,
          rol: res.rol,
          escuela: res.escuela,
          puntos: res.puntos,
          canjes: res.canjes,
          curso: input.curso,
        },
      });
      return { ok: true };
    } catch (e) {
      if (!isOffline(e)) {
        return { ok: false, error: e instanceof ApiError ? e.message : "Error de red" };
      }
    }
  }

  if (state.users.some((u) => u.email === em)) {
    return { ok: false, error: "Ya existe un usuario con ese email." };
  }

  const newUser: StoredUser = {
    id: `u-${Date.now()}`,
    nombre: input.nombre.trim(),
    email: em,
    password: input.password,
    rol: input.rol,
    escuela: input.escuela.trim(),
    curso: input.curso?.trim() || (input.rol === "alumno" ? "Secundaria" : undefined),
    puntos: 0,
    canjes: 0,
  };

  const { password: _pw, ...publicUser } = newUser;
  setState((s) => ({
    users: [...s.users, newUser],
    user: publicUser,
  }));
  return { ok: true };
}

export async function login(
  email: string,
  password: string,
  rolEsperado?: Rol,
): Promise<{ ok: boolean; error?: string; user?: User }> {
  const em = email.trim().toLowerCase();

  if (!usingMocks()) {
    try {
      const res = await api.login({ email: em, password });
      const user: User = {
        id: res.id,
        nombre: res.nombre,
        email: res.email,
        rol: res.rol,
        escuela: res.escuela,
        puntos: res.puntos,
        canjes: res.canjes,
      };
      if (rolEsperado && user.rol !== rolEsperado) {
        return {
          ok: false,
          error: `Tu cuenta tiene el rol '${ROL_LABEL[user.rol]}', no '${ROL_LABEL[rolEsperado]}'.`,
        };
      }
      setState({ user });
      return { ok: true, user };
    } catch (e) {
      if (!isOffline(e)) {
        return { ok: false, error: e instanceof ApiError ? e.message : "Error de red" };
      }
    }
  }

  const found = state.users.find((u) => u.email === em);
  if (!found) return { ok: false, error: "No existe una cuenta con ese email." };
  if (found.password !== password) return { ok: false, error: "Contraseña incorrecta." };
  if (rolEsperado && found.rol !== rolEsperado)
    return { ok: false, error: `Esta cuenta es de tipo ${ROL_LABEL[found.rol]}.` };

  const { password: _pw, ...publicUser } = found;
  setState({ user: publicUser });
  return { ok: true, user: publicUser };
}

export async function logout() {
  if (!usingMocks()) {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
  }
  setState({ user: null });
}

/* ————— Puntos / canjes alumno ————— */

function updateUserRecord(patch: (u: StoredUser) => StoredUser) {
  setState((s) => {
    if (!s.user) return {};
    const users = s.users.map((u) => (u.id === s.user!.id ? patch(u) : u));
    let publicUser: User;
    const found = users.find((u) => u.id === s.user!.id);
    if (found) {
      const { password: _pw, ...pu } = found;
      publicUser = pu;
    } else {
      publicUser = patch({ ...s.user, password: "" } as StoredUser);
      delete (publicUser as Partial<StoredUser>).password;
    }
    return { users, user: publicUser };
  });
}

export async function sumarPuntos(cant: number, material = "generico") {
  if (!usingMocks()) {
    try {
      const res = await api.scan({ material, puntos: cant });
      setState((s) => (s.user ? { user: { ...s.user, puntos: res.puntos } } : {}));
      return true;
    } catch {
      return false;
    }
  }
  updateUserRecord((u) => ({ ...u, puntos: u.puntos + cant }));
  return true;
}

export type QrResult =
  { ok: true; puntos: number; material: string; hash: string } | { ok: false; error: string };

export async function canjearQr(raw: string): Promise<QrResult> {
  const parsed = parseQr(raw);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  const { id, material, puntos } = parsed.payload;

  if (!usingMocks()) {
    try {
      const res = await api.scanQr({ codigo: raw });
      setState((s) => (s.user ? { user: { ...s.user, puntos: res.total } } : {}));
      marcarUsado(id);
      return {
        ok: true,
        puntos: res.puntos,
        material: res.material,
        hash: `0x${Math.random().toString(16).substring(2, 10)}`,
      };
    } catch (e) {
      if (!isOffline(e)) {
        return { ok: false, error: e instanceof ApiError ? e.message : "Error de red" };
      }
    }
  }

  if (yaUsado(id)) return { ok: false, error: "Este código QR ya fue utilizado anteriormente." };
  if (parsed.needsLookup)
    return { ok: false, error: "Código sin puntos asignados: requiere conexión con el servidor." };

  marcarUsado(id);
  const hashToken = `0x${Math.random().toString(16).substring(2, 10)}`;

  // Registrar entrega certificada
  const pesoAprox = Math.max(0.5, Number((puntos / 50).toFixed(1)));
  const nuevaEntrega: EntregaReciclaje = {
    id: `ent-${Date.now()}`,
    alumnoId: state.user?.id ?? "u1",
    alumnoNombre: state.user?.nombre ?? "Alumno",
    escuela: state.user?.escuela ?? "Escuela",
    tipoPlastico: (material.includes("PET")
      ? "PET"
      : material.includes("Cartón")
        ? "Cartón"
        : "Aluminio") as EntregaReciclaje["tipoPlastico"],
    pesoKg: pesoAprox,
    puntosOtorgados: puntos,
    hashToken,
    fecha: new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }),
    estado: "validada",
    validadoPor: "Punto Verde Automatizado",
  };

  updateUserRecord((u) => ({ ...u, puntos: u.puntos + puntos }));

  setState((s) => {
    // Actualizar meta comunitaria de la escuela
    const metas = s.metasComunitarias.map((m) => {
      if (m.escuela === (s.user?.escuela ?? "")) {
        const nuevoAcumulado = m.acumuladoKg + pesoAprox;
        return {
          ...m,
          acumuladoKg: nuevoAcumulado,
          estado: (nuevoAcumulado >= m.metaKg ? "alcanzada" : "en_progreso") as
            "en_progreso" | "alcanzada",
        };
      }
      return m;
    });

    return {
      entregas: [nuevaEntrega, ...s.entregas],
      metasComunitarias: metas,
    };
  });

  return { ok: true, puntos, material, hash: hashToken };
}

/** Canjear premio generando un Voucher seguro con QR y código único */
export async function canjearPremioConTicket(
  id: string,
): Promise<{ ok: boolean; error?: string; ticket?: CanjeTicket }> {
  const p = state.premios.find((x) => x.id === id);
  if (!p) return { ok: false, error: "Premio no encontrado." };
  if (!state.user) return { ok: false, error: "Debés iniciar sesión." };
  if (state.user.puntos < p.puntos) return { ok: false, error: "Puntos insuficientes." };
  if (p.stock <= 0) return { ok: false, error: "No hay stock disponible para este premio." };

  const codigoVoucher = `KV-TKT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const hoy = new Date();
  const vence = new Date();
  vence.setDate(vence.getDate() + 30);

  const nuevoTicket: CanjeTicket = {
    id: `tk-${Date.now()}`,
    usuarioId: state.user.id,
    usuarioNombre: state.user.nombre,
    escuela: state.user.escuela,
    premioId: p.id,
    premioNombre: p.nombre,
    puntosGastados: p.puntos,
    codigoVoucher,
    fechaCanje: hoy.toISOString().split("T")[0],
    fechaVencimiento: vence.toISOString().split("T")[0],
    estado: "pendiente_retiro",
  };

  updateUserRecord((u) => ({
    ...u,
    puntos: u.puntos - p.puntos,
    canjes: u.canjes + 1,
  }));

  setState((s) => ({
    premios: s.premios.map((x) => (x.id === id ? { ...x, stock: x.stock - 1 } : x)),
    tickets: [nuevoTicket, ...s.tickets],
  }));

  return { ok: true, ticket: nuevoTicket };
}

export function marcarTicketEntregado(ticketId: string, entregadorNombre = "Responsable Escolar") {
  setState((s) => ({
    tickets: s.tickets.map((t) =>
      t.id === ticketId ? { ...t, estado: "entregado", entregadoPor: entregadorNombre } : t,
    ),
  }));
}

/* ————— Trazabilidad y entregas físicas ————— */
export function registrarEntregaManual(
  entrega: Omit<EntregaReciclaje, "id" | "hashToken" | "fecha">,
) {
  const hashToken = `0x${Math.random().toString(16).substring(2, 10)}`;
  const nueva: EntregaReciclaje = {
    ...entrega,
    id: `ent-${Date.now()}`,
    hashToken,
    fecha: new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }),
  };

  if (entrega.estado === "validada" && state.user && state.user.id === entrega.alumnoId) {
    updateUserRecord((u) => ({ ...u, puntos: u.puntos + entrega.puntosOtorgados }));
  }

  setState((s) => ({
    entregas: [nueva, ...s.entregas],
  }));
}

export function validarEntregaReciclaje(
  entregaId: string,
  validadorNombre = "Referente Ambiental",
) {
  setState((s) => {
    const entrega = s.entregas.find((e) => e.id === entregaId);
    if (!entrega) return {};

    // Sumar puntos si pasa de pendiente a validada
    if (entrega.estado === "pendiente_pesaje") {
      const users = s.users.map((u) =>
        u.id === entrega.alumnoId ? { ...u, puntos: u.puntos + entrega.puntosOtorgados } : u,
      );
      return {
        users,
        user:
          s.user && s.user.id === entrega.alumnoId
            ? { ...s.user, puntos: s.user.puntos + entrega.puntosOtorgados }
            : s.user,
        entregas: s.entregas.map((e) =>
          e.id === entregaId ? { ...e, estado: "validada", validadoPor: validadorNombre } : e,
        ),
      };
    }

    return {
      entregas: s.entregas.map((e) =>
        e.id === entregaId ? { ...e, estado: "validada", validadoPor: validadorNombre } : e,
      ),
    };
  });
}

/* ————— Quizzes y Trivia Educativa ————— */
export function responderQuiz(
  quizId: string,
  opcionElegida: number,
): { esCorrecta: boolean; puntos: number; explicacion: string } {
  const quiz = state.quizPreguntas.find((q) => q.id === quizId);
  if (!quiz) return { esCorrecta: false, puntos: 0, explicacion: "Pregunta no encontrada." };

  const esCorrecta = quiz.respuestaCorrecta === opcionElegida;
  const yaHecho = state.quizzesCompletados.includes(quizId);

  if (esCorrecta && !yaHecho && state.user) {
    updateUserRecord((u) => ({ ...u, puntos: u.puntos + quiz.puntosPremio }));
    setState((s) => ({
      quizzesCompletados: [...s.quizzesCompletados, quizId],
    }));
  }

  return {
    esCorrecta,
    puntos: esCorrecta && !yaHecho ? quiz.puntosPremio : 0,
    explicacion: quiz.explicacion,
  };
}

/* ————— Métricas ecológicas científicas ————— */
export function selectEcoImpacto(s: State): EcoMetricas {
  const kgEntregas = s.entregas.reduce(
    (acc, e) => acc + (e.estado === "validada" ? e.pesoKg : 0),
    0,
  );
  const kgTareas = s.tareas.reduce((acc, t) => acc + (t.progreso ?? 0), 0);
  const kgTotales = Math.max(120, kgEntregas + kgTareas);

  return {
    kgTotales: Math.round(kgTotales * 10) / 10,
    litrosAguaAhorrados: Math.round(kgTotales * 24), // 24L de agua ahorrados por cada 1kg de PET/PEAD
    kgCo2Evitado: Math.round(kgTotales * 1.85 * 10) / 10, // 1.85 kg CO2 eq ahorrado
    kwhEnergiaAhorrada: Math.round(kgTotales * 5.6 * 10) / 10, // 5.6 kWh energía
    arbolesEquivalentes: Math.max(1, Math.round(kgTotales * 0.04)),
  };
}

/* ————— Ranking con Fair Play y Privacidad de Menores ————— */
export function anonimizarNombre(nombre: string, anonimizar = true): string {
  if (!anonimizar) return nombre;
  const parts = nombre.trim().split(" ");
  if (parts.length <= 1) return nombre;
  const primerNombre = parts[0];
  const inicialApellido = parts[1]?.charAt(0) ? `${parts[1].charAt(0)}.` : "";
  return `${primerNombre} ${inicialApellido}`;
}

export function togglePrivacidad() {
  setState((s) => ({ privacidadNombres: !s.privacidadNombres }));
}

export function selectRanking(s: State): RankingRow[] {
  return s.users
    .filter((u) => u.rol === "alumno")
    .map(({ password: _pw, email: _e, ...r }) => ({
      ...r,
      nombre: anonimizarNombre(r.nombre, s.privacidadNombres),
    }));
}

/* ————— CRUD creador ————— */
type Entity = "premios" | "guias" | "circuito";
type EntityMap = { premios: Premio; guias: Guia; circuito: EtapaCircuito };

export async function upsert<E extends Entity>(entity: E, item: EntityMap[E]) {
  if (!usingMocks()) {
    try {
      await api[entity].save(item);
    } catch {
      /* ignore */
    }
  }
  setState((s) => {
    const list = s[entity] as EntityMap[E][];
    const idx = list.findIndex((x) => x.id === item.id);
    const next = idx >= 0 ? list.map((x, i) => (i === idx ? item : x)) : [...list, item];
    return { [entity]: next } as Partial<State>;
  });
}

export async function remove<E extends Entity>(entity: E, id: string) {
  if (!usingMocks()) {
    try {
      await api[entity].remove(id);
    } catch {
      /* ignore */
    }
  }
  setState((s) => {
    const list = s[entity] as { id: string }[];
    return { [entity]: list.filter((x) => x.id !== id) } as Partial<State>;
  });
}

/* ————— Superior: usuarios y métricas globales ————— */
export interface UsuarioResumen {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  escuela: string;
  puntos: number;
  canjes: number;
}

export function selectUsuarios(s: State): UsuarioResumen[] {
  const list = s.users.map(({ password: _pw, ...u }) => u as UsuarioResumen);
  if (s.user && !list.some((u) => u.id === s.user!.id)) list.push(s.user as UsuarioResumen);
  return list;
}

export interface EscuelaResumen {
  escuela: string;
  alumnos: number;
  puntos: number;
  canjes: number;
  kgReciclados: number;
}

export function selectEscuelas(s: State): EscuelaResumen[] {
  const map = new Map<string, EscuelaResumen>();
  for (const u of s.users) {
    if (u.rol !== "alumno" || !u.escuela) continue;
    const row = map.get(u.escuela) ?? {
      escuela: u.escuela,
      alumnos: 0,
      puntos: 0,
      canjes: 0,
      kgReciclados: 0,
    };
    row.alumnos += 1;
    row.puntos += u.puntos;
    row.canjes += u.canjes;
    row.kgReciclados += Math.round((u.puntos / 50) * 10) / 10;
    map.set(u.escuela, row);
  }
  return [...map.values()].sort((a, b) => b.puntos - a.puntos);
}

/** Cambia el rol de un usuario (solo rol superior). */
export async function cambiarRol(id: string, rol: Rol) {
  if (!usingMocks()) {
    try {
      await api.usuarios.cambiarRol(id, rol);
    } catch {
      /* ignore */
    }
  }
  setState((s) => ({
    users: s.users.map((u) => (u.id === id ? { ...u, rol } : u)),
    user: s.user && s.user.id === id ? { ...s.user, rol } : s.user,
  }));
}

/** Elimina una cuenta (solo rol superior). */
export async function eliminarUsuario(id: string) {
  if (!usingMocks()) {
    try {
      await api.usuarios.remove(id);
    } catch {
      /* ignore */
    }
  }
  setState((s) => ({ users: s.users.filter((u) => u.id !== id) }));
}

/* ————— Asociado: tareas de recolección ————— */
export async function upsertTarea(t: Tarea) {
  if (!usingMocks()) {
    try {
      await api.tareas.save(t);
    } catch {
      /* ignore */
    }
  }
  setState((s) => {
    const idx = s.tareas.findIndex((x) => x.id === t.id);
    return {
      tareas: idx >= 0 ? s.tareas.map((x, i) => (i === idx ? t : x)) : [...s.tareas, t],
    };
  });
}

export async function removeTarea(id: string) {
  if (!usingMocks()) {
    try {
      await api.tareas.remove(id);
    } catch {
      /* ignore */
    }
  }
  setState((s) => ({ tareas: s.tareas.filter((t) => t.id !== id) }));
}
