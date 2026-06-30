import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, FolderOpen, MoreHorizontal, FileText, Loader2 } from "lucide-react";
import { listDossiers, createDossier, listMembres } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";

export const Route = createFileRoute("/espace-membres/dossiers")({
  head: () => ({
    meta: [
      { title: "Dossiers — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DossiersPage,
});

function DossiersPage() {
  const { hasRole } = useMembreAuth();
  const canCreate = hasRole("ADMIN", "ASSOCIE");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: dossiers, isLoading } = useQuery({
    queryKey: ["workspace-dossiers"],
    queryFn: () => listDossiers(),
  });

  const { data: membres } = useQuery({
    queryKey: ["workspace-membres"],
    queryFn: () => listMembres(),
    enabled: canCreate,
  });

  const createMutation = useMutation({
    mutationFn: (form: any) => createDossier({ data: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-dossiers"] });
      setShowForm(false);
    },
  });

  const filtered = dossiers?.filter(
    (d: any) =>
      d.titre.toLowerCase().includes(search.toLowerCase()) ||
      d.reference?.toLowerCase().includes(search.toLowerCase())
  );

  const statutClass = (s: string) => {
    switch (s) {
      case "ouvert": return "bg-green-100 text-green-700";
      case "en_cours": return "bg-blue-100 text-blue-700";
      case "clos": return "bg-gray-100 text-gray-600";
      case "archive": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">Dossiers</h1>
          <p className="mt-1 text-[#6B7280]">Gérez l'ensemble des dossiers du cabinet.</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] transition-all hover:bg-[#C49A3C]"
          >
            <Plus className="h-4 w-4" />
            Nouveau dossier
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un dossier..."
          className="w-full rounded-xl border border-[#E2E4E9] bg-white py-3 pl-11 pr-4 text-sm text-[#1B2A4A] outline-none focus:border-[#D4A843]"
        />
      </div>

      {showForm && (
        <DossierForm
          membres={membres ?? []}
          onSave={(form) => createMutation.mutate(form)}
          onCancel={() => setShowForm(false)}
          loading={createMutation.isPending}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
        </div>
      ) : !filtered?.length ? (
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-[#D4A843]/40" strokeWidth={1.4} />
          <h3 className="mt-4 font-semibold text-[#1B2A4A]">Aucun dossier trouvé</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Créez votre premier dossier pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d: any) => (
            <Link
              key={d.id}
              to="/espace-membres/dossiers/$id"
              params={{ id: d.id }}
              className="flex items-center justify-between rounded-2xl border border-[#E2E4E9] bg-white p-5 transition-all hover:border-[#D4A843]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#D4A843]/10">
                  <FolderOpen className="h-6 w-6 text-[#D4A843]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-[#1B2A4A]">{d.titre}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#6B7280]">
                    {d.reference && <span>Réf. {d.reference}</span>}
                    <span>{d.responsable?.nom ?? "Non assigné"}</span>
                    <span>{new Date(d.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${statutClass(d.statut)}`}>
                  {d.statut}
                </span>
                <MoreHorizontal className="h-5 w-5 text-[#6B7280]" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function DossierForm({
  membres, onSave, onCancel, loading,
}: {
  membres: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [responsableId, setResponsableId] = useState("");
  const [clientNom, setClientNom] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ titre, description, reference, responsable_id: responsableId || undefined, client_nom: clientNom, membre_ids: responsableId ? [responsableId] : [] });
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#D4A843]/30 bg-white p-6 shadow-lg shadow-[#D4A843]/5">
      <h2 className="mb-5 font-semibold text-[#1B2A4A]">Nouveau dossier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Titre *</label>
            <input value={titre} onChange={(e) => setTitre(e.target.value)} required className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Référence</label>
            <input value={reference} onChange={(e) => setReference(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Responsable</label>
            <select value={responsableId} onChange={(e) => setResponsableId(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]">
              <option value="">Sélectionner</option>
              {membres.map((m: any) => <option key={m.id} value={m.id}>{m.nom} ({m.role})</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Client</label>
            <input value={clientNom} onChange={(e) => setClientNom(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="rounded-xl border border-[#E2E4E9] px-5 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F5F6FA]">Annuler</button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C] disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}
