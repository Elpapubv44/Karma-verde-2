import { useState, useEffect, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useStore, logout, ROL_LABEL } from "@/lib/store";
import type { Rol } from "@/lib/types";
import { DossierModal } from "@/components/dossier/ProjectDossier";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  Leaf,
  MapPin,
  QrCode,
  Trophy,
  Gift,
  Truck,
  BookOpen,
  LayoutDashboard,
  Users,
  Settings,
  Puzzle,
  ClipboardList,
  GraduationCap,
  Sparkles,
  LogOut,
  FileText,
  User as UserIcon,
  Sun,
  Moon,
  WifiOff,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const alumnoNav: NavItem[] = [
  { to: "/alumno", label: "Inicio", icon: Leaf },
  { to: "/alumno/mapa", label: "Mapa", icon: MapPin },
  { to: "/alumno/escaner", label: "Escanear", icon: QrCode },
  { to: "/alumno/ranking", label: "Ranking", icon: Trophy },
  { to: "/alumno/premios", label: "Premios", icon: Gift },
  { to: "/alumno/viaje", label: "Viaje", icon: Truck },
  { to: "/alumno/aprende", label: "Aprende", icon: Sparkles },
];

const creadorNav: NavItem[] = [
  { to: "/creador", label: "Panel", icon: LayoutDashboard },
  { to: "/creador/premios", label: "Premios", icon: Gift },
  { to: "/creador/educacion", label: "Educación", icon: BookOpen },
  { to: "/creador/circuito", label: "Circuito", icon: Truck },
  { to: "/creador/ranking", label: "Ranking", icon: Trophy },
];

const superiorNav: NavItem[] = [
  { to: "/superior", label: "Global", icon: LayoutDashboard },
  { to: "/superior/usuarios", label: "Usuarios", icon: Users },
  { to: "/superior/modulos", label: "Módulos", icon: Puzzle },
  { to: "/superior/config", label: "Ajustes", icon: Settings },
];

const asociadoNav: NavItem[] = [
  { to: "/asociado", label: "Tareas", icon: ClipboardList },
  { to: "/asociado/escuelas", label: "Escuelas", icon: GraduationCap },
  { to: "/asociado/logistica", label: "Logística", icon: Truck },
];

const navByRol: Record<Rol, NavItem[]> = {
  alumno: alumnoNav,
  creador: creadorNav,
  superior: superiorNav,
  asociado: asociadoNav,
};

const homeByRol: Record<Rol, string> = {
  alumno: "/alumno",
  creador: "/creador",
  superior: "/superior",
  asociado: "/asociado",
};

export function AppShell({ children }: { children: ReactNode }) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const [dossierOpen, setDossierOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Dark mode init
    const savedTheme = localStorage.getItem("karmaverde-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Network status
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("karmaverde-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("karmaverde-theme", "light");
    }
  };

  if (!user) return null;
  const nav = navByRol[user.rol] ?? alumnoNav;
  const home = homeByRol[user.rol] ?? "/alumno";

  return (
    <div className="paper-grain min-h-screen pb-24">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground px-4 py-1.5 text-center text-xs font-black flex items-center justify-center gap-2">
          <WifiOff className="h-3.5 w-3.5" />
          <span>
            Modo Offline: Podés seguir usando la app; las acciones se sincronizarán al recuperar la
            conexión.
          </span>
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b-2 border-dashed border-kraft/50 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to={home} className="group flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-cutout)] transition-transform group-hover:rotate-6">
              <Leaf className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="display truncate text-2xl font-bold leading-none text-ink">
                Karmaverde
              </p>
              <p className="truncate text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {ROL_LABEL[user.rol]}
                {user.escuela ? ` · ${user.escuela}` : ""}
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-kraft/60 bg-cream text-ink hover:bg-kraft/20 transition active:scale-95"
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              aria-label="Cambiar tema de color"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-sun" />
              ) : (
                <Moon className="h-4 w-4 text-earth" />
              )}
            </button>

            {/* Dossier button */}
            <button
              onClick={() => setDossierOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
              title="Ver informe técnico y documentación para imprimir"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dossier / PDF Clase</span>
              <span className="sm:hidden">Dossier</span>
            </button>

            {/* Points pill with animated counter */}
            {user.rol === "alumno" && (
              <span className="hidden items-center gap-1.5 rounded-full border border-kraft/40 bg-sun/20 px-3 py-1 text-xs font-black text-ink shadow-xs md:inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-earth" />
                <AnimatedCounter value={user.puntos} suffix=" pts" />
              </span>
            )}

            {/* User profile button */}
            <button
              onClick={() => setProfileOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-earth bg-cream px-3 py-1.5 text-xs font-extrabold text-ink transition-colors hover:bg-kraft/20 active:scale-95"
              title="Ver y editar mi perfil"
            >
              <span className="text-sm">{user.avatar ?? "🌱"}</span>
              <span className="hidden sm:inline">{user.nombre.split(" ")[0]}</span>
            </button>

            <button
              onClick={() => {
                logout();
                router.navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-kraft/60 bg-cream px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-kraft/20 active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5 text-earth" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>

      <DossierModal isOpen={dossierOpen} onClose={() => setDossierOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-dashed border-kraft/50 bg-cream/95 backdrop-blur">
        <ul className="mx-auto flex max-w-5xl items-stretch justify-around gap-1 overflow-x-auto px-2 py-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to} className="shrink-0">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === home }}
                  activeProps={{
                    className: "!bg-primary !text-primary-foreground shadow-sm -translate-y-0.5",
                  }}
                  className="flex min-w-[62px] flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5"
                >
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
