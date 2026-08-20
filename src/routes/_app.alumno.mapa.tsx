import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { PaperCard } from "@/components/paper/Paper";

export const Route = createFileRoute("/_app/alumno/mapa")({
  component: MapaPage,
});

const MapView = lazy(() => import("@/components/map/MapView"));

function MapaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="display text-3xl text-ink">Mapa de puntos verdes</h1>
        <p className="text-sm text-muted-foreground">
          Escuelas participantes cerca tuyo. Tocá un punto para ver detalles.
        </p>
      </div>
      <PaperCard className="overflow-hidden p-0">
        <div className="h-[60vh] w-full">
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Cargando mapa…
              </div>
            }
          >
            <MapView />
          </Suspense>
        </div>
      </PaperCard>
    </div>
  );
}
