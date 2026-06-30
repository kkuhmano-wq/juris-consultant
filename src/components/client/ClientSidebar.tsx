import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FolderOpen, FileText, User, LogOut, Scale, ChevronLeft, CalendarDays } from "lucide-react";
import { useAuth } from "@/lib/client-auth";

const nav = [
  { to: "/espace-client", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/espace-client/dossiers", icon: FolderOpen, label: "Mes dossiers" },
  { to: "/espace-client/documents", icon: FileText, label: "Mes documents" },
  { to: "/espace-client/rendez-vous", icon: CalendarDays, label: "Rendez-vous" },
  { to: "/espace-client/profil", icon: User, label: "Mon profil" },
];

export function ClientSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Scale className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-tight text-ink">
              JurisConsultants
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Espace Client
            </span>
          </div>
          <button onClick={onClose} className="ml-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary lg:hidden">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.6} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.6} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
