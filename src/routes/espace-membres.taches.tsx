import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Plus, Loader2, Filter, Trash2 } from "lucide-react";
import { listTaches, createTache, updateTache, deleteTache, listMembres } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";

export const Route = createFileRoute("/espace-membres/taches")({
  head: () => ({
    meta: [
      { title: "Tâches — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TachesPage,
});

function TachesPage() {
  const [showForm, setShowForm] = useState(false);
  const [filterStatut, setFilterStatut] = useState("");
  const { hasRole } = useMembreAuth();
  const queryClient = useQueryClient();

  const { data: taches, isLoading } = useQuery({
    queryKey: ["workspace-taches"],
    queryFn: () => listTaches(),
  });

  const { data: membres } = useQuery({
    queryKey: ["workspace-membres"],
    queryFn: () => listMembres(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateTache({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspace-taches"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTache({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspace-taches"] }),
  });

  const filtered = filterStatut
    ? taches?.filter((t: any) => t.statut === filterStatut)
    : taches;

  const columns: { label: string; statut: string }[] = [
    { label: "À faire", statut: "a_faire" },
    { label: "En cours", statut: "en_cours" },
    { label: "Terminé", statut: "termine" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">Tâches</h1>
          <p className="mt-1 text-[#6B7280]">Gérez les tâches du cabinet.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C]"
        >
          <Plus className="h-4 w-4" /> Nouvelle tâche
        </button>
      </div>

      {showForm && (
        <TaskForm
          membres={membres ?? []}
          onSave={(form) => {
            createTache({ data: form }).then(() => {
              queryClient.invalidateQueries({ queryKey: ["workspace-taches"] });
              setShowForm(false);
            });
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" /></div>
      ) : !taches?.length ? (
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
          <CheckSquare className="mx-auto h-12 w-12 text-[#D4A843]/40" strokeWidth={1.4} />
          <h3 className="mt-4 font-semibold text-[#1B2A4A]">Aucune tâche</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Créez votre première tâche.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((col) => {
            const items = filtered?.filter((t: any) => t.statut === col.statut) ?? [];
            return (
              <div key={col.statut}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#6B7280]">{col.label} ({items.length})</h3>
                <div className="space-y-3">
                  {items.map((t: any) => (
                    <div key={t.id} className="rounded-2xl border border-[#E2E4E9] bg-white p-4 transition-all hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-[#1B2A4A]">{t.titre}</p>
                        <div className="flex gap-1">
                          {hasRole("ADMIN", "ASSOCIE") && col.statut !== "termine" && (
                            <button
                              onClick={() => updateMutation.mutate({ id: t.id, statut: col.statut === "a_faire" ? "en_cours" : "termine" })}
                              className="grid h-7 w-7 place-items-center rounded-lg hover:bg-[#F5F6FA]"
                            >
                              <CheckSquare className="h-4 w-4 text-[#D4A843]" />
                            </button>
                          )}
                          {hasRole("ADMIN") && (
                            <button onClick={() => deleteMutation.mutate(t.id)} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-red-50">
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          t.priorite === "urgente" ? "bg-red-100 text-red-700" :
                          t.priorite === "haute" ? "bg-orange-100 text-orange-700" :
                          t.priorite === "moyenne" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{t.priorite}</span>
                        {t.dossier && <span className="rounded-full bg-[#F5F6FA] px-2 py-0.5 text-[10px] text-[#6B7280]">{t.dossier.titre}</span>}
                      </div>
                      <p className="mt-2 text-xs text-[#6B7280]">{t.assignee?.nom ?? "Non assignée"}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskForm({ membres, onSave, onCancel }: { membres: any[]; onSave: (data: any) => void; onCancel: () => void }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priorite, setPriorite] = useState("moyenne");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ titre, description, assignee_id: assigneeId || undefined, priorite: priorite as any });
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#D4A843]/30 bg-white p-6 shadow-lg">
      <h2 className="mb-5 font-semibold text-[#1B2A4A]">Nouvelle tâche</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Titre *</label>
          <input value={titre} onChange={(e) => setTitre(e.target.value)} required className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Assignée à</label>
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]">
              <option value="">Sélectionner</option>
              {membres.map((m: any) => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Priorité</label>
            <select value={priorite} onChange={(e) => setPriorite(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]">
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="rounded-xl border border-[#E2E4E9] px-5 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F5F6FA]">Annuler</button>
          <button type="submit" className="rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C]">Créer</button>
        </div>
      </form>
    </div>
  );
}
