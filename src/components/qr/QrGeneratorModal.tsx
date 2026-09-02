import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import { useStore } from "@/lib/store";
import { X, Printer, Download, QrCode, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

interface QrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QrGeneratorModal({ isOpen, onClose }: QrGeneratorModalProps) {
  const puntos = useStore((s) => s.puntosVerdes);
  const user = useStore((s) => s.user);

  const [material, setMaterial] = useState("PET");
  const [puntosOtorgados, setPuntosOtorgados] = useState(50);
  const [puntoVerdeId, setPuntoVerdeId] = useState(puntos[0]?.id ?? "pv1");
  const [pesoEstimado, setPesoEstimado] = useState(1.0);
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const puntoSeleccionado = puntos.find((p) => p.id === puntoVerdeId) ?? puntos[0];

  // Cryptographic simulated signature format matching src/lib/qr.ts:
  // KV:material:puntos:timestamp:signature
  const timestamp = Date.now();
  const rawData = `KV:${material}:${puntosOtorgados}:${timestamp}:${Math.random().toString(36).substring(2, 8)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR-Karmaverde-${material}-${puntoSeleccionado?.escuela.replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Código QR SVG descargado");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawData);
    setCopied(true);
    toast.success("Código alfanumérico copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <PaperCard className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto p-5 sm:p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-kraft bg-cream text-ink hover:bg-kraft/20 transition"
          aria-label="Cerrar modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <PaperTape color="sun">Herramienta Creador</PaperTape>
        </div>
        <h2 className="display text-2xl text-ink">Generador de QR Escolar</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Generá e imprimí códigos QR oficiales para los contenedores y campañas de reciclaje.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1">
                Tipo de Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="PET">Plástico PET (Botellas)</option>
                <option value="PEAD">Plástico PEAD (Tapas/Shampoo)</option>
                <option value="PEBD">Plástico PEBD (Bolsas/Film)</option>
                <option value="Cartón">Cartón y Papel</option>
                <option value="Aluminio">Latas de Aluminio</option>
                <option value="Vidrio">Frascos de Vidrio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1">
                Puntos Otorgados
              </label>
              <input
                type="number"
                min={10}
                max={500}
                step={5}
                value={puntosOtorgados}
                onChange={(e) => setPuntosOtorgados(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1">
                Punto Verde Destino
              </label>
              <select
                value={puntoVerdeId}
                onChange={(e) => setPuntoVerdeId(e.target.value)}
                className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              >
                {puntos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.escuela})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-kraft/60 bg-card p-2 text-xs font-bold text-earth hover:bg-kraft/15 transition"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <QrCode className="h-3.5 w-3.5" />
                )}
                {copied ? "¡Código Copiado!" : "Copiar Token QR"}
              </button>
            </div>
          </div>

          {/* Printable Preview Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-earth bg-cream p-4 text-center shadow-xs">
            <div className="mb-2">
              <span className="display text-sm font-black text-primary uppercase tracking-wide">
                Karmaverde
              </span>
              <p className="text-[10px] font-bold text-earth">{puntoSeleccionado?.escuela}</p>
            </div>

            <div ref={qrRef} className="rounded-xl border-2 border-kraft bg-white p-2.5 shadow-xs">
              <QRCodeSVG value={rawData} size={140} level="H" includeMargin={false} />
            </div>

            <div className="mt-2.5">
              <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-black text-primary">
                +{puntosOtorgados} pts · {material}
              </span>
              <p className="mt-1 text-[9px] text-muted-foreground font-mono truncate max-w-[180px]">
                {rawData}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 mt-5 border-t-2 border-dashed border-kraft/40 pt-3">
          <PaperButton variant="cream" onClick={handleDownload} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Descargar SVG</span>
          </PaperButton>
          <PaperButton variant="leaf" onClick={handlePrint} className="gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir Cartel</span>
          </PaperButton>
        </div>
      </PaperCard>
    </div>
  );
}
