import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, BookOpen, Users, Presentation, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/formation")({
  head: () => ({
    meta: [
      {
        title:
          "Formation & Renforcement des Capacités | Cabinet JurisConsultants",
      },
      {
        name: "description",
        content:
          "Formations professionnelles en droit, fiscalité et management : renforcement des capacités, séminaires et ateliers pratiques pour entreprises et institutions.",
      },
    ],
  }),
  component: FormationPage,
});

const services = [
  { icon: GraduationCap, label: "Formations juridiques" },
  { icon: BookOpen, label: "Formations fiscales" },
  { icon: Users, label: "Renforcement des capacités" },
  { icon: Presentation, label: "Séminaires professionnels" },
  { icon: CheckCircle2, label: "Ateliers pratiques" },
];

function FormationPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Formation<br />& Renforcement des Capacités
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Nous proposons des formations professionnelles adaptées aux besoins des entreprises
            et institutions.
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
            Développez les compétences de vos équipes
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La formation professionnelle est un investissement stratégique pour toute
            organisation. Notre cabinet conçoit et anime des programmes de formation
            sur mesure, adaptés aux besoins spécifiques de vos équipes.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Domaines couverts : droit des affaires, fiscalité, gestion d'entreprise,
            conformité, management et développement des compétences. Nos formations
            allient théorie et pratique pour un impact immédiat.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Nos formations
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
            Pourquoi nous choisir ?
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              "Formateurs experts et expérimentés",
              "Programmes sur mesure",
              "Approche pédagogique interactive",
              "Formations en présentiel et à distance",
              "Suivi post-formation",
              "Certificats de formation",
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
              Vous souhaitez former vos équipes ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Contactez-nous pour construire ensemble un programme adapté à vos besoins.
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
