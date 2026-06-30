import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Scale, Calculator, Building2, Gavel, Rocket, ShieldCheck, Shield, Users, Landmark, GraduationCap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/expertises")({
  head: () => ({
    meta: [
      { title: "Expertises — Cabinet JurisConsultants" },
      {
        name: "description",
        content:
          "Découvrez nos 10 pôles d'expertise : conseil juridique, fiscal, opérations complexes, contentieux, création d'entreprise, patrimoine, cybersécurité, RH, développement territorial et formation.",
      },
      { property: "og:title", content: "Expertises — Cabinet JurisConsultants" },
      { property: "og:url", content: "/expertises" },
    ],
    links: [{ rel: "canonical", href: "/expertises" }],
  }),
  component: ExpertisesPage,
});

const poles = [
  {
    icon: Scale,
    title: "Conseil Juridique & Gouvernance",
    desc: "Nous accompagnons les entreprises dans leur organisation juridique, leur conformité et la sécurisation de leurs opérations.",
    items: [
      "Droit des sociétés",
      "Gouvernance d'entreprise",
      "Contrats et conventions",
      "Formalités juridiques",
      "Secrétariat juridique",
      "Gestion de portefeuille juridique",
      "Médiation",
      "Intermédiation",
      "Audit juridique et analyse des risques",
    ],
    href: "/conseil-juridique",
  },
  {
    icon: Calculator,
    title: "Conseil Fiscal & Optimisation",
    desc: "Nous aidons les entreprises et les particuliers à maîtriser leurs obligations fiscales et à optimiser leur stratégie financière.",
    items: [
      "Déclarations fiscales",
      "Contrôle fiscal",
      "Audit fiscal",
      "Contentieux fiscal",
      "Optimisation fiscale",
    ],
    href: "/conseil-fiscal",
  },
  {
    icon: Building2,
    title: "Opérations Complexes & Stratégie d'Entreprise",
    desc: "Nous accompagnons les opérations stratégiques à forte valeur ajoutée et les transformations d'entreprise.",
    items: [
      "Fusion d'entreprises",
      "Acquisition d'entreprises",
      "Offres publiques d'acquisition",
      "Études prospectives",
      "Stratégies d'entreprise",
      "Conseil aux investisseurs",
    ],
    href: "/operations-complexes",
  },
  {
    icon: Gavel,
    title: "Recouvrement & Contentieux",
    desc: "Nous assistons nos clients dans la prévention, la gestion et la résolution de leurs litiges.",
    items: [
      "Recouvrement amiable et judiciaire",
      "Stratégie contentieuse",
      "Représentation et négociation",
      "Exécution des décisions",
      "Gestion des litiges commerciaux",
    ],
    href: "/contentieux",
  },
  {
    icon: Rocket,
    title: "Création & Développement d'Entreprises",
    desc: "Nous accompagnons les entrepreneurs à chaque étape de leur projet.",
    items: [
      "Choix de la structure juridique",
      "Formalités constitutives",
      "Conseil au porteur de projet",
      "Structuration des activités",
      "Assistance administrative",
    ],
    href: "/creation-entreprise",
  },
  {
    icon: ShieldCheck,
    title: "Patrimoine & Propriété",
    desc: "Nous protégeons les actifs fonciers, immobiliers et intellectuels de nos clients.",
    items: [
      "Protection foncière et immobilière",
      "Gestion des risques patrimoniaux",
      "Propriété artistique",
      "Marques commerciales",
      "Propriété industrielle",
    ],
    href: "/patrimoine-propriete",
  },
  {
    icon: Shield,
    title: "Numérique & Cybersécurité Juridique",
    desc: "Nous sécurisons juridiquement les systèmes d'information et les activités numériques.",
    items: [
      "Droit de la sécurité des systèmes d'information",
      "Audit de sécurité juridique",
      "Analyse des risques numériques",
      "Protection des données",
    ],
    href: "/cybersecurite-juridique",
  },
  {
    icon: Users,
    title: "Ressources Humaines & Psychologie du Travail",
    desc: "Nous accompagnons les entreprises dans la gestion humaine et organisationnelle.",
    items: [
      "Gestion des ressources humaines",
      "Psychologie du travail",
      "Gestion des conflits",
      "Accompagnement managérial",
    ],
    href: "/ressources-humaines",
  },
  {
    icon: Landmark,
    title: "Développement Territorial & Bureau d'Études",
    desc: "Nous accompagnons les collectivités, institutions et entreprises dans leurs projets de développement.",
    items: [
      "Assistance au développement local",
      "Politiques locales d'aménagement urbain",
      "Bureau d'études agro-industrielles",
      "Bureau d'études touristiques",
    ],
    href: "/developpement-territorial",
  },
  {
    icon: GraduationCap,
    title: "Formation & Renforcement des Capacités",
    desc: "Nous proposons des formations professionnelles adaptées aux besoins des entreprises et institutions.",
    items: [
      "Formations juridiques et fiscales",
      "Renforcement des capacités",
      "Séminaires professionnels",
      "Ateliers pratiques",
    ],
    href: "/formation",
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
            Dix pôles d'expertise au service de votre réussite.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Du conseil juridique à la formation, en passant par la cybersécurité et le développement territorial,
            Cabinet JurisConsultants couvre l'ensemble des besoins de votre organisation.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-2">
          {poles.map((p) => (
            <Link
              key={p.title}
              to={p.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                <p.icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2">
                {p.items.slice(0, 4).map((i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {i}
                  </li>
                ))}
                {p.items.length > 4 && (
                  <li className="text-xs font-medium text-primary">
                    +{p.items.length - 4} autres services
                  </li>
                )}
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary group-hover:gap-2.5 transition-all">
                Découvrir cette expertise
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
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
