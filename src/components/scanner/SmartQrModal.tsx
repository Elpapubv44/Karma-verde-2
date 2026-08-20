import { useState, useEffect } from "react";
import { PaperCard, PaperButton } from "@/components/paper/Paper";
import {
  Sparkles,
  Globe,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  Leaf,
  Lightbulb,
  Check,
} from "lucide-react";
import { generateLocalAnalysis } from "@/lib/gemini-qr-analyzer";

export interface QrIntelligenceResult {
  objeto: string;
  origen: string;
  tipoMaterial: string;
  reciclabilidad: string;
  descripcion: string;
  impactoEstimado: string;
  consejo: string;
}

interface SmartQrModalProps {
  code: string | null;
  onClose: () => void;
  onConfirmCanje?: () => void;
}

export function SmartQrModal({ code, onClose, onConfirmCanje }: SmartQrModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<QrIntelligenceResult | null>(null);
  const [isAiPowered, setIsAiPowered] = useState(false);

  useEffect(() => {
    if (!code) {
      setData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    async function analyze() {
      try {
        const res = await fetch("/api/analyze-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.analysis) {
            setData(json.analysis);
            setIsAiPowered(json.source === "gemini");
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("API request failed, using local analyzer fallback:", err);
      }

      // Fallback local
      if (isMounted && code) {
        setData(generateLocalAnalysis(code));
        setIsAiPowered(false);
        setLoading(false);
      }
    }

    void analyze();

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (!code) return null;

  const isUrl = code.startsWith("http://") || code.startsWith("https://");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <PaperCard className="relative w-full max-w-lg overflow-hidden p-6 shadow-2xl space-y-4 border-2 border-primary/40 bg-cream">
        {/* Header con insignia de IA */}
        <div className="flex items-start justify-between gap-2 border-b border-kraft/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="display text-xl font-bold text-ink leading-tight">
                  Investigador Inteligente de QR
                </h3>
                {isAiPowered ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-black text-primary uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> Gemini AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-kraft/40 px-2 py-0.5 text-[10px] font-black text-ink uppercase tracking-wider">
                    Análisis Directo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Decodificación y análisis en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-kraft/30 hover:text-ink transition"
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Contenido decodificado */}
        <div className="rounded-xl border border-kraft/60 bg-white/70 p-3 text-xs font-mono break-all text-ink/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isUrl ? (
              <Globe className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <ShieldCheck className="h-4 w-4 shrink-0 text-earth" />
            )}
            <span className="line-clamp-1">{code}</span>
          </div>
          {isUrl && (
            <a
              href={code}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
            >
              Visitar <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="py-8 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs font-bold text-earth animate-pulse">
              Investigando procedencia, propiedades del material e impacto ambiental...
            </p>
          </div>
        )}

        {/* Resultado del análisis */}
        {!loading && data && (
          <div className="space-y-3.5 text-xs text-ink">
            {/* Tarjeta de identificación principal */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    Objeto / Contenido
                  </span>
                  <h4 className="text-base font-black text-ink">{data.objeto}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-earth">
                    Reciclabilidad
                  </span>
                  <p className="font-bold text-primary">{data.reciclabilidad}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/20 text-[11px]">
                <div>
                  <span className="font-bold text-earth">Origen:</span> {data.origen}
                </div>
                <div>
                  <span className="font-bold text-earth">Material:</span> {data.tipoMaterial}
                </div>
              </div>
            </div>

            {/* Explicación / Descripción contextual */}
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-earth flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-primary" /> ¿Qué es lo que estás escaneando?
              </p>
              <p className="rounded-xl border border-kraft/40 bg-white/50 p-3 leading-relaxed text-ink/90">
                {data.descripcion}
              </p>
            </div>

            {/* Impacto ecológico */}
            <div className="rounded-xl border border-leaf/40 bg-leaf/10 p-3 flex items-start gap-2.5">
              <Leaf className="h-4 w-4 shrink-0 text-leaf mt-0.5" />
              <div>
                <p className="font-bold text-[11px] text-leaf">Impacto Ambiental Asociado</p>
                <p className="text-[11px] text-ink/90 mt-0.5">{data.impactoEstimado}</p>
              </div>
            </div>

            {/* Consejo práctico */}
            <div className="rounded-xl border border-sun/50 bg-sun/15 p-3 flex items-start gap-2.5">
              <Lightbulb className="h-4 w-4 shrink-0 text-earth mt-0.5" />
              <div>
                <p className="font-bold text-[11px] text-earth">Recomendación para el Alumno</p>
                <p className="text-[11px] text-ink/90 mt-0.5">{data.consejo}</p>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-kraft/60">
          <PaperButton variant="ghost" onClick={onClose}>
            Cerrar
          </PaperButton>
          {onConfirmCanje && (
            <PaperButton
              variant="leaf"
              onClick={onConfirmCanje}
              className="inline-flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" /> Procesar Depósito
            </PaperButton>
          )}
        </div>
      </PaperCard>
    </div>
  );
}
