import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Bell, Scale, ChevronDown } from "lucide-react";
import { MembresSidebar } from "@/components/membres/MembresSidebar";
import { useMembreAuth } from "@/lib/auth-membres";

export function MembresLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { membre, hasRole } = useMembreAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/espace-membres/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <MembresSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-[#E2E4E9] bg-white/90 backdrop-blur-md px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#F5F6FA] lg:hidden"
          >
            <Menu className="h-5 w-5 text-[#1B2A4A]" />
          </button>

          <div className="flex-1" />

          {hasRole("ADMIN") && (
            <Link to="/admin" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#6B7280] hover:bg-[#F5F6FA] sm:flex">
              <Scale className="h-4 w-4" />
              Administration site
              <ChevronDown className="h-3 w-3" />
            </Link>
          )}

          <Link to="/" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#6B7280] hover:bg-[#F5F6FA] sm:flex">
            <Scale className="h-4 w-4" />
            Site vitrine
            <ChevronDown className="h-3 w-3" />
          </Link>

          <button className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-[#F5F6FA]">
            <Bell className="h-5 w-5 text-[#6B7280]" strokeWidth={1.6} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-[#1B2A4A]/5 px-4 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D4A843] text-xs font-bold text-[#0F1A2E]">
              {membre?.nom?.[0] ?? "?"}
            </span>
            <div className="hidden leading-tight md:block">
              <p className="text-sm font-medium text-[#1B2A4A]">{membre?.nom}</p>
              <p className="text-xs text-[#D4A843]">{membre?.role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
