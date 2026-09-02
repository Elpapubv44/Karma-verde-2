import { useState } from "react";
import { useStore, actualizarPerfil, cambiarPassword } from "@/lib/store";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import {
  User,
  Shield,
  Award,
  History,
  CheckCircle2,
  X,
  KeyRound,
  Sparkles,
  QrCode,
  Gift,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARES = [
  { id: "🌱", label: "Brote Verde" },
  { id: "🦊", label: "Zorro Guardián" },
  { id: "🦜", label: "Colibrí" },
  { id: "🌳", label: "Árbol Sabio" },
  { id: "💧", label: "Gota Pura" },
  { id: "🐝", label: "Abejita Eco" },
  { id: "🦔", label: "Erizo Forestal" },
  { id: "🦉", label: "Búho Vigía" },
];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const user = useStore((s) => s.user);
  const entregas = useStore((s) => s.entregas);
  const tickets = useStore((s) => s.tickets);
  const quizzesCompletados = useStore((s) => s.quizzesCompletados);
  const historialQr = useStore((s) => s.historialQr || []);

  const [tab, setTab] = useState<"perfil" | "seguridad" | "logros" | "historial">("perfil");

  // Perfil form state
  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [escuela, setEscuela] = useState(user?.escuela ?? "");
  const [curso, setCurso] = useState(user?.curso ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "🌱");

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen || !user) return null;

  const misEntregas = entregas.filter((e) => e.alumnoId === user.id);
  const misTickets = tickets.filter((t) => t.usuarioId === user.id);

  // Calculate achievements
  const logros = [
    {
      id: "primer_escaneo",
      titulo: "Primer Paso Verde",
      desc: "Realizaste tu primera entrega de material reciclable.",
      icono: "🌱",
      desbloqueado: misEntregas.length > 0 || historialQr.length > 0,
    },
    {
      id: "eco_master",
      titulo: "Eco-Máster",
      desc: "Superaste los 500 puntos ecológicos.",
      icono: "⭐",
      desbloqueado: (user.puntos ?? 0) >= 500,
    },
    {
      id: "eco_sabio",
      titulo: "Sabio del Reciclaje",
      desc: "Respondiste correctamente una trivia ambiental.",
      icono: "🎓",
      desbloqueado: quizzesCompletados.length > 0,
    },
    {
      id: "canjeador",
      titulo: "Recompensa Ganada",
      desc: "Canjeaste tu primer premio o voucher escolar.",
      icono: "🎁",
      desbloqueado: misTickets.length > 0 || (user.canjes ?? 0) > 0,
    },
    {
      id: "titan_ambiental",
      titulo: "Titán Ambiental",
      desc: "Alcanzaste 1.000 puntos o más en la plataforma.",
      icono: "🏆",
      desbloqueado: (user.puntos ?? 0) >= 1000,
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    actualizarPerfil({
      nombre: nombre.trim(),
      escuela: escuela.trim(),
      curso: curso.trim(),
      avatar,
    });
    toast.success("¡Perfil actualizado con éxito!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Completá todos los campos de contraseña");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden");
      return;
    }
    const res = cambiarPassword(oldPassword, newPassword);
    if (!res.ok) {
      toast.error(res.error || "Error al actualizar la contraseña");
      return;
    }
    toast.success("¡Contraseña actualizada correctamente!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <PaperCard className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-7 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-kraft bg-cream text-ink hover:bg-kraft/20 transition"
          aria-label="Cerrar modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sun/30 border-2 border-sun text-2xl shadow-xs">
            {avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="display text-2xl text-ink leading-tight">{user.nombre}</h2>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-black uppercase text-primary">
                {user.rol}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {user.escuela} {user.curso ? `· ${user.curso}` : ""}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1.5 border-b-2 border-dashed border-kraft/40 pb-3 mb-4">
          <button
            onClick={() => setTab("perfil")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
              tab === "perfil"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-cream text-earth hover:bg-kraft/20"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Mi Perfil</span>
          </button>
          <button
            onClick={() => setTab("logros")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
              tab === "logros"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-cream text-earth hover:bg-kraft/20"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>
              Logros ({logros.filter((l) => l.desbloqueado).length}/{logros.length})
            </span>
          </button>
          <button
            onClick={() => setTab("historial")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
              tab === "historial"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-cream text-earth hover:bg-kraft/20"
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Historial</span>
          </button>
          <button
            onClick={() => setTab("seguridad")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
              tab === "seguridad"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-cream text-earth hover:bg-kraft/20"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Seguridad</span>
          </button>
        </div>

        {/* TAB 1: PERFIL */}
        {tab === "perfil" && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1.5">
                Elegí tu Avatar Ecológico
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATARES.map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setAvatar(av.id)}
                    title={av.label}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition active:scale-95 ${
                      avatar === av.id
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-kraft/50 bg-cream hover:bg-kraft/20"
                    }`}
                  >
                    <span className="text-2xl">{av.id}</span>
                    <span className="text-[9px] font-bold text-earth truncate max-w-full">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-earth mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-earth mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-xl border-2 border-kraft/40 bg-muted/40 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-earth mb-1">
                  Escuela
                </label>
                <input
                  type="text"
                  value={escuela}
                  onChange={(e) => setEscuela(e.target.value)}
                  className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-earth mb-1">
                  Curso / División
                </label>
                <input
                  type="text"
                  value={curso}
                  placeholder="Ej: 4° Año B"
                  onChange={(e) => setCurso(e.target.value)}
                  className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <PaperButton variant="leaf" type="submit">
                Guardar Cambios
              </PaperButton>
            </div>
          </form>
        )}

        {/* TAB 2: LOGROS Y MEDALLAS */}
        {tab === "logros" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Completá acciones en la comunidad escolar para desbloquear insignias y reconocimientos
              verdes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {logros.map((l) => (
                <div
                  key={l.id}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-3 transition ${
                    l.desbloqueado
                      ? "border-primary/40 bg-primary/5 text-ink shadow-xs"
                      : "border-dashed border-kraft/40 bg-muted/20 opacity-60"
                  }`}
                >
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl border-2 ${
                      l.desbloqueado
                        ? "border-primary/50 bg-primary/10"
                        : "border-dashed border-kraft/60 bg-cream grayscale"
                    }`}
                  >
                    {l.icono}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-sm text-ink leading-tight">{l.titulo}</p>
                      {l.desbloqueado && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </div>
                    <p className="text-xs text-earth mt-0.5">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORIAL DE ACTIVIDAD */}
        {tab === "historial" && (
          <div className="space-y-4">
            {/* Escaneos / Entregas */}
            <div>
              <h3 className="display text-lg text-ink flex items-center gap-1.5 mb-2">
                <QrCode className="h-4 w-4 text-primary" />
                Historial de Reciclaje ({misEntregas.length + historialQr.length})
              </h3>
              {misEntregas.length === 0 && historialQr.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Aún no registraste entregas de material.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {misEntregas.map((ent) => (
                    <div
                      key={ent.id}
                      className="flex items-center justify-between rounded-xl border-2 border-dashed border-kraft/50 bg-cream p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-ink">{ent.tipoPlastico}</span>
                        <span className="text-muted-foreground ml-2">({ent.pesoKg} kg)</span>
                        <p className="text-[10px] text-earth font-mono">{ent.fecha}</p>
                      </div>
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 font-black text-primary">
                        +{ent.puntosOtorgados} pts
                      </span>
                    </div>
                  ))}
                  {historialQr.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-xl border-2 border-dashed border-kraft/50 bg-cream p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-ink">{h.material}</span>
                        <p className="text-[10px] text-earth font-mono">{h.fecha}</p>
                      </div>
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 font-black text-primary">
                        +{h.puntos} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vouchers canjeados */}
            <div>
              <h3 className="display text-lg text-ink flex items-center gap-1.5 mb-2">
                <Gift className="h-4 w-4 text-primary" />
                Vouchers Canjeados ({misTickets.length})
              </h3>
              {misTickets.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Aún no canjeaste ningún premio.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {misTickets.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-xl border-2 border-dashed border-kraft/50 bg-cream p-2.5 text-xs"
                    >
                      <div>
                        <p className="font-bold text-ink">{t.premioNombre}</p>
                        <p className="text-[10px] text-earth font-mono">
                          Cód: {t.codigoVoucher} · {t.fechaCanje}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                          t.estado === "entregado"
                            ? "bg-muted text-muted-foreground"
                            : "bg-sun text-ink"
                        }`}
                      >
                        {t.estado === "entregado" ? "Entregado" : "Por retirar"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SEGURIDAD (CAMBIO DE CONTRASEÑA) */}
        {tab === "seguridad" && (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Ingresá tu contraseña actual"
                className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 10 caracteres, mayúscula, minúscula, número y símbolo"
                className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-earth mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí la nueva contraseña"
                className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="rounded-xl bg-card p-3 text-[11px] text-earth space-y-1">
              <p className="font-bold text-ink flex items-center gap-1">
                <Lock className="h-3 w-3 text-primary" /> Requisitos de seguridad:
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Al menos 10 caracteres de longitud</li>
                <li>Al menos 1 mayúscula y 1 minúscula</li>
                <li>Al menos 1 número y 1 símbolo especial (!@#$...)</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <PaperButton variant="leaf" type="submit">
                Actualizar Contraseña
              </PaperButton>
            </div>
          </form>
        )}
      </PaperCard>
    </div>
  );
}
