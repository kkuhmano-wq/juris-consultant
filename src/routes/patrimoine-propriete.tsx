import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Building2, Copyright, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/patrimoine-propriete")({
  head: () => ({
    meta: [
      {
        title:
          "Patrimoine & Propriété | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Protection des actifs fonciers, immobiliers et intellectuels : protection foncière, sécurisation immobilière, marques, propriété artistique et industrielle.",
      },
    ],
  }),
  component: PatrimoineProprietePage,
});

const services = [
  { icon: Building2, label: "Protection foncière et immobilière" },
  { icon: ShieldCheck, label: "Gestion des risques patrimoniaux" },
  { icon: Copyright, label: "Propriété artistique" },
  { icon: ShieldCheck, label: "Marques commerciales" },
  { icon: ShieldCheck, label: "Propriété industrielle" },
];

function PatrimoineProprietePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Patrimoine<br />& Propriété
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous protégeons les actifs fonciers, immobiliers et intellectuels de nos clients.
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
            Sécuriser et valoriser votre patrimoine
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La protection de vos actifs est essentielle à la pérennité de votre entreprise
            et à la préservation de votre patrimoine personnel. Qu'il s'agisse de biens
            fonciers, immobiliers ou de droits de propriété intellectuelle, notre cabinet
            vous accompagne dans toutes les démarches de sécurisation.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Nous intervenons également dans la gestion des risques patrimoniaux, la
            protection de vos marques et créations, et la défense de vos droits de
            propriété industrielle et artistique.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Nos domaines d'intervention
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            Pourquoi nous confier votre patrimoine ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Expertise en droit foncier et immobilier",
              "Protection complète de vos actifs",
              "Accompagnement personnalisé",
              "Stratégie patrimoniale sur mesure",
              "Défense de vos droits de propriété intellectuelle",
              "Suivi rigoureux des procédures",
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
              Vous souhaitez protéger vos actifs ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous pour une analyse de votre situation patrimoniale.
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
