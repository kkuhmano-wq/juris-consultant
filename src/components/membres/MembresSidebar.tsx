import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderOpen, BookOpen, Calendar,
  Mail, CheckSquare, Users, LogOut, Scale, ChevronLeft,
} from "lucide-react";
import { useMembreAuth, type Role } from "@/lib/auth-membres";

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  roles?: Role[];
}

const nav: NavItem[] = [
  { to: "/espace-membres", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/espace-membres/dossiers", icon: FolderOpen, label: "Dossiers" },
  { to: "/espace-membres/bibliotheque", icon: BookOpen, label: "Bibliothèque" },
  { to: "/espace-membres/agenda", icon: Calendar, label: "Agenda" },
  { to: "/espace-membres/messagerie", icon: Mail, label: "Messagerie" },
  { to: "/espace-membres/taches", icon: CheckSquare, label: "Tâches" },
  { to: "/espace-membres/administration", icon: Users, label: "Administration", roles: ["ADMIN"] },
];

export function MembresSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { membre, logout, hasRole } = useMembreAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0F1A2E] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4A843] text-[#0F1A2E]">
            <Scale className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-tight text-white">
              JurisConsultants
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4A843]">
              Espace Collaboratif
            </span>
          </div>
          <button onClick={onClose} className="ml-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10 lg:hidden">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {nav
            .filter((item) => !item.roles || hasRole(...item.roles))
            .map((item) => {
              const active = item.to === "/espace-membres"
                ? location.pathname === "/espace-membres"
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-[#D4A843]/20 text-[#D4A843]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.6} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#D4A843] text-xs font-bold text-[#0F1A2E]">
              {membre?.nom?.[0] ?? "?"}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">{membre?.nom}</p>
              <p className="text-[10px] uppercase tracking-wider text-[#D4A843]/80">{membre?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.6} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
