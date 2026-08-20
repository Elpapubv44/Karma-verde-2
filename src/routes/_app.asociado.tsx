import { createFileRoute, Outlet } from "@tanstack/react-router";
import { guardRol } from "@/lib/guard";

export const Route = createFileRoute("/_app/asociado")({
  beforeLoad: () => guardRol("asociado"),
  component: () => <Outlet />,
});
