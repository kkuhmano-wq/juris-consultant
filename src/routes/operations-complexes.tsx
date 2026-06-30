import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/operations-complexes")({
  head: () => ({
    meta: [
      {
        title:
          "Opérations Complexes & Stratégie d'Entreprise | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Accompagnement dans les opérations stratégiques : fusions, acquisitions, OPA, études prospectives, stratégies d'entreprise et conseil aux investisseurs.",
      },
    ],
  }),
  component: OperationsComplexesPage,
});

const services = [
  "Fusion d'entreprises",
  "Acquisition d'entreprises",
  "Offres publiques d'acquisition (OPA)",
  "Études prospectives",
  "Stratégies d'entreprise",
  "Conseil aux investisseurs",
];

function OperationsComplexesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Opérations Complexes<br />& Stratégie d'Entreprise
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous accompagnons les opérations stratégiques à forte valeur ajoutée et les
            transformations d'entreprise.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet%20JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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

      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Des opérations qui transforment votre entreprise
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Les opérations juridiques complexes modifient profondément la structure, le contrôle,
            le patrimoine ou l'organisation d'une entreprise. Elles mobilisent plusieurs domaines
            du droit : droit des sociétés, droit des affaires, droit fiscal, droit social, droit
            de la concurrence.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Notre cabinet vous accompagne dans la définition de votre stratégie, l'évaluation
            des opportunités et la sécurisation juridique de chaque opération.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Nos prestations
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service}
                className="rounded-2xl bg-background p-6 border border-border"
              >
                <Building2 className="h-8 w-8 text-primary" />
                <p className="mt-4 font-medium text-foreground">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Accompagnement stratégique
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Au-delà du conseil juridique, nous agissons comme un partenaire stratégique pour
            nos clients. Nos études prospectives et notre analyse des marchés permettent
            d'identifier les opportunités de croissance externe, les partenariats potentiels
            et les risques à anticiper.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nous conseillons les investisseurs dans leurs décisions d'investissement, la
            structuration de leurs participations et la gestion de leur portefeuille
            d'entreprises.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Notre valeur ajoutée
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Expertise pluridisciplinaire (juridique, fiscale, stratégique)",
              "Accompagnement sur mesure à chaque étape",
              "Confidentialité et discrétion absolues",
              "Réseau de partenaires spécialisés",
              "Vision long terme et création de valeur",
              "Réactivité et disponibilité permanente",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl bg-background border border-border p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="rounded-3xl bg-[var(--gradient-ink)] p-12 text-center">
            <h2 className="font-serif text-4xl font-semibold text-background">
              Un projet de fusion, acquisition ou transformation ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Notre cabinet vous accompagne dans la sécurisation et la réalisation
              de vos opérations stratégiques.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet%20JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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
