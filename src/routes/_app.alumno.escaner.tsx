import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import { canjearQr, registrarEntregaManual, useStore } from "@/lib/store";
import {
  ShieldCheck,
  Scale,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_app/alumno/escaner")({
  component: EscanerPage,
});

type Feedback =
  | { tipo: "ok"; titulo: string; detalle: string; hash?: string }
  | { tipo: "error"; titulo: string; detalle: string };

function EscanerPage() {
  const user = useStore((s) => s.user);
  const entregas = useStore((s) => s.entregas);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualMaterial, setManualMaterial] = useState<"PET" | "PEAD" | "Cartón" | "Aluminio">(
    "PET",
  );
  const [manualPeso, setManualPeso] = useState("2.5");

  const misEntregas = entregas.filter((e) => e.alumnoId === user?.id);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  /** Procesa un QR detectado: valida, suma puntos y reactiva el escáner. */
  const handleCode = useCallback(async (raw: string) => {
    busyRef.current = true;
    const res = await canjearQr(raw);
    if (res.ok) {
      setFeedback({
        tipo: "ok",
        titulo: "¡Entrega Verificada!",
        detalle: `Sumaste ${res.puntos} puntos (${res.material}).`,
        hash: res.hash,
      });
    } else {
      setFeedback({ tipo: "error", titulo: "Código no válido", detalle: res.error });
    }
    // Reactivar el escáner tras mostrar el resultado
    setTimeout(() => {
      busyRef.current = false;
    }, 2800);
  }, []);

  /** Bucle de lectura: toma frames del video y los decodifica con jsQR. */
  const tick = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA && !busyRef.current) {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w && h) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const img = ctx.getImageData(0, 0, w, h);
          const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
          if (code?.data) void handleCode(code.data);
        }
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [handleCode]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tu navegador no soporta la cámara.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      busyRef.current = false;
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      const err = e as DOMException;
      if (err?.name === "NotAllowedError")
        setError("Permiso denegado. Habilitá la cámara desde el navegador.");
      else if (err?.name === "NotFoundError")
        setError("No se encontró ninguna cámara en el dispositivo.");
      else setError("No se pudo iniciar la cámara.");
      stopCamera();
    }
  }, [stopCamera, tick]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const peso = parseFloat(manualPeso);
    if (!peso || peso <= 0) return;
    const puntos = Math.round(peso * (manualMaterial === "PET" ? 50 : 40));

    registrarEntregaManual({
      alumnoId: user?.id ?? "u1",
      alumnoNombre: user?.nombre ?? "Alumno",
      escuela: user?.escuela ?? "Escuela",
      tipoPlastico: manualMaterial,
      pesoKg: peso,
      puntosOtorgados: puntos,
      estado: "pendiente_pesaje",
    });

    setShowManualModal(false);
    setFeedback({
      tipo: "ok",
      titulo: "Solicitud de Pesaje Registrada",
      detalle: `Tu lote de ${peso}kg de ${manualMaterial} está pendiente de confirmación en balanza (+${puntos} pts).`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl text-ink">Escáner de Depósito y Pesaje</h1>
        <p className="text-sm text-muted-foreground">
          Escaneá el código QR del contenedor inteligente o registrá tu entrega en balanza.
        </p>
      </div>

      {/* Anti-Fraud Security Notice */}
      <div className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs text-primary font-bold">
        <Lock className="h-4 w-4 shrink-0" />
        <span>
          <strong>Protección Criptográfica:</strong> Cada depósito genera un token único con firma
          de un solo uso para evitar duplicados.
        </span>
      </div>

      <PaperCard className="relative overflow-hidden p-4 space-y-4">
        {/* Contenedor del video con visor estilo escáner */}
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border-4 border-dashed border-kraft/70 bg-ink/90">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`h-full w-full object-cover ${cameraOn ? "block" : "hidden"}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Animación y marco de escaneo */}
          {cameraOn && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="relative h-48 w-48 rounded-2xl border-2 border-primary/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                <span className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-sun" />
                <span className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-sun" />
                <span className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-sun" />
                <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-sun" />
                <div className="absolute inset-x-0 top-0 h-0.5 animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-sun to-transparent" />
              </div>
            </div>
          )}

          {!cameraOn && !error && (
            <div className="grid h-full place-items-center p-6 text-center text-cream">
              <div className="space-y-3">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-cream/15 text-sun">
                  <QrCode className="h-9 w-9 stroke-[2.2]" />
                </div>
                <p className="text-sm font-extrabold">Cámara apagada</p>
                <p className="text-xs text-cream/70">
                  Activá la cámara para escanear el punto verde o usá los QRs de prueba abajo.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="grid h-full place-items-center p-6 text-center text-destructive-foreground">
              <div className="space-y-2">
                <p className="font-extrabold text-sm text-destructive">
                  No se pudo acceder a la cámara
                </p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de control de cámara y entrega manual */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {!cameraOn ? (
            <PaperButton variant="leaf" onClick={startCamera}>
              📷 Activar cámara
            </PaperButton>
          ) : (
            <PaperButton variant="kraft" onClick={stopCamera}>
              ⏹ Detener cámara
            </PaperButton>
          )}

          <button
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-earth/60 bg-cream px-4 py-2 text-xs font-bold text-ink hover:bg-kraft/20 active:scale-95"
          >
            <Scale className="h-4 w-4" />
            Declarar Pesaje en Balanza
          </button>
        </div>

        {/* Feedback interactivo */}
        {feedback && (
          <div
            className={`rounded-2xl border-2 p-3 text-center transition-all ${
              feedback.tipo === "ok"
                ? "border-primary bg-primary/10 text-primary"
                : "border-destructive bg-destructive/10 text-destructive"
            }`}
          >
            <p className="font-extrabold text-sm">{feedback.titulo}</p>
            <p className="text-xs text-earth">{feedback.detalle}</p>
            {feedback.hash && (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Hash de Seguridad: {feedback.hash} (Certificado)
              </p>
            )}
          </div>
        )}
      </PaperCard>

      {/* Simulator / Test QRs Section */}
      <PaperCard variant="kraft" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">Tus puntos acumulados</p>
            <p className="display text-3xl">{user?.puntos ?? 0} pts</p>
          </div>
          <PaperTape color="leaf">Escáner Activo</PaperTape>
        </div>

        <div className="border-t border-kraft/40 pt-3">
          <p className="mb-2 text-xs font-bold text-earth">
            ¿Sin cámara o probando en el aula? Generá un depósito simulado verificado:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCode(`KV|pet-${Date.now()}|Botella PET (+0.8kg)|50`)}
              className="rounded-xl border border-primary/50 bg-cream px-3 py-1.5 text-xs font-bold text-ink shadow-xs transition hover:bg-primary/15 active:scale-95"
            >
              🧴 Botella PET (+50 pts / ~1 kg)
            </button>
            <button
              type="button"
              onClick={() => handleCode(`KV|carton-${Date.now()}|Cartón Compacto (+1.5kg)|30`)}
              className="rounded-xl border border-primary/50 bg-cream px-3 py-1.5 text-xs font-bold text-ink shadow-xs transition hover:bg-primary/15 active:scale-95"
            >
              📦 Caja de Cartón (+30 pts)
            </button>
            <button
              type="button"
              onClick={() => handleCode(`KV|aluminio-${Date.now()}|Lata Aluminio (+0.5kg)|40`)}
              className="rounded-xl border border-primary/50 bg-cream px-3 py-1.5 text-xs font-bold text-ink shadow-xs transition hover:bg-primary/15 active:scale-95"
            >
              🥫 Lata Aluminio (+40 pts)
            </button>
          </div>
        </div>
      </PaperCard>

      {/* Historial de Entregas del Alumno */}
      <PaperCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <History className="h-5 w-5" />
          <h2 className="display text-2xl text-ink">Historial de Depósitos y Certificados</h2>
        </div>

        {misEntregas.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aún no registraste entregas de reciclaje.</p>
        ) : (
          <div className="space-y-2">
            {misEntregas.map((ent) => (
              <div
                key={ent.id}
                className="flex items-center justify-between rounded-xl border border-kraft/40 bg-card p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-ink">
                    {ent.tipoPlastico} · {ent.pesoKg} kg ({ent.puntosOtorgados} pts)
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {ent.fecha} · Token: <code className="font-mono">{ent.hashToken}</code>
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                    ent.estado === "validada" ? "bg-primary/15 text-primary" : "bg-sun/30 text-ink"
                  }`}
                >
                  {ent.estado === "validada" ? "✓ Certificada" : "⏳ Pend. Balanza"}
                </span>
              </div>
            ))}
          </div>
        )}
      </PaperCard>

      {/* Modal Declaración de Pesaje Manual */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs">
          <PaperCard className="relative w-full max-w-sm space-y-4 p-6 shadow-2xl">
            <h3 className="display text-2xl font-bold text-ink">Registrar Pesaje en Balanza</h3>
            <p className="text-xs text-muted-foreground">
              Para entregas grupales o fardos de plástico en la escuela que requieren validación
              docente.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-earth mb-1">
                  Tipo de Polímero / Material
                </label>
                <select
                  value={manualMaterial}
                  onChange={(e) =>
                    setManualMaterial(e.target.value as "PET" | "PEAD" | "Cartón" | "Aluminio")
                  }
                  className="w-full rounded-xl border border-kraft/60 bg-cream p-2 text-xs font-bold text-ink"
                >
                  <option value="PET">Plástico PET (Botellas)</option>
                  <option value="PEAD">Plástico PEAD (Envases rígidos)</option>
                  <option value="Cartón">Cartón y Papel</option>
                  <option value="Aluminio">Latas de Aluminio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-earth mb-1">
                  Peso Estimado (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={manualPeso}
                  onChange={(e) => setManualPeso(e.target.value)}
                  className="w-full rounded-xl border border-kraft/60 bg-cream p-2 text-xs font-bold text-ink"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <PaperButton variant="leaf" type="submit" className="flex-1">
                  Enviar a Balanza
                </PaperButton>
                <PaperButton variant="ghost" onClick={() => setShowManualModal(false)}>
                  Cancelar
                </PaperButton>
              </div>
            </form>
          </PaperCard>
        </div>
      )}
    </div>
  );
}
