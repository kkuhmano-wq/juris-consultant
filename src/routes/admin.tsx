import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { login, logout, requireAuth } from "@/lib/admin.server";
import { getProspects } from "@/lib/prospects.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Lock,
  LogOut,
  FileText,
  HelpCircle,
  Users,
  LayoutDashboard,
  Eye,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Cabinet JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function getToken(): string | null {
  try { return sessionStorage.getItem("admin_token"); } catch { return null; }
}
function setToken(t: string) {
  try { sessionStorage.setItem("admin_token", t); } catch {}
}
function clearToken() {
  try { sessionStorage.removeItem("admin_token"); } catch {}
}

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);
  const [prospectCount, setProspectCount] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthed(false); return; }
    requireAuth({ data: { token } })
      .then((r) => {
        setAuthed(r.authenticated);
        if (r.authenticated) {
          getProspects({}).then((p) => setProspectCount(p.length)).catch(() => {});
        } else {
          clearToken();
        }
      })
      .catch(() => {
        clearToken();
        setAuthed(false);
      });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLogging(true);
    setError("");
    try {
      const result = await login({ data: { password } });
      if (result.success && result.token) {
        setToken(result.token);
        setAuthed(true);
        setPassword("");
        getProspects({}).then((p) => setProspectCount(p.length)).catch(() => {});
      } else {
        setError(result.error || "Erreur");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLogging(false);
    }
  }

  async function handleLogout() {
    const token = getToken();
    if (token) {
      await logout({ data: { token } });
      clearToken();
    }
    setAuthed(false);
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Vérification...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center px-4 py-32">
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
                <Lock className="h-6 w-6" />
              </span>
              <h1 className="mt-6 font-serif text-3xl font-semibold text-ink">
                Administration
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Espace réservé. Connectez-vous.
              </p>
              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
                {error && (
                  <p className="text-xs font-medium text-destructive">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={logging || !password}
                  className="btn-primary w-full"
                >
                  {logging ? "Connexion..." : "Se connecter"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const cards = [
    {
      icon: LayoutDashboard,
      label: "Tableau de bord",
      desc: "Vue d'ensemble",
      disabled: true,
    },
    {
      icon: FileText,
      label: "Actualités",
      desc: "Gérer les articles",
      href: "/admin-actualites",
    },
    {
      icon: HelpCircle,
      label: "FAQ",
      desc: "Gérer les questions",
      href: "/admin-faq",
    },
    {
      icon: UserCheck,
      label: "Clients",
      desc: "Gérer les comptes clients",
      href: "/admin-clients",
    },
    {
      icon: Users,
      label: "Prospects",
      desc: `${prospectCount} inscription${prospectCount > 1 ? "s" : ""}`,
      href: "/prospects",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Administration</span>
              <h1 className="mt-6 font-serif text-5xl font-semibold text-ink md:text-6xl">
                Tableau de bord
              </h1>
            </div>
            <button onClick={handleLogout} className="btn-outline text-xs">
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) =>
              c.href ? (
                <Link
                  key={c.label}
                  to={c.href}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                    <c.icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">
                    {c.label}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Accéder
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ) : (
                <div
                  key={c.label}
                  className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-8"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <c.icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">
                    {c.label}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              )
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-8">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Liens rapides
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://wa.me/2250789853607"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                Voir le site
              </a>
              <Link to="/admin-actualites" className="btn-outline text-xs">
                <FileText className="h-3.5 w-3.5" />
                Publier un article
              </Link>
              <Link to="/admin-faq" className="btn-outline text-xs">
                <HelpCircle className="h-3.5 w-3.5" />
                Ajouter une FAQ
              </Link>
              <Link to="/prospects" className="btn-outline text-xs">
                <Users className="h-3.5 w-3.5" />
                Voir les prospects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}