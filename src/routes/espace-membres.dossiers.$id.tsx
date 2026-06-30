import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Loader2, FileText, Trash2, CheckCircle, Clock, UserCheck, Users } from "lucide-react";
import { getDossier, updateDossier, deleteDossier, listMembres, updateDossierAcces, createTache, deleteDocument } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";

export const Route = createFileRoute("/espace-membres/dossiers/$id")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DossierDetailPage,
});

function DossierDetailPage() {
  const { id } = Route.useParams();
  const { membre, hasRole } = useMembreAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dossier, isLoading } = useQuery({
    queryKey: ["workspace-dossier", id],
    queryFn: () => getDossier({ data: { id } }),
  });

  const { data: membres } = useQuery({
    queryKey: ["workspace-membres"],
    queryFn: () => listMembres(),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDossier({ data: { id } }),
    onSuccess: () => navigate({ to: "/espace-membres/dossiers" }),
  });

  const statutMutation = useMutation({
    mutationFn: (statut: string) => updateDossier({ data: { id, statut: statut as any } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspace-dossier", id] }),
  });

  const accesMutation = useMutation({
    mutationFn: (membre_ids: string[]) => updateDossierAcces({ data: { dossier_id: id, membre_ids } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspace-dossier", id] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
        <p className="text-[#6B7280]">Dossier introuvable.</p>
      </div>
    );
  }

  const isAdminOrAssocie = hasRole("ADMIN", "ASSOCIE");

  return (
    <div className="mx-auto max-w-7xl">
      <button
        onClick={() => navigate({ to: "/espace-membres/dossiers" })}
        className="mb-6 flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B2A4A]"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux dossiers
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">{dossier.titre}</h1>
            <span className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
              dossier.statut === "ouvert" ? "bg-green-100 text-green-700" :
              dossier.statut === "en_cours" ? "bg-blue-100 text-blue-700" :
              dossier.statut === "clos" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-700"
            }`}>{dossier.statut}</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-[#6B7280]">
            {dossier.reference && <span>Réf. {dossier.reference}</span>}
            <span>Créé le {new Date(dossier.created_at).toLocaleDateString("fr-FR")}</span>
            {dossier.responsable && <span>Responsable: <strong className="text-[#1B2A4A]">{dossier.responsable.nom}</strong></span>}
          </div>
        </div>

        <div className="flex gap-2">
          {isAdminOrAssocie && (
            <>
              {["ouvert", "en_cours", "clos", "archive"].map((s) => s !== dossier.statut && (
                <button
                  key={s}
                  onClick={() => statutMutation.mutate(s)}
                  className="rounded-xl border border-[#E2E4E9] px-4 py-2 text-xs font-medium text-[#6B7280] hover:bg-[#F5F6FA]"
                >
                  {s === "clos" ? "Clôturer" : s === "archive" ? "Archiver" : s === "en_cours" ? "En cours" : "Rouvrir"}
                </button>
              ))}
              {hasRole("ADMIN") && (
                <button
                  onClick={() => { if (confirm("Supprimer ce dossier ?")) deleteMutation.mutate(); }}
                  className="rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Description">
            <p className="text-sm text-[#4B5563]">{dossier.description || "Aucune description."}</p>
          </Section>

          <Section title="Tâches liées">
            <TacheSection dossierId={id} createurId={membre?.id ?? ""} taches={dossier.taches ?? []} />
          </Section>

          <Section title="Documents">
            <DocumentSection dossierId={id} documents={dossier.documents ?? []} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Membres avec accès">
            <AccesSection
              dossierId={id}
              acces={dossier.acces ?? []}
              membres={membres ?? []}
              onUpdate={(ids) => accesMutation.mutate(ids)}
              canEdit={isAdminOrAssocie}
            />
          </Section>

          {dossier.client_nom && (
            <Section title="Client">
              <p className="text-sm font-medium text-[#1B2A4A]">{dossier.client_nom}</p>
              {dossier.client_contact && <p className="text-xs text-[#6B7280]">{dossier.client_contact}</p>}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E2E4E9] bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#6B7280]">{title}</h3>
      {children}
    </div>
  );
}

function TacheSection({ dossierId, createurId, taches }: { dossierId: string; createurId: string; taches: any[] }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [titre, setTitre] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priorite, setPriorite] = useState("moyenne");

  const { data: membres } = useQuery({
    queryKey: ["workspace-membres"],
    queryFn: () => listMembres(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createTache({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-dossier", dossierId] });
      setShowForm(false);
      setTitre("");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ createur_id: createurId, dossier_id: dossierId, titre, assignee_id: assigneeId || undefined, priorite: priorite as any });
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="mb-3 flex items-center gap-2 text-sm font-medium text-[#D4A843]">
        <Plus className="h-4 w-4" /> Ajouter une tâche
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 space-y-3 rounded-xl bg-[#F5F6FA] p-4">
          <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre" required className="w-full rounded-lg border border-[#E2E4E9] px-3 py-2 text-sm outline-none focus:border-[#D4A843]" />
          <div className="flex gap-2">
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="flex-1 rounded-lg border border-[#E2E4E9] px-3 py-2 text-sm outline-none">
              <option value="">Assigner à...</option>
              {membres?.map((m: any) => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
            <select value={priorite} onChange={(e) => setPriorite(e.target.value)} className="rounded-lg border border-[#E2E4E9] px-3 py-2 text-sm outline-none">
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
            <button type="submit" disabled={createMutation.isPending} className="rounded-lg bg-[#D4A843] px-4 py-2 text-sm font-medium text-[#0F1A2E]">Ajouter</button>
          </div>
        </form>
      )}

      {taches.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Aucune tâche.</p>
      ) : (
        <div className="space-y-2">
          {taches.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between rounded-xl bg-[#F5F6FA] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#1B2A4A]">{t.titre}</p>
                <p className="text-xs text-[#6B7280]">{t.assignee?.nom ?? "Non assignée"} · {t.statut}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
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

function DocumentSection({ dossierId, documents }: { dossierId: string; documents: any[] }) {
  return (
    <div>
      {documents.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Aucun document.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((d: any) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl bg-[#F5F6FA] px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#D4A843]" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-[#1B2A4A]">{d.nom}</p>
                  <p className="text-xs text-[#6B7280]">{d.type} · {new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccesSection({
  acces, membres, onUpdate, canEdit,
}: {
  dossierId: string;
  acces: any[];
  membres: any[];
  onUpdate: (ids: string[]) => void;
  canEdit: boolean;
}) {
  const allowedIds = acces.map((a: any) => a.membre_id);
  const [selected, setSelected] = useState<string[]>(allowedIds);
  const changed = JSON.stringify(selected) !== JSON.stringify(allowedIds);

  return (
    <div>
      {canEdit && (
        <div className="mb-3 space-y-2">
          {membres.map((m: any) => (
            <label key={m.id} className="flex items-center gap-3 rounded-xl bg-[#F5F6FA] px-4 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(m.id)}
                onChange={(e) => setSelected(e.target.checked ? [...selected, m.id] : selected.filter((id) => id !== m.id))}
                className="h-4 w-4 accent-[#D4A843]"
              />
              <div>
                <p className="text-sm font-medium text-[#1B2A4A]">{m.nom}</p>
                <p className="text-xs text-[#6B7280]">{m.role}</p>
              </div>
            </label>
          ))}
          {changed && (
            <button
              onClick={() => onUpdate(selected)}
              className="mt-2 w-full rounded-xl bg-[#D4A843] py-2 text-sm font-semibold text-[#0F1A2E]"
            >
              Mettre à jour
            </button>
          )}
        </div>
      )}
      {!canEdit && (
        <div className="space-y-2">
          {acces.map((a: any) => (
            <div key={a.membre_id} className="flex items-center gap-3 rounded-xl bg-[#F5F6FA] px-4 py-2.5">
              <Users className="h-4 w-4 text-[#D4A843]" />
              <div>
                <p className="text-sm font-medium text-[#1B2A4A]">{a.membre?.nom}</p>
                <p className="text-xs text-[#6B7280]">{a.membre?.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
