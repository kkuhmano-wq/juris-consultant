import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Gavel, HandCoins, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/contentieux")({
  head: () => ({
    meta: [
      {
        title:
          "Recouvrement & Contentieux | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Assistance en recouvrement de créances et contentieux : mise en demeure, négociation, procédures judiciaires, représentation et exécution des décisions.",
      },
    ],
  }),
  component: ContentieuxPage,
});

const recouvrementServices = [
  "Mise en demeure",
  "Négociation amiable",
  "Procédures judiciaires",
  "Exécution des décisions",
  "Conseil en prévention des impayés",
];

const contentieuxServices = [
  "Stratégie contentieuse",
  "Représentation devant les juridictions",
  "Négociation amiable",
  "Contentieux commercial",
  "Contentieux civil et social",
  "Contentieux fiscal",
];

function ContentieuxPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Recouvrement<br />& Contentieux
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous assistons nos clients dans la prévention, la gestion et la résolution de
            leurs litiges, du recouvrement amiable à la représentation en justice.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet%20JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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

      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Défendre vos intérêts avec rigueur et détermination
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Les litiges et les impayés peuvent avoir des conséquences importantes sur vos
            activités, votre trésorerie ou votre réputation. Une stratégie adaptée permet de
            maximiser vos chances de succès et de limiter les risques.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Cabinet JurisConsultants vous accompagne dans la prévention des conflits,
            les négociations amiables, le recouvrement de vos créances et la conduite des
            procédures judiciaires lorsque celles-ci deviennent nécessaires.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <HandCoins className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h2 className="font-serif text-3xl font-semibold text-ink">Recouvrement</h2>
              </div>
              <div className="space-y-3">
                {recouvrementServices.map((s) => (
                  <div key={s} className="flex items-start gap-3 rounded-xl bg-background border border-border p-4">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Gavel className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h2 className="font-serif text-3xl font-semibold text-ink">Contentieux</h2>
              </div>
              <div className="space-y-3">
                {contentieuxServices.map((s) => (
                  <div key={s} className="flex items-start gap-3 rounded-xl bg-background border border-border p-4">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Pourquoi choisir Cabinet JurisConsultants ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Analyse approfondie des dossiers",
              "Stratégie adaptée à chaque litige",
              "Accompagnement de la phase amiable à la phase judiciaire",
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

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Notre méthode d'intervention
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Analyse", desc: "Étude complète du dossier." },
              { step: "02", title: "Stratégie", desc: "Définition de la meilleure approche." },
              { step: "03", title: "Action", desc: "Négociation ou procédure judiciaire." },
              { step: "04", title: "Suivi", desc: "Accompagnement jusqu'à la résolution." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-background p-6">
                <div className="font-serif text-5xl text-primary/30">{item.step}</div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="rounded-3xl bg-[var(--gradient-ink)] p-12 text-center">
            <h2 className="font-serif text-4xl font-semibold text-background">
              Vous êtes confronté à un litige ou un impayé ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui afin d'évaluer votre situation et
              définir la stratégie la plus adaptée à la défense de vos intérêts.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet%20JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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
