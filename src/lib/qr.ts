/**
 * Karmaverde — Decodificación y validación de códigos QR de reciclaje.
 *
 * Formatos aceptados:
 *  1) JSON      → {"id":"abc123","material":"pet","puntos":10,"exp":"2026-12-31"}
 *  2) Pipe      → KV|abc123|pet|10|2026-12-31   (exp opcional)
 *  3) URL       → https://…/qr?id=abc123&material=pet&puntos=10&exp=2026-12-31
 *
 * Si el QR solo trae un `id`, se consulta al backend (php-api) para obtener
 * material y puntos. En modo prototipo (sin API) se rechaza como inválido.
 */

export interface QrPayload {
  id: string;
  material: string;
  puntos: number;
  exp?: string;
}

export type QrParse =
  { ok: true; payload: QrPayload; needsLookup: boolean } | { ok: false; error: string };

const USED_KEY = "karmaverde-qr-usados-v1";

export function parseQr(raw: string): QrParse {
  const text = raw.trim();
  if (!text) return { ok: false, error: "El código está vacío." };

  let data: Partial<Record<string, unknown>> | null = null;

  // 1) JSON
  if (text.startsWith("{")) {
    try {
      data = JSON.parse(text);
    } catch {
      return { ok: false, error: "El código QR no tiene un formato válido." };
    }
  }

  // 2) Pipe
  if (!data && text.toUpperCase().startsWith("KV|")) {
    const [, id, material, puntos, exp] = text.split("|");
    data = { id, material, puntos, exp };
  }

  // 3) URL
  if (!data && /^https?:\/\//i.test(text)) {
    try {
      const q = new URL(text).searchParams;
      data = {
        id: q.get("id") ?? undefined,
        material: q.get("material") ?? undefined,
        puntos: q.get("puntos") ?? undefined,
        exp: q.get("exp") ?? undefined,
      };
    } catch {
      /* ignore */
    }
  }

  if (!data) {
    return { ok: false, error: "Este QR no pertenece a Karmaverde." };
  }

  const id = String(data.id ?? "").trim();
  if (!id) return { ok: false, error: "Este QR no pertenece a Karmaverde." };

  const exp = data.exp ? String(data.exp) : undefined;
  if (exp && !Number.isNaN(Date.parse(exp)) && Date.parse(exp) < Date.now()) {
    return { ok: false, error: "Este código QR está vencido." };
  }

  const material = String(data.material ?? "").trim();
  const puntos = Number(data.puntos ?? 0);
  const needsLookup = !material || !Number.isFinite(puntos) || puntos <= 0;

  return {
    ok: true,
    needsLookup,
    payload: { id, material: material || "generico", puntos: needsLookup ? 0 : puntos, exp },
  };
}

/* ————— Registro local de códigos ya usados (anti reutilización) ————— */

function readUsed(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USED_KEY) || "{}");
  } catch {
    return {};
  }
}

export function yaUsado(id: string): boolean {
  return Boolean(readUsed()[id]);
}

export function marcarUsado(id: string) {
  if (typeof window === "undefined") return;
  const used = readUsed();
  used[id] = Date.now();
  try {
    localStorage.setItem(USED_KEY, JSON.stringify(used));
  } catch {
    /* ignore */
  }
}
