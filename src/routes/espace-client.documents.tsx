import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Search, Loader } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { fetchDocuments, type Document } from "@/lib/client-portal";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/espace-client/documents")({
  head: () => ({
    meta: [
      { title: "Mes documents — Espace Client | Cabinet JurisConsultants" },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<(Document & { dateLabel: string })[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchDocuments(user.id)
      .then(setDocuments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = documents.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-ink">Mes documents</h1>
          <p className="mt-2 text-muted-foreground">
            Accédez à tous vos documents juridiques et fiscaux.
          </p>
        </div>
      </div>

      <div className="mt-8 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un document..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background overflow-hidden">
        <div className="hidden grid-cols-12 gap-4 border-b border-border px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
          <div className="col-span-5">Nom du document</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Taille</div>
          <div className="col-span-2" />
        </div>

        {filtered.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            Aucun document trouvé.
          </p>
        ) : (
          filtered.map((doc, i) => (
            <div
              key={doc.id}
              className={`grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-12 sm:items-center ${
                i < filtered.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="col-span-5 flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="font-medium text-foreground text-sm truncate">{doc.name}</span>
              </div>
              <div className="col-span-3 text-sm text-muted-foreground">{doc.dateLabel}</div>
              <div className="col-span-2 text-sm text-muted-foreground">{doc.size || "—"}</div>
              <div className="col-span-2 flex justify-end">
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-primary-soft px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">Non disponible</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
