import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { getActiveUser } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = getActiveUser();
    if (!user) throw redirect({ to: "/" });
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
