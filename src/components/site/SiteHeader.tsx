import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/cabinet", label: "Le Cabinet" },
  { to: "/expertises", label: "Expertises" },
  { to: "/actualites", label: "Actualités" },
  { to: "/espace-client", label: "Espace Client" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Scale className="h-4.5 w-4.5" strokeWidth={1.6} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-tight text-ink">
              JurisConsultants
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Conseil Juridique &amp; Fiscal
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-xs font-medium text-muted-foreground transition-all hover:text-primary hover:ring-2 hover:ring-primary/40 hover:shadow-[0_0_16px_4px] hover:shadow-primary/25 focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-2.5 py-1"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
<div className="hidden items-center gap-2 lg:flex">
  <Link to="/contact" className="btn-primary text-[10px] px-3.5 py-1.5 gap-1">
    Rendez-vous
  </Link>
  <div className="flex h-7 w-7 overflow-hidden rounded-full border border-gray-200 shadow-sm">
    <span className="h-full w-1/3 bg-orange-500"></span>
    <span className="h-full w-1/3 bg-white"></span>
    <span className="h-full w-1/3 bg-green-700"></span>
  </div>
</div>
        <button
          type="button"
          className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-border text-foreground hover:ring-2 hover:ring-primary/40 hover:shadow-[0_0_18px_6px] hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:ring-2 hover:ring-primary/40 hover:shadow-[0_0_16px_4px] hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
                activeProps={{ className: "bg-primary-soft text-primary" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
               className="btn-primary mt-2 text-[10px] px-4 py-1.5 gap-1"
            >
              Rendez-vous
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
