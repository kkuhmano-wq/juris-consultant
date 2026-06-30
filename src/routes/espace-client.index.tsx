import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen, FileText, Calendar, User, ArrowUpRight, ChevronRight, Loader } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { fetchDashboardStats, fetchDossiers, statusBadge, type Dossier } from "@/lib/client-portal";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/espace-client/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Espace Client | Cabinet JurisConsultants" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ dossiersCount: 0, documentsCount: 0 });
  const [recentDossiers, setRecentDossiers] = useState<(Dossier & { statutLabel: string; dateLabel: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      fetchDashboardStats(user.id),
      fetchDossiers(user.id),
    ])
      .then(([s, d]) => {
        setStats(s);
        setRecentDossiers(d.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { icon: FolderOpen, label: "Mes dossiers", value: String(stats.dossiersCount), color: "text-primary bg-primary-soft" },
    { icon: FileText, label: "Mes documents", value: String(stats.documentsCount), color: "text-blue-600 bg-blue-50" },
    { icon: Calendar, label: "Mes rendez-vous", value: "—", color: "text-amber-600 bg-amber-50" },
    { icon: User, label: "Mon conseiller", value: "JurisConsultants", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold text-ink">
        Bienvenue dans votre espace client
      </h1>
      <p className="mt-2 text-muted-foreground">
        Bonjour {user?.prenom}, voici un aperçu de votre situation.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-[var(--shadow-soft)]">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-5 text-2xl font-bold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">Dossiers récents</h2>
          <a
            href="/espace-client/dossiers"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Voir tout <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background">
          {recentDossiers.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              Aucun dossier pour le moment.
            </p>
          ) : (
            recentDossiers.map((d, i) => (
              <div
                key={d.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < recentDossiers.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div>
                  <p className="text-xs text-muted-foreground">{d.reference || d.id.slice(0, 8)}</p>
                  <p className="font-medium text-foreground">{d.title}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(d.statutLabel)}`}>
                  {d.statutLabel}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
