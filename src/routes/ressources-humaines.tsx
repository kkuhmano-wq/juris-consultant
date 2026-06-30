import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Users, Brain, Handshake, TrendingUp, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/ressources-humaines")({
  head: () => ({
    meta: [
      {
        title:
          "Ressources Humaines & Psychologie du Travail | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Accompagnement en gestion des ressources humaines, psychologie du travail, gestion des conflits et accompagnement managérial.",
      },
    ],
  }),
  component: RessourcesHumainesPage,
});

const services = [
  { icon: Users, label: "Gestion des ressources humaines" },
  { icon: Brain, label: "Psychologie du travail" },
  { icon: Handshake, label: "Gestion des conflits" },
  { icon: TrendingUp, label: "Accompagnement managérial" },
];

function RessourcesHumainesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Ressources Humaines<br />& Psychologie du Travail
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous accompagnons les entreprises dans la gestion humaine et organisationnelle.
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
            L'humain au cœur de la performance
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La gestion des ressources humaines et la psychologie du travail sont des leviers
            essentiels de la performance et du bien-être en entreprise. Notre cabinet vous
            accompagne dans l'optimisation de vos pratiques RH et la résolution des conflits.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nous intervenons auprès des directions et des équipes pour faciliter le dialogue,
            prévenir les tensions et développer un management adapté aux enjeux contemporains
            du travail.
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
            Pourquoi nous choisir ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Approche pluridisciplinaire (droit + psychologie)",
              "Accompagnement personnalisé",
              "Médiation et gestion des conflits",
              "Développement du bien-être au travail",
              "Formation des managers",
              "Stratégies RH adaptées à votre structure",
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
              Des défis RH à relever ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous pour un diagnostic de votre organisation humaine.
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
