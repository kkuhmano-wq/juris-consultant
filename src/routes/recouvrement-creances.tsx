import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/recouvrement-creances")({
  beforeLoad: () => {
    throw redirect({ to: "/contentieux" });
  },
});

const services = [
  "Analyse du dossier de créance",
  "Mise en demeure",
  "Négociation amiable",
  "Recouvrement judiciaire",
  "Suivi de l'exécution des décisions",
  "Conseil en prévention des impayés",
];

function RecouvrementPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Recouvrement de Créances
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Protégez votre trésorerie et récupérez efficacement les sommes qui
            vous sont dues grâce à notre accompagnement en recouvrement amiable
            et judiciaire.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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
            Transformez vos impayés en solutions
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Les créances impayées peuvent fragiliser la trésorerie et ralentir
            le développement d'une entreprise. Une intervention rapide et
            méthodique augmente considérablement les chances de recouvrement.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Cabinet JurisConsultants vous accompagne dans toutes les étapes du
            recouvrement, depuis les démarches amiables jusqu'aux procédures
            judiciaires, afin de défendre efficacement vos intérêts financiers.
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
                <HandCoins className="h-8 w-8 text-primary" />
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
            Pourquoi nous confier votre recouvrement ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Réduction des délais de paiement",
              "Préservation de la relation commerciale lorsque possible",
              "Stratégie adaptée à chaque dossier",
              "Accompagnement de la phase amiable à la phase judiciaire",
              "Suivi rigoureux des procédures",
              "Protection des intérêts financiers du client",
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
            Notre méthode
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Analyse",
                desc: "Étude du dossier et des justificatifs.",
              },
              {
                step: "02",
                title: "Mise en demeure",
                desc: "Demande formelle adressée au débiteur.",
              },
              {
                step: "03",
                title: "Négociation",
                desc: "Recherche d'une solution amiable.",
              },
              {
                step: "04",
                title: "Procédure",
                desc: "Action judiciaire si nécessaire.",
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
              Une facture impayée ? Un débiteur récalcitrant ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous dès maintenant afin d'évaluer votre dossier et de
              mettre en place une stratégie de recouvrement adaptée.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20Cabinet JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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