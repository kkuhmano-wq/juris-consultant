import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Rocket, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/creation-entreprise")({
  head: () => ({
    meta: [
      {
        title:
          "Création d'Entreprise | Cabinet JurisConsultants - Conseil Juridique & Fiscal",
      },
      {
        name: "description",
        content:
          "Accompagnement à la création d'entreprise. Choix de la forme juridique, formalités administratives, immatriculation, fiscalité et structuration de l'activité.",
      },
    ],
  }),
  component: CreationEntreprisePage,
});

const services = [
  "Choix de la forme juridique",
  "Rédaction des statuts",
  "Immatriculation de l'entreprise",
  "Obtention des autorisations nécessaires",
  "Conseil fiscal du démarrage",
  "Structuration juridique de l'activité",
];

function CreationEntreprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Création d'Entreprise
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Transformez votre idée en entreprise solide grâce à un accompagnement
            juridique et fiscal complet dès les premières étapes de votre projet.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Lancer mon projet
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Donnez à votre projet des bases solides
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La réussite d'une entreprise commence par une bonne structuration
            juridique et fiscale. Le choix du statut, la rédaction des actes
            constitutifs et le respect des formalités sont essentiels pour éviter
            les difficultés futures.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Cabinet JurisConsultants accompagne les entrepreneurs à chaque étape afin de
            sécuriser leur projet et leur permettre de démarrer leur activité en
            toute sérénité.
          </p>
        </div>
      </section>

      {/* SERVICES */}
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
                <Rocket className="h-8 w-8 text-primary" />
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
            Pourquoi nous confier votre projet ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Accompagnement personnalisé",
              "Sécurisation juridique du projet",
              "Optimisation fiscale dès le démarrage",
              "Gain de temps dans les formalités",
              "Conseils adaptés à votre activité",
              "Assistance après la création",
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

      {/* ETAPES */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Notre accompagnement en 4 étapes
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Analyse",
                desc: "Compréhension de votre projet.",
              },
              {
                step: "02",
                title: "Structuration",
                desc: "Choix de la forme juridique adaptée.",
              },
              {
                step: "03",
                title: "Formalités",
                desc: "Constitution et immatriculation.",
              },
              {
                step: "04",
                title: "Suivi",
                desc: "Assistance après la création.",
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
              Vous souhaitez créer votre entreprise ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Parlons de votre projet. Nous vous accompagnons dans toutes les
              démarches nécessaires à la création et au développement de votre
              activité.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              Échanger avec un conseiller
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}