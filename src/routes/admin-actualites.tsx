import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { requireAuth, getPosts, savePost, deletePost } from "@/lib/admin.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Plus, FileText, Trash2, Save, X, ArrowLeft } from "lucide-react";

function getToken(): string | null {
  try { return sessionStorage.getItem("admin_token"); } catch { return null; }
}

export const Route = createFileRoute("/admin-actualites")({
  head: () => ({
    meta: [
      { title: "Gestion Actualités — Cabinet JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminActualitesPage,
});

const categories = [
  "Fiscalité",
  "Droit des affaires",
  "Droit du travail",
  "Conseils pratiques",
  "Veille réglementaire",
];

const months = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDateDisplay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function AdminActualitesPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadPosts() {
    try {
      const p = await getPosts();
      setPosts(p);
    } catch {
      toast.error("Erreur lors du chargement des articles");
    }
  }

  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthed(false); return; }
    requireAuth({ data: { token } }).then((r) => setAuthed(r.authenticated));
    loadPosts();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    try {
      const token = getToken() || "";
      await savePost({
        data: {
          token,
          id: editing?.id || undefined,
          cat: String(fd.get("cat") || ""),
          title: String(fd.get("title") || ""),
          date: String(fd.get("date") || ""),
          excerpt: String(fd.get("excerpt") || ""),
          content: String(fd.get("content") || ""),
        },
      });
      setEditing(null);
      form.reset();
      toast.success(editing?.id ? "Article modifié avec succès" : "Article publié avec succès");
      await loadPosts();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await deletePost({ data: { token: getToken() || "", id } });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Article supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  if (authed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Accès refusé.</p>
          <a href="/admin" className="btn-primary mt-4 inline-flex">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <a href="/admin" className="eyebrow cursor-pointer hover:opacity-70">
            ← Administration
          </a>
          <h1 className="mt-6 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Gestion des Actualités
          </h1>
          <p className="mt-4 text-muted-foreground">
            {posts.length} article{posts.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          {editing !== null && (
            <div className="mb-12 rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  {editing.id ? "Modifier" : "Nouvel article"}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="mt-6 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Titre
                    </label>
                    <input
                      name="title"
                      defaultValue={editing.title}
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Catégorie
                    </label>
                    <select
                      name="cat"
                      defaultValue={editing.cat || categories[0]}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={editing.date ? new Date(editing.date).toISOString().split("T")[0] : ""}
                      required
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Résumé
                  </label>
                  <textarea
                    name="excerpt"
                    defaultValue={editing.excerpt}
                    required
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contenu complet (optionnel)
                  </label>
                  <textarea
                    name="content"
                    defaultValue={editing.content}
                    rows={6}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Enregistrement..." : "Publier"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <button
            onClick={() => setEditing({ cat: categories[0], title: "", date: "", excerpt: "", content: "" })}
            className="btn-primary mb-8"
          >
            <Plus className="h-4 w-4" />
            Nouvel article
          </button>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-5 py-4 font-semibold text-ink">Date</th>
                  <th className="px-5 py-4 font-semibold text-ink">Catégorie</th>
                  <th className="px-5 py-4 font-semibold text-ink">Titre</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                      Aucun article. Cliquez sur "Nouvel article" pour créer le premier.
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                      <td className="px-5 py-4 text-muted-foreground">
                        {p.date ? formatDateDisplay(p.date) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                          {p.cat}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground max-w-md truncate">
                        {p.title}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditing(p)}
                            className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-soft"
                            title="Modifier"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}