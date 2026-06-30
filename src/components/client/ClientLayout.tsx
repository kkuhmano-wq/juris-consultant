import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Scale, Bell, ChevronDown } from "lucide-react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { useAuth } from "@/lib/client-auth";

export function ClientLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-secondary">
      <ClientSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-background/85 backdrop-blur-md px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <button className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary">
            <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <Link to="/" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-secondary sm:flex">
            <Scale className="h-4 w-4" />
            Site vitrine
            <ChevronDown className="h-3 w-3" />
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-primary-soft px-4 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </span>
            <div className="hidden leading-tight md:block">
              <p className="text-sm font-medium text-foreground">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-muted-foreground">Client</p>
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
