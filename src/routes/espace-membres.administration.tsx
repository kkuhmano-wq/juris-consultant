import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Loader2, Trash2, Shield, UserCog } from "lucide-react";
import { listMembres, createMembre, updateMembre, deleteMembre } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";
import type { Role } from "@/lib/auth-membres";

export const Route = createFileRoute("/espace-membres/administration")({
  head: () => ({
    meta: [
      { title: "Administration — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { membre, hasRole } = useMembreAuth();
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: membres, isLoading } = useQuery({
    queryKey: ["workspace-membres"],
    queryFn: () => listMembres(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createMembre({ data }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["workspace-membres"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateMembre({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspace-membres"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { id: string; user_id: string }) => deleteMembre({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workspace-membres"] }),
  });

  if (!hasRole("ADMIN")) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-[#D4A843]/40" strokeWidth={1.4} />
          <h3 className="mt-4 font-semibold text-[#1B2A4A]">Accès restreint</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Seuls les administrateurs peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const roleBadge = (role: Role) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-700";
      case "ASSOCIE": return "bg-blue-100 text-blue-700";
      case "JURISTE": return "bg-green-100 text-green-700";
      case "STAGIAIRE": return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">Administration</h1>
          <p className="mt-1 text-[#6B7280]">Gérez les membres du cabinet.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C]"
        >
          <Plus className="h-4 w-4" /> Ajouter un membre
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#D4A843]/30 bg-white p-6 shadow-lg">
          <h2 className="mb-5 font-semibold text-[#1B2A4A]">Nouveau membre</h2>
          <MembreForm
            onSave={(data) => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            loading={createMutation.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" /></div>
      ) : (
        <div className="space-y-3">
          {membres?.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between rounded-2xl border border-[#E2E4E9] bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#D4A843]/10">
                  <UserCog className="h-6 w-6 text-[#D4A843]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-[#1B2A4A]">{m.nom}</p>
                  <p className="text-sm text-[#6B7280]">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${roleBadge(m.role)}`}>
                  {m.role}
                </span>
                <div className="flex items-center gap-1">
                  {["ADMIN", "ASSOCIE", "JURISTE", "STAGIAIRE"].filter((r) => r !== m.role).map((r) => (
                    <button
                      key={r}
                      onClick={() => updateMutation.mutate({ id: m.id, role: r as Role })}
                      className="rounded-lg border border-[#E2E4E9] px-2 py-1 text-[10px] text-[#6B7280] hover:bg-[#F5F6FA]"
                    >
                      {r}
                    </button>
                  ))}
                  {membre?.id !== m.id && (
                    <button
                      onClick={() => { if (confirm(`Supprimer ${m.nom} ?`)) deleteMutation.mutate({ id: m.id, user_id: m.user_id }); }}
                      className="ml-2 grid h-8 w-8 place-items-center rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MembreForm({
  onSave, onCancel, loading,
}: {
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("JURISTE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nom, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Nom *</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} required className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Mot de passe *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1B2A4A]">Rôle</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]">
            <option value="ADMIN">ADMIN</option>
            <option value="ASSOCIE">ASSOCIE</option>
            <option value="JURISTE">JURISTE</option>
            <option value="STAGIAIRE">STAGIAIRE</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-xl border border-[#E2E4E9] px-5 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F5F6FA]">Annuler</button>
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C] disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Créer
        </button>
      </div>
    </form>
  );
}
