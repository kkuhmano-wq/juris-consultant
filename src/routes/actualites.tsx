import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getPosts } from "@/lib/admin.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités — JURIS-CONSULTANT" },
      {
        name: "description",
        content:
          "Actualités, analyses et veille en fiscalité, droit des affaires, droit du travail et réglementation.",
      },
      { property: "og:title", content: "Actualités — JURIS-CONSULTANT" },
      { property: "og:url", content: "/actualites" },
    ],
    links: [{ rel: "canonical", href: "/actualites" }],
  }),
  component: ActualitesPage,
});

const defaultCategories = [
  "Fiscalité",
  "Droit des affaires",
  "Droit du travail",
  "Conseils pratiques",
  "Veille réglementaire",
];

function ActualitesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    getPosts({}).then(setPosts).catch(() => {});
  }, []);

  const categories = [...new Set([...defaultCategories, ...posts.map((p) => p.cat)])];

  const filtered = activeCat
    ? posts.filter((p) => p.cat === activeCat)
    : posts;

  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <span className="eyebrow">Actualités</span>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Analyses, conseils et veille juridique &amp; fiscale.
          </h1>
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                !activeCat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              Toutes
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeCat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              Aucun article pour le moment.
            </div>
          ) : (
            filtered.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                  {p.cat}
                </span>
                <h2 className="mt-4 font-serif text-2xl font-semibold leading-snug text-ink">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
                  <span>{p.date ? formatDate(p.date) : "—"}</span>
                  <span className="font-semibold text-primary group-hover:underline">Lire →</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}