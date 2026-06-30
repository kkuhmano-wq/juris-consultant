import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Landmark, Building, Sprout, Compass, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/developpement-territorial")({
  head: () => ({
    meta: [
      {
        title:
          "Développement Territorial & Bureau d'Études | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Accompagnement des collectivités et entreprises dans le développement local, l'aménagement urbain et les études agro-industrielles et touristiques.",
      },
    ],
  }),
  component: DeveloppementTerritorialPage,
});

const services = [
  { icon: Landmark, label: "Assistance au développement local" },
  { icon: Building, label: "Politiques locales d'aménagement urbain" },
  { icon: Sprout, label: "Bureau d'études agro-industrielles" },
  { icon: Compass, label: "Bureau d'études touristiques" },
];

function DeveloppementTerritorialPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Développement Territorial<br />& Bureau d'Études
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous accompagnons les collectivités, institutions et entreprises dans leurs
            projets de développement.
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
            Accompagner les territoires vers leur développement
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Le développement territorial repose sur une vision stratégique et une connaissance
            approfondie des réalités locales. Notre cabinet assiste les collectivités et les
            institutions dans la définition et la mise en œuvre de leurs politiques de
            développement.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            À travers nos bureaux d'études spécialisés, nous apportons notre expertise aux
            projets agro-industriels et touristiques, de la phase d'étude à la réalisation.
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
            Pourquoi collaborer avec nous ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Expertise en développement local et régional",
              "Connaissance des enjeux territoriaux",
              "Bureaux d'études spécialisés (agro-industrie, tourisme)",
              "Accompagnement de la stratégie à la réalisation",
              "Réseau de partenaires institutionnels",
              "Approche participative et inclusive",
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
              Vous portez un projet de développement territorial ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous pour échanger sur votre projet.
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
