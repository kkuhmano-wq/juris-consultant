import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { requireAuth, getFaq, saveFaqEntry, deleteFaqEntry } from "@/lib/admin.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Plus, HelpCircle, Trash2, Save, X, ArrowLeft } from "lucide-react";

function getToken(): string | null {
  try { return sessionStorage.getItem("admin_token"); } catch { return null; }
}

export const Route = createFileRoute("/admin-faq")({
  head: () => ({
    meta: [
      { title: "Gestion FAQ — JURIS-CONSULTANT" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminFaqPage,
});

function AdminFaqPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [faq, setFaq] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthed(false); return; }
    requireAuth({ data: { token } }).then((r) => setAuthed(r.authenticated));
    getFaq({}).then(setFaq);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    try {
      await saveFaqEntry({
        data: {
          token: getToken() || "",
          id: editing?.id || undefined,
          q: String(fd.get("q") || ""),
          a: String(fd.get("a") || ""),
          order: faq.length,
        },
      });
      setEditing(null);
      form.reset();
      getFaq({}).then(setFaq);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette entrée FAQ ?")) return;
    await deleteFaqEntry({ data: { token: getToken() || "", id } });
    setFaq((prev) => prev.filter((f) => f.id !== id));
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
            Gestion de la FAQ
          </h1>
          <p className="mt-4 text-muted-foreground">
            {faq.length} question{faq.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          {editing !== null && (
            <div className="mb-12 rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  {editing.id ? "Modifier" : "Nouvelle question"}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="mt-6 grid gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Question
                  </label>
                  <input
                    name="q"
                    defaultValue={editing.q}
                    required
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Réponse
                  </label>
                  <textarea
                    name="a"
                    defaultValue={editing.a}
                    required
                    rows={4}
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
                    {saving ? "Enregistrement..." : "Enregistrer"}
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
            onClick={() => setEditing({ q: "", a: "" })}
            className="btn-primary mb-8"
          >
            <Plus className="h-4 w-4" />
            Nouvelle question
          </button>

          {faq.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              Aucune question FAQ. Cliquez sur "Nouvelle question" pour ajouter la première.
            </div>
          ) : (
            <div className="space-y-3">
              {faq.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
                >
                  <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg font-semibold text-ink">
                      {f.q}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {f.a}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditing(f)}
                      className="rounded-lg p-2 text-primary transition-colors hover:bg-primary-soft"
                      title="Modifier"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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