import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Scale, Briefcase, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/conseil-juridique")({
  head: () => ({
    meta: [
      {
        title:
          "Conseil Juridique | JURIS-CONSULTANT - Conseil Juridique & Fiscal",
      },
      {
        name: "description",
        content:
          "Accompagnement juridique des entreprises, commerçants, investisseurs et particuliers. Contrats, droit des sociétés, gouvernance et sécurisation des activités.",
      },
    ],
  }),
  component: ConseilJuridiquePage,
});

const services = [
  "Rédaction et analyse de contrats",
  "Création et structuration d'entreprises",
  "Droit des sociétés",
  "Gouvernance et conformité",
  "Conseil stratégique",
  "Prévention des risques juridiques",
];

const droitTravailServices = [
  "Contrats de travail (CDI, CDD, CDI de chantier)",
  "Procédures de licenciement et ruptures conventionnelles",
  "Litiges prud'homaux et contentieux sociaux",
  "Négociation d'accords collectifs",
  "Conformité aux normes OHADA du travail",
  "Conseil en gestion des relations sociales",
];

function ConseilJuridiquePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Conseil Juridique
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous accompagnons les entreprises, commerçants, investisseurs et
            particuliers dans la sécurisation de leurs activités et la prise de
            décisions juridiques fiables.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20JURIS-CONSULTANT,%20je%20souhaite%20obtenir%20un%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Prendre rendez-vous
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Sécurisez vos décisions et vos opérations
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Les décisions juridiques ont un impact direct sur la stabilité et le
            développement des activités. Notre cabinet vous accompagne afin
            d'anticiper les risques, de garantir la conformité de vos actes et
            de protéger durablement vos intérêts.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nous intervenons à toutes les étapes de la vie de votre entreprise,
            depuis sa création jusqu'à son développement, en passant par la
            gestion de ses relations contractuelles et institutionnelles.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Nos domaines d'intervention
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service}
                className="rounded-2xl bg-background p-6 border border-border"
              >
                <Scale className="h-8 w-8 text-primary" />
                <p className="mt-4 font-medium text-foreground">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DROIT DU TRAVAIL */}
      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Droit du Travail
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Le droit du travail encadre les relations entre employeurs et
            salariés, de l'embauche à la rupture du contrat. Notre cabinet vous
            accompagne dans la sécurisation de vos pratiques en ressources
            humaines et la gestion des contentieux sociaux.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nous intervenons dans le respect du cadre OHADA et du droit social
            ivoirien, pour vous permettre de gérer sereinement vos relations
            avec vos collaborateurs.
          </p>
        </div>

        <div className="container-page mt-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {droitTravailServices.map((service) => (
              <div
                key={service}
                className="rounded-2xl bg-secondary p-6 border border-border"
              >
                <Briefcase className="h-8 w-8 text-primary" />
                <p className="mt-4 font-medium text-foreground">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Pourquoi faire appel à JURIS-CONSULTANT ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Analyse approfondie de chaque dossier",
              "Solutions adaptées à votre activité",
              "Accompagnement personnalisé",
              "Réactivité et disponibilité",
              "Respect de la confidentialité",
              "Expertise juridique multidisciplinaire",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="container-page">
          <div className="rounded-3xl bg-[var(--gradient-ink)] p-12 text-center">
            <h2 className="font-serif text-4xl font-semibold text-background">
              Besoin d'un accompagnement juridique ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Nos experts sont à votre disposition pour analyser votre situation
              et vous proposer des solutions adaptées à vos besoins.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20JURIS-CONSULTANT,%20je%20souhaite%20obtenir%20un%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              Contacter un expert
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}