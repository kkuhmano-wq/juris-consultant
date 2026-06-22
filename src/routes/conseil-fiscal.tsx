import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/conseil-fiscal")({
  head: () => ({
    meta: [
      {
        title:
          "Conseil Fiscal | JURIS-CONSULTANT - Conseil Juridique & Fiscal",
      },
      {
        name: "description",
        content:
          "Conseil fiscal pour entreprises, commerçants et investisseurs. Optimisation fiscale, déclarations, contrôle fiscal, audit fiscal et contentieux fiscal.",
      },
    ],
  }),
  component: ConseilFiscalPage,
});

const services = [
  "Optimisation fiscale",
  "Déclarations fiscales",
  "Audit fiscal",
  "Assistance en contrôle fiscal",
  "Contentieux fiscal",
  "Conseil en conformité fiscale",
];

function ConseilFiscalPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Conseil Fiscal
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous accompagnons les entreprises, commerçants et investisseurs dans
            la gestion de leurs obligations fiscales afin d'assurer leur
            conformité tout en optimisant leur situation fiscale dans le respect
            de la réglementation.
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
            Une fiscalité maîtrisée pour une croissance sécurisée
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La fiscalité constitue un enjeu majeur pour toute organisation.
            Une mauvaise gestion fiscale peut entraîner des pénalités,
            redressements ou contentieux coûteux.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            JURIS-CONSULTANT vous accompagne dans la compréhension de vos
            obligations fiscales, l'optimisation de votre charge fiscale et la
            sécurisation de vos opérations afin de garantir la pérennité de vos
            activités.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Nos prestations fiscales
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service}
                className="rounded-2xl bg-background p-6 border border-border"
              >
                <Calculator className="h-8 w-8 text-primary" />
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
            Pourquoi nous confier votre fiscalité ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Réduction des risques fiscaux",
              "Optimisation conforme à la réglementation",
              "Préparation efficace aux contrôles fiscaux",
              "Assistance lors des contentieux",
              "Conseils adaptés à votre secteur d'activité",
              "Veille fiscale permanente",
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
              Besoin d'un accompagnement fiscal ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Échangez avec nos experts afin d'obtenir une analyse de votre
              situation fiscale et des solutions adaptées à vos objectifs.
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