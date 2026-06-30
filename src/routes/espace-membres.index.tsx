import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen, CheckSquare, Mail, Users, Calendar, ArrowRight, AlertCircle, Clock } from "lucide-react";
import { getDashboardStats } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";

export const Route = createFileRoute("/espace-membres/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { membre } = useMembreAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["workspace-dashboard"],
    queryFn: () => getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4A843] border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Dossiers", value: stats?.totalDossiers ?? 0, icon: FolderOpen, color: "bg-blue-500/10 text-blue-600" },
    { label: "Dossiers ouverts", value: stats?.dossiersOuverts ?? 0, icon: AlertCircle, color: "bg-amber-500/10 text-amber-600" },
    { label: "Tâches en cours", value: stats?.tachesEnCours ?? 0, icon: Clock, color: "bg-purple-500/10 text-purple-600" },
    { label: "Messages non lus", value: stats?.messagesNonLus ?? 0, icon: Mail, color: "bg-red-500/10 text-red-600" },
    { label: "Membres", value: stats?.totalMembres ?? 0, icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Total tâches", value: stats?.totalTaches ?? 0, icon: CheckSquare, color: "bg-indigo-500/10 text-indigo-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">
          Bon retour, {membre?.nom?.split(" ")[0] ?? "Membre"}
        </h1>
        <p className="mt-1 text-[#6B7280]">Voici un aperçu de votre activité.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-[#E2E4E9] bg-white p-5 transition-shadow hover:shadow-lg">
            <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${card.color}`}>
              <card.icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <p className="text-2xl font-bold text-[#1B2A4A]">{card.value}</p>
            <p className="mt-1 text-sm text-[#6B7280]">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RecentDossiers dossiers={stats?.dossiersRecents ?? []} />
        <RecentTaches taches={stats?.tachesRecentes ?? []} />
      </div>

      <EvenementsToday evenements={stats?.evenementsToday ?? []} />
    </div>
  );
}

function RecentDossiers({ dossiers }: { dossiers: any[] }) {
  return (
    <div className="rounded-2xl border border-[#E2E4E9] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[#1B2A4A]">Dossiers récents</h2>
        <Link to="/espace-membres/dossiers" className="flex items-center gap-1 text-sm text-[#D4A843]">
          Voir tout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {dossiers.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Aucun dossier récent.</p>
      ) : (
        <div className="space-y-3">
          {dossiers.map((d: any) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl bg-[#F5F6FA] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#1B2A4A]">{d.titre}</p>
                <p className="text-xs text-[#6B7280]">{d.responsable?.nom ?? "Non assigné"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                d.statut === "ouvert" ? "bg-green-100 text-green-700" :
                d.statut === "en_cours" ? "bg-blue-100 text-blue-700" :
                d.statut === "clos" ? "bg-gray-100 text-gray-600" :
                "bg-amber-100 text-amber-700"
              }`}>{d.statut}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentTaches({ taches }: { taches: any[] }) {
  return (
    <div className="rounded-2xl border border-[#E2E4E9] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-[#1B2A4A]">Tâches récentes</h2>
        <Link to="/espace-membres/taches" className="flex items-center gap-1 text-sm text-[#D4A843]">
          Voir tout <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {taches.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Aucune tâche récente.</p>
      ) : (
        <div className="space-y-3">
          {taches.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between rounded-xl bg-[#F5F6FA] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#1B2A4A]">{t.titre}</p>
                <p className="text-xs text-[#6B7280]">{t.assignee?.nom ?? "Non assignée"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                t.priorite === "urgente" ? "bg-red-100 text-red-700" :
                t.priorite === "haute" ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-600"
              }`}>{t.priorite}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvenementsToday({ evenements }: { evenements: any[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-[#E2E4E9] bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-[#D4A843]" strokeWidth={1.6} />
        <h2 className="font-semibold text-[#1B2A4A]">Aujourd'hui</h2>
      </div>
      {evenements.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Aucun événement aujourd'hui.</p>
      ) : (
        <div className="space-y-3">
          {evenements.map((e: any) => (
            <div key={e.id} className="flex items-center gap-4 rounded-xl bg-[#F5F6FA] px-4 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#D4A843]/10">
                <Calendar className="h-5 w-5 text-[#D4A843]" strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1B2A4A]">{e.titre}</p>
                <p className="text-xs text-[#6B7280]">{new Date(e.date_debut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
