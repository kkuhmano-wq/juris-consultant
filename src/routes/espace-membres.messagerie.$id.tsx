import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageSquare, Send, Users, Loader2 } from "lucide-react";
import { getMessage } from "@/lib/workspace.server";

export const Route = createFileRoute("/espace-membres/messagerie/$id")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MessageDetailPage,
});

function MessageDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: message, isLoading } = useQuery({
    queryKey: ["workspace-message", id],
    queryFn: () => getMessage({ data: { id } }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" /></div>;
  }

  if (!message) {
    return <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center"><p className="text-[#6B7280]">Message introuvable.</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button onClick={() => navigate({ to: "/espace-membres/messagerie" })} className="mb-6 flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B2A4A]">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="rounded-2xl border border-[#E2E4E9] bg-white p-8">
        <div className="mb-6 flex items-center gap-4 pb-6 border-b border-[#E2E4E9]">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#D4A843]/10">
            <MessageSquare className="h-7 w-7 text-[#D4A843]" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#1B2A4A]">{message.sujet}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1"><Send className="h-4 w-4" /> {message.expediteur?.nom} ({message.expediteur?.role})</span>
              <span>{new Date(message.created_at).toLocaleDateString("fr-FR", { dateStyle: "long", timeStyle: "short" })}</span>
            </div>
          </div>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#4B5563]">{message.contenu}</div>

        <div className="mt-8 pt-6 border-t border-[#E2E4E9]">
          <h3 className="mb-3 text-sm font-semibold text-[#6B7280] uppercase tracking-wider">Destinataires</h3>
          <div className="flex flex-wrap gap-3">
            {message.destinataires?.map((d: any) => (
              <div key={d.id} className="flex items-center gap-2 rounded-xl bg-[#F5F6FA] px-4 py-2 text-sm">
                <Users className="h-4 w-4 text-[#D4A843]" />
                <span className="text-[#1B2A4A]">{d.membre?.nom}</span>
                <span className="text-[#6B7280]">({d.membre?.role})</span>
                {d.lu && <span className="text-[10px] text-green-600">Lu</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
