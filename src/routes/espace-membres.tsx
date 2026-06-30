import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { MembresLayout } from "@/components/membres/MembresLayout";
import { MembreAuthProvider } from "@/lib/auth-membres";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/espace-membres")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/espace-membres/login") return;
    if (typeof sessionStorage === "undefined") {
      throw redirect({ to: "/espace-membres/login" });
    }
    const stored = sessionStorage.getItem("jc_membre");
    if (stored) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw redirect({ to: "/espace-membres/login" });
    }
  },
  component: EspaceMembresLayout,
});

function EspaceMembresLayout() {
  return (
    <MembreAuthProvider>
      <MembresLayout>
        <Outlet />
      </MembresLayout>
    </MembreAuthProvider>
  );
}
