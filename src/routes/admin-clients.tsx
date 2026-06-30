import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  listClients,
  createClient,
  deleteClient,
  listDossiers,
  createDossier,
  updateDossierStatus,
  listDocuments,
  createDocument,
  uploadDocument,
} from "@/lib/admin-clients.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  FolderOpen,
  ChevronRight,
  Eye,
  EyeOff,
  Upload,
  Download,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-clients")({
  head: () => ({
    meta: [
      { title: "Gestion des clients — Cabinet JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminClientsPage,
});

function getToken(): string | null {
  try { return sessionStorage.getItem("admin_token"); } catch { return null; }
}

function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  async function loadClients() {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    try {
      const result = await listClients({ data: { token } });
      setClients(result);
    } catch {
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  }

  async function loadDossiers(clientId: string) {
    try {
      const result = await listDossiers({ data: { clientId } });
      setDossiers(result);
    } catch {
      setDossiers([]);
    }
  }

  async function loadDocuments(clientId: string) {
    try {
      const result = await listDocuments({ data: { clientId } });
      setDocuments(result);
    } catch {
      setDocuments([]);
    }
  }

  useEffect(() => { loadClients(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      await createClient({ data: { token, email, password, prenom, nom, telephone } });
      toast.success("Client créé avec succès");
      setShowForm(false);
      setEmail(""); setPassword(""); setPrenom(""); setNom(""); setTelephone("");
      loadClients();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce client ?")) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteClient({ data: { token, id } });
      toast.success("Client supprimé");
      if (selectedClient?.id === id) { setSelectedClient(null); setDossiers([]); }
      loadClients();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  function viewClient(c: any) {
    setSelectedClient(c);
    loadDossiers(c.id);
    loadDocuments(c.id);
  }

  if (selectedClient) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <section className="bg-secondary">
          <div className="container-page py-16 lg:py-20">
            <button onClick={() => { setSelectedClient(null); setDossiers([]); }} className="btn-outline text-xs mb-6">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la liste
            </button>
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {(selectedClient.prenom?.[0] || "")}{(selectedClient.nom?.[0] || "")}
              </span>
              <div>
                <h1 className="font-serif text-3xl font-semibold text-ink lg:text-4xl">
                  {selectedClient.prenom} {selectedClient.nom}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{selectedClient.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container-page">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                <FolderOpen className="mr-2 inline h-5 w-5" strokeWidth={1.6} />
                Dossiers
              </h2>
              <DossierCreateForm clientId={selectedClient.id} onCreated={() => loadDossiers(selectedClient.id)} />
            </div>

            {dossiers.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
                Aucun dossier pour ce client.
              </p>
            ) : (
              <div className="space-y-3">
                {dossiers.map((d) => (
                  <DossierCard
                    key={d.id}
                    dossier={d}
                    clientId={selectedClient.id}
                    docs={documents.filter((doc) => doc.dossier_id === d.id)}
                    onStatusChange={() => loadDossiers(selectedClient.id)}
                    onDocumentChange={() => loadDocuments(selectedClient.id)}
                  />
                ))}
              </div>
            )}

            <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
              <FileText className="mr-2 inline h-5 w-5" strokeWidth={1.6} />
              Documents généraux
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Documents non rattachés à un dossier spécifique.
            </p>
            <GeneralDocuments
              clientId={selectedClient.id}
              docs={documents.filter((doc) => !doc.dossier_id)}
              onDocumentChange={() => loadDocuments(selectedClient.id)}
            />
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Administration</span>
              <h1 className="mt-6 font-serif text-5xl font-semibold text-ink md:text-6xl">
                Clients
              </h1>
              <p className="mt-3 text-muted-foreground">
                {clients.length} client{clients.length > 1 ? "s" : ""} inscrit{clients.length > 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs">
              <Plus className="h-3.5 w-3.5" />
              Nouveau client
            </button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {showForm && (
            <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-semibold text-ink mb-4">Nouveau client</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Prénom</label>
                  <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nom</label>
                  <input value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Mot de passe *</label>
                  <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caractères" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
                  <input value={telephone} onChange={(e) => setTelephone(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary text-xs">
                  {saving ? "Création..." : "Créer le client"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-xs">Annuler</button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-12">Chargement...</p>
          ) : clients.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
              Aucun client pour le moment.
            </p>
          ) : (
            <div className="space-y-3">
              {clients.map((c) => (
                <div key={c.id} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                    {(c.prenom?.[0] || "")}{(c.nom?.[0] || "")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {c.prenom || "—"} {c.nom || "—"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.confirmed ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"}`}>
                    {c.confirmed ? "Confirmé" : "En attente"}
                  </span>
                  <button onClick={() => viewClient(c)} className="btn-outline text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-3 w-3" />
                    Dossiers
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="btn-outline text-xs text-destructive border-destructive/30 hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function DossierCreateForm({ clientId, onCreated }: { clientId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      await createDossier({ data: { token, client_id: clientId, title, description, category, reference } });
      toast.success("Dossier créé");
      setTitle(""); setDescription(""); setCategory(""); setReference("");
      setOpen(false);
      onCreated();
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary text-xs">
        <Plus className="h-3.5 w-3.5" />
        Nouveau dossier
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-semibold text-ink mb-4">Nouveau dossier</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Titre *</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ex: Fiscal" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Référence</label>
                  <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="ex: DOS-2024-001" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary text-xs">{saving ? "Création..." : "Créer"}</button>
                <button type="button" onClick={() => setOpen(false)} className="btn-outline text-xs">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function DossierCard({ dossier, clientId, docs, onStatusChange, onDocumentChange }: {
  dossier: any; clientId: string; docs: any[]; onStatusChange: () => void; onDocumentChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function changeStatus(status: string) {
    const token = getToken();
    if (!token) return;
    try {
      await updateDossierStatus({ data: { token, id: dossier.id, status: status as any } });
      toast.success("Statut mis à jour");
      onStatusChange();
    } catch {
      toast.error("Erreur");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    if (!token) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await uploadDocument({ data: { token, client_id: clientId, dossier_id: dossier.id, name: file.name, file_base64: base64, content_type: file.type } });
        toast.success("Document envoyé");
        onDocumentChange();
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  }

  async function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    const token = getToken();
    if (!token) return;
    try {
      await createDocument({ data: { token, client_id: clientId, dossier_id: dossier.id, name: urlInput.trim(), url: urlInput.trim(), type: "lien" } });
      toast.success("Lien ajouté");
      setUrlInput("");
      setShowUrlInput(false);
      onDocumentChange();
    } catch {
      toast.error("Erreur");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-start justify-between p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="font-medium text-foreground">{dossier.title}</h3>
          {dossier.reference && (
            <p className="mt-0.5 text-xs text-muted-foreground">Réf : {dossier.reference}</p>
          )}
        </div>
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={dossier.status}
            onChange={(e) => changeStatus(e.target.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none ${
              dossier.status === "termine" ? "border-primary/30 bg-primary-soft text-primary" :
              dossier.status === "archive" ? "border-border bg-secondary text-muted-foreground" :
              dossier.status === "en_attente" ? "border-amber-200 bg-amber-50 text-amber-700" :
              "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            <option value="en_cours">En cours</option>
            <option value="en_attente">En attente</option>
            <option value="termine">Terminé</option>
            <option value="archive">Archivé</option>
          </select>
          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </div>
      {dossier.description && (
        <p className="px-5 pb-2 text-sm text-muted-foreground">{dossier.description}</p>
      )}
      {dossier.category && (
        <span className="ml-5 mb-3 inline-block rounded-full bg-secondary px-3 py-0.5 text-[10px] font-medium text-muted-foreground">
          {dossier.category}
        </span>
      )}
      <p className="px-5 pb-3 text-[10px] text-muted-foreground">
        Créé le {new Date(dossier.created_at).toLocaleDateString("fr-FR")}
      </p>

      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Documents ({docs.length})
            </h4>
            <div className="flex gap-2">
              <label className="btn-outline text-xs cursor-pointer">
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                {uploading ? "Envoi..." : "Fichier"}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
              <button onClick={() => setShowUrlInput(!showUrlInput)} className="btn-outline text-xs">
                <LinkIcon className="h-3 w-3" />
                Lien
              </button>
            </div>
          </div>

          {showUrlInput && (
            <div className="flex gap-2">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Coller une URL..."
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button onClick={handleUrlSubmit} className="btn-primary text-xs">Ajouter</button>
            </div>
          )}

          {docs.length === 0 ? (
            <p className="text-xs text-muted-foreground">Aucun document.</p>
          ) : (
            <div className="space-y-2">
              {docs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {doc.type === "lien" ? "Lien" : doc.type}
                        {doc.size ? ` — ${(Number(doc.size) / 1024).toFixed(0)} Ko` : ""}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg p-2 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GeneralDocuments({ clientId, docs, onDocumentChange }: {
  clientId: string; docs: any[]; onDocumentChange: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    if (!token) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await uploadDocument({ data: { token, client_id: clientId, dossier_id: null, name: file.name, file_base64: base64, content_type: file.type } });
        toast.success("Document envoyé");
        onDocumentChange();
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  }

  async function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    const token = getToken();
    if (!token) return;
    try {
      await createDocument({ data: { token, client_id: clientId, dossier_id: null, name: urlInput.trim(), url: urlInput.trim(), type: "lien" } });
      toast.success("Lien ajouté");
      setUrlInput("");
      setShowUrlInput(false);
      onDocumentChange();
    } catch {
      toast.error("Erreur");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          {docs.length} document{docs.length > 1 ? "s" : ""}
        </h4>
        <div className="flex gap-2">
          <label className="btn-outline text-xs cursor-pointer">
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            {uploading ? "Envoi..." : "Fichier"}
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
          <button onClick={() => setShowUrlInput(!showUrlInput)} className="btn-outline text-xs">
            <LinkIcon className="h-3 w-3" />
            Lien
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Coller une URL..."
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={handleUrlSubmit} className="btn-primary text-xs">Ajouter</button>
        </div>
      )}

      {docs.length === 0 ? (
        <p className="text-xs text-muted-foreground">Aucun document général.</p>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {doc.type === "lien" ? "Lien" : doc.type}
                    {doc.size ? ` — ${(Number(doc.size) / 1024).toFixed(0)} Ko` : ""}
                  </p>
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg p-2 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
