import { createFileRoute } from "@tanstack/react-router";
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

const categories = [
  "Fiscalité",
  "Droit des affaires",
  "Droit du travail",
  "Conseils pratiques",
  "Veille réglementaire",
];

const posts = [
  {
    cat: "Fiscalité",
    title: "Contrôle fiscal : les bons réflexes pour le préparer sereinement.",
    date: "12 juin 2026",
    excerpt:
      "Les étapes essentielles pour anticiper un contrôle fiscal et sécuriser vos échanges avec l'administration.",
  },
  {
    cat: "Droit des affaires",
    title: "Pacte d'associés : pourquoi le rédiger dès la création de la société.",
    date: "28 mai 2026",
    excerpt:
      "Un pacte solide prévient la majorité des conflits entre associés. Voici les clauses incontournables.",
  },
  {
    cat: "Droit du travail",
    title: "Rupture conventionnelle : sécuriser la procédure côté employeur.",
    date: "10 mai 2026",
    excerpt:
      "Conditions, formalisme et risques contentieux : ce qu'il faut maîtriser avant de signer.",
  },
  {
    cat: "Conseils pratiques",
    title: "Recouvrement amiable : la lettre de mise en demeure qui fonctionne.",
    date: "22 avril 2026",
    excerpt:
      "Structure, ton, délais : nos recommandations pour maximiser vos chances de paiement rapide.",
  },
  {
    cat: "Veille réglementaire",
    title: "Nouvelles obligations déclaratives : ce qui change pour les PME.",
    date: "5 avril 2026",
    excerpt:
      "Synthèse des dernières évolutions et de leur impact opérationnel pour les dirigeants.",
  },
  {
    cat: "Fiscalité",
    title: "Optimisation fiscale ou évasion : tracer la ligne en toute sécurité.",
    date: "18 mars 2026",
    excerpt: "Une optimisation efficace s'inscrit dans la conformité. Notre méthodologie.",
  },
];

function ActualitesPage() {
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
            {categories.map((c) => (
              <button
                key={c}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.title}
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
                <span>{p.date}</span>
                <span className="font-semibold text-primary group-hover:underline">Lire →</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
