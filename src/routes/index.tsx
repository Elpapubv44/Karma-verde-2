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
} from "lucide-react";

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
  const [escuela, setEscuela] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.navigate({ to: ROL_HOME[currentUser.rol] });
    }
  }, [currentUser, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        const res = await login(email, password, rol);
        if (!res.ok) {
          setError(res.error);
        } else {
          router.navigate({ to: ROL_HOME[res.user.rol] });
        }
      } else {
        const res = await register({
          nombre,
          email,
          password,
          rol,
          escuela,
          codigoCreador: codigo,
        });
        if (!res.ok) {
          setError(res.error);
        } else {
          router.navigate({ to: ROL_HOME[res.user.rol] });
        }
      }
    } finally {
      setLoading(false);
    }
  }

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
                  {tab === "login" ? "Acceso directo disponible" : "Registro"}
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
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2.5 text-center transition-all ${
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

            {error && (
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
                      className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary"
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
                    className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

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
                        className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary"
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
                          className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-3 py-2.5 pl-9 text-sm text-ink outline-none transition-colors focus:border-primary font-mono"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <PaperButton type="submit" disabled={loading} className="w-full justify-center mt-2">
                {loading
                  ? "Procesando..."
                  : tab === "login"
                    ? "Ingresar al panel"
                    : "Crear mi cuenta"}
                <ArrowRight className="h-4 w-4" />
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
    </div>
  );
}
