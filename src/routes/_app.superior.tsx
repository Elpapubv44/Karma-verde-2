import { createFileRoute, Outlet } from "@tanstack/react-router";
import { guardRol } from "@/lib/guard";

export const Route = createFileRoute("/_app/superior")({
  beforeLoad: () => guardRol("superior"),
  component: () => <Outlet />,
});
