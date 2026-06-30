import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Search, Loader2 } from "lucide-react";
import { listDocuments } from "@/lib/workspace.server";
import { useState } from "react";

export const Route = createFileRoute("/espace-membres/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque — Espace Collaboratif | JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BibliothequePage,
});

function BibliothequePage() {
  const [search, setSearch] = useState("");
  const { data: documents, isLoading } = useQuery({
    queryKey: ["workspace-documents"],
    queryFn: () => listDocuments(),
  });

  const filtered = documents?.filter(
    (d: any) => d.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1B2A4A]">Bibliothèque</h1>
        <p className="mt-1 text-[#6B7280]">Accédez à l'ensemble des documents du cabinet.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un document..."
          className="w-full rounded-xl border border-[#E2E4E9] bg-white py-3 pl-11 pr-4 text-sm text-[#1B2A4A] outline-none focus:border-[#D4A843]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" /></div>
      ) : !filtered?.length ? (
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-[#D4A843]/40" strokeWidth={1.4} />
          <h3 className="mt-4 font-semibold text-[#1B2A4A]">Aucun document</h3>
          <p className="mt-1 text-sm text-[#6B7280]">La bibliothèque est vide pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d: any) => (
            <div key={d.id} className="rounded-2xl border border-[#E2E4E9] bg-white p-5 transition-all hover:shadow-md">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-[#D4A843]/10">
                <FileText className="h-6 w-6 text-[#D4A843]" strokeWidth={1.5} />
              </div>
              <p className="font-medium text-[#1B2A4A]">{d.nom}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6B7280]">
                {d.type && <span className="rounded-full bg-[#F5F6FA] px-2 py-1">{d.type}</span>}
                {d.dossier && <span className="rounded-full bg-[#F5F6FA] px-2 py-1">{d.dossier.titre}</span>}
              </div>
              <p className="mt-2 text-xs text-[#6B7280]">Par {d.uploader?.nom ?? "Inconnu"} · {new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
