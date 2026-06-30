import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, Search, ChevronRight, Loader } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { fetchDossiers, statusBadge, type Dossier } from "@/lib/client-portal";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/espace-client/dossiers")({
  head: () => ({
    meta: [
      { title: "Mes dossiers — Espace Client | Cabinet JurisConsultants" },
    ],
  }),
  component: DossiersPage,
});

function DossiersPage() {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState<(Dossier & { statutLabel: string; dateLabel: string })[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchDossiers(user.id)
      .then(setDossiers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = dossiers.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-ink">Mes dossiers</h1>
          <p className="mt-2 text-muted-foreground">
            Consultez l'ensemble de vos dossiers et suivez leur avancement.
          </p>
        </div>
      </div>

      <div className="mt-8 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un dossier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            Aucun dossier trouvé.
          </p>
        ) : (
          filtered.map((d, i) => (
            <Link
              key={d.id}
              to="/espace-client/dossiers/$id"
              params={{ id: d.id }}
              className={`flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between ${
                i < filtered.length - 1 ? "border-b border-border" : ""
              } transition-colors hover:bg-secondary/20`}
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <FolderOpen className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{d.reference || d.id.slice(0, 8)}</p>
                  <p className="font-medium text-foreground">{d.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Ouvert le {d.dateLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(d.statutLabel)}`}>
                  {d.statutLabel}
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  Détails <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
