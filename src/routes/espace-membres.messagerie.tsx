import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageSquare, Search, Loader2, Users, Send } from "lucide-react";
import { listMessages } from "@/lib/workspace.server";
import { useMembreAuth } from "@/lib/auth-membres";
import { useState } from "react";

export const Route = createFileRoute("/espace-membres/messagerie")({
  head: () => ({
    meta: [
      { title: "Messagerie — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MessageriePage,
});

function MessageriePage() {
  const [search, setSearch] = useState("");
  const { membre } = useMembreAuth();
  const { data: messages, isLoading } = useQuery({
    queryKey: ["workspace-messages"],
    queryFn: () => listMessages(),
  });

  const filtered = messages?.filter(
    (m: any) =>
      m.sujet.toLowerCase().includes(search.toLowerCase()) ||
      m.expediteur?.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">Messagerie</h1>
        <p className="mt-1 text-[#6B7280]">Messages internes du cabinet.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher dans les messages..."
          className="w-full rounded-xl border border-[#E2E4E9] bg-white py-3 pl-11 pr-4 text-sm text-[#1B2A4A] outline-none focus:border-[#D4A843]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" /></div>
      ) : !filtered?.length ? (
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-[#D4A843]/40" strokeWidth={1.4} />
          <h3 className="mt-4 font-semibold text-[#1B2A4A]">Aucun message</h3>
          <p className="mt-1 text-sm text-[#6B7280]">La messagerie est vide.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m: any) => {
            const isUnread = m.destinataires?.some(
              (d: any) => d.membre?.id === membre?.id && !d.lu
            );
            return (
              <Link
                key={m.id}
                to="/espace-membres/messagerie/$id"
                params={{ id: m.id }}
                className={`flex items-start gap-4 rounded-2xl border bg-white p-5 transition-all hover:shadow-md ${
                  isUnread ? "border-[#D4A843]/30 border-l-4 border-l-[#D4A843]" : "border-[#E2E4E9]"
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  isUnread ? "bg-[#D4A843]/20" : "bg-[#F5F6FA]"
                }`}>
                  <MessageSquare className={`h-5 w-5 ${isUnread ? "text-[#D4A843]" : "text-[#6B7280]"}`} strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`truncate ${isUnread ? "font-semibold text-[#1B2A4A]" : "font-medium text-[#1B2A4A]"}`}>
                      {m.sujet}
                    </p>
                    {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#D4A843]" />}
                  </div>
                  <p className="mt-1 truncate text-sm text-[#6B7280]">{m.contenu}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1"><Send className="h-3 w-3" /> {m.expediteur?.nom}</span>
                    <span>{new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {m.destinataires?.length ?? 0} dest.</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
