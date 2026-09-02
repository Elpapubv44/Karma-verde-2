import { useState, useEffect } from "react";
import { createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import {
  login,
  register,
  useStore,
  ROL_HOME,
  ROL_LABEL,
  validarPasswordFuerte,
  getActiveUser,
} from "@/lib/store";
import type { Rol } from "@/lib/types";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import {
  Leaf,
  Sparkles,
  QrCode,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  KeyRound,
  Loader2,
  HelpCircle,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = getActiveUser();
    if (user) {
      throw redirect({ to: ROL_HOME[user.rol] });
    }
  },
  component: LandingAuthPage,
});

const ROLES: Rol[] = ["alumno", "creador", "asociado", "superior"];

const ROLE_ICONS: Record<Rol, React.ComponentType<{ className?: string }>> = {
  alumno: GraduationCap,
  creador: Layers,
  asociado: Building2,
  superior: ShieldCheck,
};

function LandingAuthPage() {
  const currentUser = useStore((s) => s.user);
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [rol, setRol] = useState<Rol>("alumno");

  // Form states
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("sofia@escuela.edu.ar");
  const [password, setPassword] = useState("Password123!");
  const [showPassword, setShowPassword] = useState(false);
  const [escuela, setEscuela] = useState("");
  const [codigo, setCodigo] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Rate limiting (Issue #70)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Forgot password modal (Issue #24)
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.navigate({ to: ROL_HOME[currentUser.rol] });
    }
  }, [currentUser, router]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Calculate password strength for registration
  const passwordEval = validarPasswordFuerte(password) ?? {
    valida: false,
    error: "La contraseña debe tener al menos 10 caracteres.",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      toast.error(`Demasiados intentos. Esperá ${lockoutSeconds} segundos.`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        const res = await login(email.trim(), password, rol);
        if (!res.ok) {
          const nextFails = failedAttempts + 1;
          setFailedAttempts(nextFails);
          if (nextFails >= 5) {
            setLockoutSeconds(30);
            setError("Demasiados intentos fallidos. Por seguridad, esperá 30 segundos.");
            toast.error("Cuenta bloqueada temporalmente por 30 segundos.");
          } else {
            setError(res.error);
            toast.error(res.error);
          }
        } else {
          setFailedAttempts(0);
          toast.success(`¡Bienvenido/a, ${res.user.nombre}!`);
          router.navigate({ to: ROL_HOME[res.user.rol] });
        }
      } else {
        // Register validation
        if (!passwordEval?.valida) {
          const errMsg =
            passwordEval?.error ?? "La contraseña no cumple con los requisitos de seguridad.";
          setError(errMsg);
          toast.error(errMsg);
          return;
        }

        const res = await register({
          nombre: nombre.trim(),
          email: email.trim(),
          password,
          rol,
          escuela: escuela.trim(),
          codigoCreador: codigo.trim(),
        });

        if (!res.ok) {
          setError(res.error);
          toast.error(res.error);
        } else {
          toast.success("¡Cuenta creada con éxito!");
          router.navigate({ to: ROL_HOME[res.user.rol] });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast.error("Ingresá un correo electrónico válido.");
      return;
    }
    setForgotSent(true);
    toast.success("Enlace de recuperación enviado al correo.");
  };

  return (
    <div className="paper-grain min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero Paper Header */}
        <header className="paper-card paper-card-leaf tilt-l relative p-6 text-primary-foreground sm:p-10">
          <PaperTape color="sun" className="mb-4">
            Plataforma Eco-Educativa
          </PaperTape>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cream/20 shadow-xs backdrop-blur-xs">
                  <Leaf className="h-7 w-7 text-cream stroke-[2.5]" />
                </div>
                <h1 className="display text-4xl sm:text-5xl font-black tracking-tight">
                  Karmaverde
                </h1>
              </div>
              <p className="max-w-xl text-sm opacity-95 sm:text-base">
                Reciclá en tu escuela, escaneá códigos QR, acumulá puntos y canjeá premios
                ecológicos.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/30 bg-cream/15 px-3 py-1 text-xs font-bold shadow-xs">
                <QrCode className="h-3.5 w-3.5" /> QR Escolar
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/30 bg-cream/15 px-3 py-1 text-xs font-bold shadow-xs">
                <Award className="h-3.5 w-3.5" /> Premios
              </span>
            </div>
          </div>
        </header>

        {/* Auth Box */}
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          {/* Card Form */}
          <PaperCard variant="kraft" className="p-6 sm:p-8">
            <div className="mb-6 flex gap-2 rounded-2xl border-2 border-dashed border-kraft/60 bg-cream/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setError(null);
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  tab === "login"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-ink hover:bg-kraft/20"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-black uppercase tracking-wider transition-all ${
                  tab === "register"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-ink hover:bg-kraft/20"
                }`}
              >
                Registrarme
              </button>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-earth">
                  Elegí tu rol
                </label>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {tab === "login" ? "Cuentas de prueba listas" : "Registro de usuario"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ROLES.map((r) => {
                  const Icon = ROLE_ICONS[r];
                  const isSelected = rol === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRol(r);
                        setError(null);
                        if (tab === "login") {
                          if (r === "alumno") {
                            setEmail("sofia@escuela.edu.ar");
                            setPassword("Password123!");
                          } else if (r === "creador") {
                            setEmail("creador@karmaverde.org");
                            setPassword("Password123!");
                          } else if (r === "superior") {
                            setEmail("superior@karmaverde.org");
                            setPassword("Password123!");
                          } else if (r === "asociado") {
                            setEmail("logistica@verdesur.org");
                            setPassword("Password123!");
                          }
                        }
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2.5 text-center transition-all active:scale-95 ${
                        isSelected
                          ? "border-primary bg-primary/15 text-ink shadow-xs"
                          : "border-dashed border-kraft/60 bg-cream/80 text-muted-foreground hover:border-earth"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-earth"}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {ROL_LABEL[r]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {lockoutSeconds > 0 && (
              <div className="mb-4 rounded-xl border-2 border-destructive bg-destructive/10 p-3 text-xs font-bold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Bloqueo temporal por seguridad: reintentá en {lockoutSeconds} segundos.</span>
              </div>
            )}

            {error && !lockoutSeconds && (
              <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs font-bold text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Sofía Morales"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-earth">
                    Contraseña
                  </label>
                  {tab === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSent(false);
                        setForgotEmail(email);
                        setForgotModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 pr-10 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-ink"
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength indicator in register mode (Issue #71) */}
                {tab === "register" && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-kraft/30">
                      <div
                        className={`transition-all duration-300 ${
                          password.length < 6
                            ? "w-1/4 bg-destructive"
                            : password.length < 10
                              ? "w-2/4 bg-sun"
                              : passwordEval?.valida
                                ? "w-full bg-primary"
                                : "w-3/4 bg-sun"
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-earth">
                      {passwordEval?.valida ? (
                        <span className="text-primary font-bold">✓ Contraseña segura y fuerte</span>
                      ) : (
                        <span>
                          {passwordEval?.error ??
                            "Mínimo 10 caracteres con mayúscula, minúscula, número y símbolo."}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {tab === "login" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-kraft text-primary focus:ring-primary accent-primary"
                  />
                  <label htmlFor="remember-me" className="text-xs text-earth select-none font-bold">
                    Recordar mi sesión en este dispositivo
                  </label>
                </div>
              )}

              {tab === "register" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
                      {rol === "superior" ? "Organización / Institución" : "Escuela o Colegio"}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. Escuela N° 12 Eco"
                        value={escuela}
                        onChange={(e) => setEscuela(e.target.value)}
                        className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {rol !== "alumno" && (
                    <div>
                      <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
                        Código de acceso ({ROL_LABEL[rol]})
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          placeholder="Código de seguridad institucional"
                          value={codigo}
                          onChange={(e) => setCodigo(e.target.value)}
                          className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary font-mono focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <PaperButton
                type="submit"
                disabled={loading || lockoutSeconds > 0}
                className="w-full justify-center mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Conectando...</span>
                  </>
                ) : tab === "login" ? (
                  <>
                    <span>Ingresar al panel</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Crear mi cuenta</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </PaperButton>
            </form>
          </PaperCard>

          {/* Highlights & Info */}
          <div className="space-y-4">
            <PaperCard tilt="r" className="p-6">
              <h2 className="display text-2xl text-ink">¿Cómo funciona?</h2>
              <ul className="mt-4 space-y-3.5 text-sm text-ink">
                <li className="flex items-start gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wide text-earth">
                      1. Separá tus reciclables
                    </strong>
                    Papel, cartón, plástico y metal limpios y secos.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wide text-earth">
                      2. Escaneá en el Punto Verde
                    </strong>
                    Registrá el depósito con la cámara de tu celular.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wide text-earth">
                      3. Canjeá premios
                    </strong>
                    Sumá en el ranking de tu escuela y desbloqueá kits ecológicos.
                  </div>
                </li>
              </ul>
            </PaperCard>

            <PaperCard className="p-5 bg-leaf/10 border-leaf/30">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-ink">
                  Diseño sustentable pensado para escuelas y comunidades comprometidas con el
                  ambiente.
                </p>
              </div>
            </PaperCard>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Issue #24) */}
      {forgotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs"
        >
          <PaperCard className="relative w-full max-w-md p-6 shadow-2xl">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-kraft bg-cream text-ink hover:bg-kraft/20"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <PaperTape color="sun">Recuperación</PaperTape>
            </div>
            <h3 className="display text-xl text-ink">¿Olvidaste tu contraseña?</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Ingresá tu correo escolar o registrado. Te enviaremos instrucciones seguras para
              reestablecerla.
            </p>

            {forgotSent ? (
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                <p className="text-xs font-bold text-ink">¡Correo de recuperación enviado!</p>
                <p className="text-[11px] text-earth">
                  Revisá tu bandeja de entrada en <strong>{forgotEmail}</strong>.
                </p>
                <PaperButton
                  variant="leaf"
                  className="mt-2 w-full justify-center"
                  onClick={() => setForgotModalOpen(false)}
                >
                  Cerrar
                </PaperButton>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-earth mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-xl border-2 border-kraft/60 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <PaperButton
                    type="button"
                    variant="cream"
                    onClick={() => setForgotModalOpen(false)}
                  >
                    Cancelar
                  </PaperButton>
                  <PaperButton type="submit" variant="leaf">
                    Enviar Instrucciones
                  </PaperButton>
                </div>
              </form>
            )}
          </PaperCard>
        </div>
      )}
    </div>
  );
}
