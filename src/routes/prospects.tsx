import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { requireAuth } from "@/lib/admin.server";
import { getProspects, deleteProspect } from "@/lib/prospects.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Mail, Phone, MessageCircle, Calendar, Trash2, RefreshCw, Search, ArrowLeft } from "lucide-react";

function getToken(): string | null {
  try { return sessionStorage.getItem("admin_token"); } catch { return null; }
}

export const Route = createFileRoute("/prospects")({
  head: () => ({
    meta: [
      { title: "Prospects — JURIS-CONSULTANT" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProspectsPage,
});

function ProspectsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthed(false); setLoading(false); return; }
    requireAuth({ data: { token } }).then((r) => {
      setAuthed(r.authenticated);
      if (r.authenticated) load();
      else { setLoading(false); clearToken(); }
    });
  }, []);

  function clearToken() {
    try { sessionStorage.removeItem("admin_token"); } catch {}
  }

  async function load() {
    setLoading(true);
    try {
      const result = await getProspects({});
      setProspects(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce prospect ?")) return;
    await deleteProspect({ data: { id } });
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = prospects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (authed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Accès refusé. Veuillez vous connecter.</p>
          <Link to="/admin" className="btn-primary mt-4 inline-flex">
            Connexion
          </Link>
        </div>
      </div>
    );
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Vérification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <span className="eyebrow">Administration</span>
          <h1 className="mt-6 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Prospects
          </h1>
          <p className="mt-4 text-muted-foreground">
            {prospects.length} prospect{prospects.length > 1 ? "s" : ""} enregistré{prospects.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="relative max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <button onClick={load} className="btn-outline text-xs">
              <RefreshCw className="h-3.5 w-3.5" />
              Actualiser
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              {search ? "Aucun résultat." : "Aucun prospect pour le moment."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-5 py-4 font-semibold text-ink">Date</th>
                    <th className="px-5 py-4 font-semibold text-ink">Nom</th>
                    <th className="px-5 py-4 font-semibold text-ink">Contact</th>
                    <th className="px-5 py-4 font-semibold text-ink">Sujet</th>
                    <th className="px-5 py-4 font-semibold text-ink">Message</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">{p.name}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {p.email && (
                            <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 text-primary hover:underline">
                              <Mail className="h-3.5 w-3.5" />
                              {p.email}
                            </a>
                          )}
                          {p.phone && (
                            <a href={`tel:${p.phone}`} className="flex items-center gap-1.5 text-primary hover:underline">
                              <Phone className="h-3.5 w-3.5" />
                              {p.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-[200px] truncate text-muted-foreground">
                        {p.subject || "—"}
                      </td>
                      <td className="px-5 py-4 max-w-[300px] truncate text-muted-foreground">
                        {p.message}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/2250789853607?text=Bonjour%20${encodeURIComponent(p.name)}%2C%20je%20vous%20contacte%20suite%20%C3%A0%20votre%20demande%20sur%20JURIS-CONSULTANT.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-soft"
                            title="Contacter par WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}