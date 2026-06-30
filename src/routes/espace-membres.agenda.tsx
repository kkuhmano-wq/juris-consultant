import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Loader2, Clock, MapPin } from "lucide-react";
import { listEvenements, listMembres } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";

export const Route = createFileRoute("/espace-membres/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AgendaPage,
});

function AgendaPage() {
  const [showForm, setShowForm] = useState(false);
  const { membre } = useMembreAuth();
  const { data: evenements, isLoading } = useQuery({
    queryKey: ["workspace-evenements"],
    queryFn: () => listEvenements(),
  });

  const grouped = (evenements ?? []).reduce((acc: Record<string, any[]>, e: any) => {
    const date = new Date(e.date_debut).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">Agenda</h1>
          <p className="mt-1 text-[#6B7280]">Gérez vos rendez-vous, audiences et événements.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C]"
        >
          <Plus className="h-4 w-4" /> Événement
        </button>
      </div>

      {showForm && <EventForm membreId={membre?.id ?? ""} onClose={() => setShowForm(false)} />}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" /></div>
      ) : !evenements?.length ? (
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-[#D4A843]/40" strokeWidth={1.4} />
          <h3 className="mt-4 font-semibold text-[#1B2A4A]">Aucun événement</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Créez votre premier événement.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, events]: [string, any[]]) => (
            <div key={date}>
              <h3 className="mb-4 font-serif text-lg font-semibold capitalize text-[#1B2A4A]">{date}</h3>
              <div className="space-y-3">
                {events.map((e: any) => (
                  <div key={e.id} className="flex items-start gap-4 rounded-2xl border border-[#E2E4E9] bg-white p-5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#D4A843]/10">
                      <Calendar className="h-6 w-6 text-[#D4A843]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#1B2A4A]">{e.titre}</p>
                        <span className="rounded-full bg-[#F5F6FA] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">{e.type}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(e.date_debut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                        {e.lieu && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.lieu}</span>}
                        {e.dossier && <span>Dossier: {e.dossier.titre}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventForm({ membreId, onClose }: { membreId: string; onClose: () => void }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [type, setType] = useState("reunion");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => import("@/lib/workspace.server").then((m) => m.createEvenement({ data })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-evenements"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ createur_id: membreId, titre, description, lieu, type: type as any, date_debut: new Date(dateDebut).toISOString(), date_fin: dateFin ? new Date(dateFin).toISOString() : undefined });
  };

  return (
    <div className="mb-6 rounded-2xl border border-[#D4A843]/30 bg-white p-6 shadow-lg">
      <h2 className="mb-5 font-semibold text-[#1B2A4A]">Nouvel événement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#1B2A4A]">Titre *</label>
            <input value={titre} onChange={(e) => setTitre(e.target.value)} required className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]">
              <option value="reunion">Réunion</option>
              <option value="audience">Audience</option>
              <option value="rendez_vous">Rendez-vous</option>
              <option value="deadline">Deadline</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Lieu</label>
            <input value={lieu} onChange={(e) => setLieu(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Date début *</label>
            <input type="datetime-local" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1B2A4A]">Date fin</label>
            <input type="datetime-local" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#1B2A4A]">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1.5 block w-full rounded-xl border border-[#E2E4E9] px-4 py-2.5 text-sm outline-none focus:border-[#D4A843]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E2E4E9] px-5 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F5F6FA]">Annuler</button>
          <button type="submit" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[#D4A843] px-5 py-2.5 text-sm font-semibold text-[#0F1A2E] hover:bg-[#C49A3C] disabled:opacity-50">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Créer
          </button>
        </div>
      </form>
    </div>
  );
}
