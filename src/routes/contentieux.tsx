import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Gavel, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/contentieux")({
  head: () => ({
    meta: [
      {
        title:
          "Contentieux | JURIS-CONSULTANT - Conseil Juridique & Fiscal",
      },
      {
        name: "description",
        content:
          "Assistance et représentation devant les juridictions. Contentieux commercial, civil, social, fiscal et recouvrement de créances.",
      },
    ],
  }),
  component: ContentieuxPage,
});

const services = [
  "Contentieux commercial",
  "Contentieux civil",
  "Contentieux social",
  "Contentieux fiscal",
  "Recouvrement judiciaire",
  "Exécution des décisions de justice",
];

function ContentieuxPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Contentieux
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Lorsque le dialogue ne suffit plus, nous vous accompagnons dans la
            défense de vos droits et la protection de vos intérêts devant les
            juridictions compétentes.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20JURIS-CONSULTANT,%20je%20souhaite%20obtenir%20un%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Obtenir une consultation
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Défendre vos intérêts avec rigueur et détermination
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Les litiges peuvent avoir des conséquences importantes sur vos
            activités, votre patrimoine ou votre réputation. Une stratégie
            juridique adaptée permet de maximiser vos chances de succès et de
            limiter les risques.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            JURIS-CONSULTANT vous accompagne dans la prévention des conflits,
            les négociations amiables et la conduite des procédures judiciaires
            lorsque celles-ci deviennent nécessaires.
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
                <Gavel className="h-8 w-8 text-primary" />
                <p className="mt-4 font-medium text-foreground">
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Pourquoi choisir JURIS-CONSULTANT ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Analyse approfondie des dossiers",
              "Stratégie adaptée à chaque litige",
              "Accompagnement personnalisé",
              "Recherche prioritaire de solutions efficaces",
              "Suivi rigoureux des procédures",
              "Protection des intérêts du client",
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

      {/* PROCESSUS */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Notre méthode d'intervention
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Analyse",
                desc: "Étude complète du dossier.",
              },
              {
                step: "02",
                title: "Stratégie",
                desc: "Définition de la meilleure approche.",
              },
              {
                step: "03",
                title: "Action",
                desc: "Négociation ou procédure judiciaire.",
              },
              {
                step: "04",
                title: "Suivi",
                desc: "Accompagnement jusqu'à la résolution.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-background p-6"
              >
                <div className="font-serif text-5xl text-primary/30">
                  {item.step}
                </div>

                <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground">
                  {item.desc}
                </p>
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
              Vous êtes confronté à un litige ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui afin d'évaluer votre situation et
              définir la stratégie la plus adaptée à la défense de vos intérêts.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20JURIS-CONSULTANT,%20je%20souhaite%20obtenir%20un%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              Parler à un expert
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}