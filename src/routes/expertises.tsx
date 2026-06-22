import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Scale, Calculator, Briefcase, HandCoins, Rocket, Gavel } from "lucide-react";

export const Route = createFileRoute("/expertises")({
  head: () => ({
    meta: [
      { title: "Expertises — JURIS-CONSULTANT" },
      {
        name: "description",
        content:
          "Conseil juridique, conseil fiscal, droit du travail, recouvrement, création d'entreprise et contentieux.",
      },
      { property: "og:title", content: "Expertises — JURIS-CONSULTANT" },
      { property: "og:url", content: "/expertises" },
    ],
    links: [{ rel: "canonical", href: "/expertises" }],
  }),
  component: ExpertisesPage,
});
const blocks = [
  {
    icon: Scale,
    title: "Conseil Juridique",
    href: "/conseil-juridique",
    items: ["Droit des sociétés", "Gouvernance", "Contrats", "Formalités juridiques"],
  },
  {
    icon: Calculator,
    title: "Conseil Fiscal",
    href: "/conseil-fiscal",
    items: ["Déclarations fiscales", "Contrôle fiscal", "Audit fiscal", "Contentieux fiscal"],
  },
  {
    icon: Briefcase,
    title: "Opérations Complexes",
    href: "/operations-complexes",
    items: ["Fusions", "Acquisitions d'entreprises", "Offres publiques d'acquisition (OPA)"],
  },
  {
    icon: HandCoins,
    title: "Recouvrement",
    href: "/recouvrement-creances",
    items: ["Mise en demeure", "Négociation", "Procédures judiciaires"],
  },
  {
    icon: Rocket,
    title: "Création d'Entreprise",
    href: "/creation-entreprise",
    items: ["Choix de la structure", "Formalités constitutives", "Conseil au porteur de projet"],
  },
  {
    icon: Gavel,
    title: "Contentieux",
    href: "/contentieux",
    items: ["Stratégie", "Représentation", "Négociation amiable"],
  },
];

function ExpertisesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <span className="eyebrow">Expertises</span>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Des domaines d'intervention au service de votre activité.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Du conseil stratégique au contentieux, JURIS-CONSULTANT couvre l'ensemble des
            problématiques juridiques et fiscales auxquelles vous êtes confronté.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {blocks.map((b) => (
  <Link
    key={b.title}
    to={b.href}
    className="group rounded-2xl border border-border bg-card p-10 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
  >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                <b.icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <h2 className="mt-6 font-serif text-3xl font-semibold text-ink">{b.title}</h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-primary">
  En savoir plus →
</p>
              <ul className="mt-6 space-y-3">
                {b.items.map((i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {i}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-semibold text-ink md:text-5xl">
            Une problématique spécifique&nbsp;? Parlons-en.
          </h2>
          <Link to="/contact" className="btn-primary mt-8">
            Prendre rendez-vous
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
