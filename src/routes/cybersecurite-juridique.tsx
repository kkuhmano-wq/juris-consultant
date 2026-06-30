import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Shield, Lock, Search, Database, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/cybersecurite-juridique")({
  head: () => ({
    meta: [
      {
        title:
          "Numérique & Cybersécurité Juridique | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Sécurisation juridique des systèmes d'information : droit de la sécurité, audit, analyse des risques numériques et protection des données.",
      },
    ],
  }),
  component: CybersecuriteJuridiquePage,
});

const services = [
  { icon: Shield, label: "Droit de la sécurité des systèmes d'information" },
  { icon: Search, label: "Audit de sécurité juridique" },
  { icon: Lock, label: "Analyse des risques numériques" },
  { icon: Database, label: "Protection des données" },
];

function CybersecuriteJuridiquePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Numérique<br />& Cybersécurité Juridique
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous sécurisons juridiquement les systèmes d'information et les activités numériques.
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
            La sécurité juridique à l'ère numérique
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La transformation numérique expose les entreprises à des risques juridiques
            nouveaux. Protection des données, conformité réglementaire, sécurisation des
            systèmes d'information : notre cabinet vous accompagne pour anticiper et maîtriser
            ces enjeux.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nous réalisons des audits de sécurité juridique, analysons les risques liés à
            vos activités numériques et vous conseillons sur les mesures à mettre en œuvre
            pour assurer votre conformité et protéger vos données.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Nos domaines d'intervention
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {services.map((s) => (
              <div key={s.label} className="rounded-2xl bg-background p-6 border border-border">
                <s.icon className="h-8 w-8 text-primary" />
                <p className="mt-4 font-medium text-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Pourquoi nous faire confiance ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Expertise en droit du numérique",
              "Approche pluridisciplinaire (droit + technique)",
              "Audit complet de votre sécurité juridique",
              "Accompagnement dans la mise en conformité",
              "Veille réglementaire permanente",
              "Solutions adaptées à votre secteur d'activité",
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

      <section className="section-pad">
        <div className="container-page">
          <div className="rounded-3xl bg-[var(--gradient-ink)] p-12 text-center">
            <h2 className="font-serif text-4xl font-semibold text-background">
              Besoin de sécuriser vos activités numériques ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous pour un audit de votre sécurité juridique numérique.
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
