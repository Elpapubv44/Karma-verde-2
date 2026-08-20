import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="paper-grain flex min-h-screen items-center justify-center px-4">
      <div className="paper-card max-w-md p-8 text-center tilt-l">
        <h1 className="display text-7xl text-primary">404</h1>
        <h2 className="mt-2 text-xl font-bold">Este recorte no existe</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscás no está pegada en ningún tablón.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cutout)] active-pop"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="paper-grain flex min-h-screen items-center justify-center px-4">
      <div className="paper-card max-w-md p-8 text-center">
        <h1 className="display text-3xl">Se despegó una hoja</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo salió mal. Podés reintentar o volver al inicio.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cutout)] active-pop"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="rounded-full border-2 border-kraft bg-cream px-5 py-2 text-sm font-bold text-ink"
          >
            Inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Karmaverde — Reciclá con tu escuela" },
      {
        name: "description",
        content:
          "Karmaverde es la app papercraft de reciclaje escolar: sumá puntos, canjeá premios y seguí el viaje de los materiales.",
      },
      { name: "author", content: "Karmaverde" },
      { property: "og:title", content: "Karmaverde — Reciclá con tu escuela" },
      {
        property: "og:description",
        content: "Puntos verdes, ranking, catálogo de premios y educación ambiental para escuelas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#5a8a5c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
        crossOrigin: "",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Caveat:wght@500;700&family=Nunito:wght@400;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
