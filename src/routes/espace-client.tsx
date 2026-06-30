import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ClientLayout } from "@/components/client/ClientLayout";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/espace-client")({
  beforeLoad: async ({ location }) => {
    if (typeof sessionStorage === "undefined") {
      throw redirect({ to: "/connexion" });
    }
    const stored = sessionStorage.getItem("jc_client_user");
    if (stored) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({ to: "/connexion" });
    }
  },
  component: EspaceClientLayout,
});

function EspaceClientLayout() {
  return (
    <ClientLayout>
      <Outlet />
    </ClientLayout>
  );
}
