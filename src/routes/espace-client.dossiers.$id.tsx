import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, FileText, Download, ArrowLeft, Calendar, Clock, Loader } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { fetchDossierById, fetchDocumentsByDossier, statusBadge, type Dossier, type Document } from "@/lib/client-portal";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/espace-client/dossiers/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Dossier — Espace Client | Cabinet JurisConsultants` },
    ],
  }),
  component: DossierDetailPage,
});

function DossierDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [dossier, setDossier] = useState<(Dossier & { statutLabel: string; dateLabel: string }) | null>(null);
  const [documents, setDocuments] = useState<(Document & { dateLabel: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      fetchDossierById(user.id, id),
      fetchDocumentsByDossier(user.id, id),
    ])
      .then(([d, docs]) => {
        setDossier(d);
        setDocuments(docs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Dossier introuvable.</p>
        <Link
          to="/espace-client/dossiers"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à mes dossiers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/espace-client/dossiers"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à mes dossiers
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="mt-1 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
            <FolderOpen className="h-7 w-7" strokeWidth={1.6} />
          </span>
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink">{dossier.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Réf. {dossier.reference || dossier.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <span className={`self-start rounded-full px-4 py-1.5 text-sm font-medium ${statusBadge(dossier.statutLabel)}`}>
          {dossier.statutLabel}
        </span>
      </div>

      {dossier.description && (
        <p className="mt-6 text-muted-foreground">{dossier.description}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Ouvert le {dossier.dateLabel}
        </span>
        {dossier.category && (
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> {dossier.category}
          </span>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">Documents liés</h2>

        <div className="mt-5 rounded-2xl border border-border bg-background overflow-hidden">
          {documents.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              Aucun document lié à ce dossier.
            </p>
          ) : (
            documents.map((doc, i) => (
              <div
                key={doc.id}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < documents.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="font-medium text-foreground text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.dateLabel}{doc.size ? ` · ${doc.size}` : ""}
                    </p>
                  </div>
                </div>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
