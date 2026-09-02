import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaperCard, PaperTape, PaperButton } from "@/components/paper/Paper";
import {
  ASOCIADO_CODE,
  CREATOR_CODE,
  SUPERIOR_CODE,
  actualizarSystemFlags,
  crearAnuncio,
  eliminarAnuncio,
  useStore,
} from "@/lib/store";
import {
  ShieldAlert,
  KeyRound,
  Sliders,
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/superior/config")({
  component: SuperiorConfig,
});

export function SuperiorConfig() {
  const [reveal, setReveal] = useState(false);
  const systemFlags = useStore((s) => s.systemFlags);
  const anuncios = useStore((s) => s.anuncios || []);
  const user = useStore((s) => s.user);

  // New Announcement Form State
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [esImportante, setEsImportante] = useState(false);

  const handleToggle = (key: keyof typeof systemFlags, val: boolean) => {
    actualizarSystemFlags({ [key]: val });
    toast.success("Ajuste de sistema actualizado");
  };

  const handleMaxScansChange = (val: number) => {
    actualizarSystemFlags({ maxScansPerDay: val });
    toast.success(`Límite diario fijado en ${val} escaneos`);
  };

  const handleCrearAnuncio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoMensaje.trim()) {
      toast.error("Por favor completá título y mensaje");
      return;
    }

    crearAnuncio({
      titulo: nuevoTitulo.trim(),
      mensaje: nuevoMensaje.trim(),
      importante: esImportante,
      autor: user?.nombre ?? "Dirección",
    });

    setNuevoTitulo("");
    setNuevoMensaje("");
    setEsImportante(false);
    toast.success("¡Anuncio publicado en el panel escolar!");
  };

  return (
    <div className="space-y-6">
      <PaperCard variant="kraft" className="p-6">
        <div className="flex items-center gap-2">
          <PaperTape color="sun">Administración Central</PaperTape>
        </div>
        <h1 className="display text-3xl mt-2 text-ink">Ajustes Globales y Banderas del Sistema</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configurá los permisos, límites y avisos oficiales para toda la red escolar de Karmaverde.
        </p>
      </PaperCard>

      {/* Feature Flags */}
      <PaperCard className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-ink">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="display text-2xl">Banderas de Funcionalidad (Feature Flags)</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-4 cursor-pointer hover:border-primary transition">
            <div>
              <span className="text-sm font-extrabold text-ink block">Escáner QR de Alumnos</span>
              <span className="text-xs text-muted-foreground">
                Habilita el escaneo de plásticos en la app del alumno
              </span>
            </div>
            <input
              type="checkbox"
              checked={systemFlags?.allowQrScanning ?? true}
              onChange={(e) => handleToggle("allowQrScanning", e.target.checked)}
              className="h-5 w-5 accent-primary cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-4 cursor-pointer hover:border-primary transition">
            <div>
              <span className="text-sm font-extrabold text-ink block">Canje de Premios</span>
              <span className="text-xs text-muted-foreground">
                Permite generar nuevos vouchers con puntos escolares
              </span>
            </div>
            <input
              type="checkbox"
              checked={systemFlags?.allowVoucherRedemption ?? true}
              onChange={(e) => handleToggle("allowVoucherRedemption", e.target.checked)}
              className="h-5 w-5 accent-primary cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-4 cursor-pointer hover:border-primary transition">
            <div>
              <span className="text-sm font-extrabold text-ink block">Registro Abierto</span>
              <span className="text-xs text-muted-foreground">
                Acepta nuevos alumnos y asociados en el portal
              </span>
            </div>
            <input
              type="checkbox"
              checked={systemFlags?.allowRegistration ?? true}
              onChange={(e) => handleToggle("allowRegistration", e.target.checked)}
              className="h-5 w-5 accent-primary cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-4 cursor-pointer hover:border-primary transition">
            <div>
              <span className="text-sm font-extrabold text-ink block text-destructive">
                Modo Mantenimiento
              </span>
              <span className="text-xs text-muted-foreground">
                Pausa la plataforma con aviso restrictivo temporal
              </span>
            </div>
            <input
              type="checkbox"
              checked={systemFlags?.maintenanceMode ?? false}
              onChange={(e) => handleToggle("maintenanceMode", e.target.checked)}
              className="h-5 w-5 accent-destructive cursor-pointer"
            />
          </label>
        </div>

        {/* Max Scans Per Day */}
        <div className="rounded-2xl bg-cream border border-kraft/50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-sm font-extrabold text-ink block">
              Límite Diario de Escaneos por Alumno
            </span>
            <span className="text-xs text-muted-foreground">
              Previene abusos y duplicación accidental de reciclajes
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[5, 10, 20, 50].map((limite) => (
              <button
                key={limite}
                onClick={() => handleMaxScansChange(limite)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                  systemFlags?.maxScansPerDay === limite
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-white border border-kraft text-earth hover:bg-kraft/20"
                }`}
              >
                {limite} / día
              </button>
            ))}
          </div>
        </div>
      </PaperCard>

      {/* Anuncios Escolares Manager */}
      <PaperCard className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-ink">
            <Megaphone className="h-5 w-5 text-primary" />
            <h2 className="display text-2xl">Tablón de Anuncios Escolares</h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {anuncios.length} publicado(s)
          </span>
        </div>

        {/* Formulario Crear Anuncio */}
        <form
          onSubmit={handleCrearAnuncio}
          className="rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-4 space-y-3"
        >
          <p className="text-xs font-extrabold uppercase tracking-wider text-earth">
            Publicar Nuevo Aviso para la Comunidad
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Título del anuncio (ej: Gran Campaña de PET)"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              className="rounded-xl border-2 border-kraft/60 bg-white px-3 py-2 text-xs font-semibold text-ink outline-none focus:border-primary"
            />
            <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer px-2">
              <input
                type="checkbox"
                checked={esImportante}
                onChange={(e) => setEsImportante(e.target.checked)}
                className="h-4 w-4 accent-sun"
              />
              <span>Marcar como anuncio Destacado / Importante</span>
            </label>
          </div>

          <textarea
            placeholder="Mensaje o detalles de la campaña ecológica escolar..."
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            rows={2}
            className="w-full rounded-xl border-2 border-kraft/60 bg-white p-3 text-xs font-semibold text-ink outline-none focus:border-primary"
          />

          <div className="flex justify-end">
            <PaperButton variant="leaf" type="submit" className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Publicar Anuncio
            </PaperButton>
          </div>
        </form>

        {/* Lista de Anuncios Existentes */}
        <div className="space-y-2 pt-2">
          {anuncios.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-kraft/60 bg-card p-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                      a.importante ? "bg-sun text-ink" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {a.importante ? "★ Importante" : "Informativo"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" /> {a.fecha}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-ink">{a.titulo}</h4>
                <p className="text-xs text-earth mt-0.5">{a.mensaje}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Autor: {a.autor}</p>
              </div>

              <button
                onClick={() => {
                  eliminarAnuncio(a.id);
                  toast.success("Anuncio eliminado");
                }}
                className="grid h-8 w-8 place-items-center rounded-xl text-destructive hover:bg-destructive/10 transition shrink-0"
                title="Eliminar anuncio"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </PaperCard>

      {/* Códigos de Acceso Maestro */}
      <PaperCard className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="display text-2xl">Códigos de Registro Autorizado</h2>
          </div>
          <button
            onClick={() => setReveal((r) => !r)}
            className="flex items-center gap-1.5 rounded-full border-2 border-kraft bg-cream px-3 py-1.5 text-xs font-extrabold text-ink hover:bg-kraft/20 transition active:scale-95"
          >
            {reveal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{reveal ? "Ocultar" : "Mostrar Códigos"}</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Compartí estos tokens de seguridad exclusivamente con personal directivo, docentes
          creadores y cooperativas asociadas.
        </p>

        {reveal && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-2xl border-2 border-kraft/60 bg-cream p-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-earth block">
                Rol Creador
              </span>
              <code className="text-sm font-black font-mono text-primary block mt-1">
                {CREATOR_CODE}
              </code>
            </div>
            <div className="rounded-2xl border-2 border-kraft/60 bg-cream p-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-earth block">
                Rol Asociado / Cooperativa
              </span>
              <code className="text-sm font-black font-mono text-primary block mt-1">
                {ASOCIADO_CODE}
              </code>
            </div>
            <div className="rounded-2xl border-2 border-kraft/60 bg-cream p-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-earth block">
                Rol Superior / Admin
              </span>
              <code className="text-sm font-black font-mono text-primary block mt-1">
                {SUPERIOR_CODE}
              </code>
            </div>
          </div>
        )}
      </PaperCard>
    </div>
  );
}
