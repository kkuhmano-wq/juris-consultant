import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import aboutCover from "@/assets/about-cover.jpg";
import heroFounder from "@/assets/hero-founder.jpg";
import { Award, Heart, Lock, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/cabinet")({
  head: () => ({
    meta: [
      { title: "Le Cabinet — JURIS-CONSULTANT" },
      {
        name: "description",
        content:
          "Découvrez JURIS-CONSULTANT : mission, vision, valeurs et fondateur du cabinet de conseil juridique et fiscal.",
      },
      { property: "og:title", content: "Le Cabinet — JURIS-CONSULTANT" },
      { property: "og:url", content: "/cabinet" },
    ],
    links: [{ rel: "canonical", href: "/cabinet" }],
  }),
  component: CabinetPage,
});

const values = [
  { icon: Award, label: "Excellence" },
  { icon: Heart, label: "Intégrité" },
  { icon: Lock, label: "Confidentialité" },
  { icon: Sparkles, label: "Professionnalisme" },
  { icon: Users, label: "Proximité" },
];

function CabinetPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <span className="eyebrow">Le Cabinet</span>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Qui sommes-nous&nbsp;?
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            JURIS-CONSULTANT est un cabinet spécialisé en conseil juridique et fiscal. Nous mettons
            notre expertise au service de la sécurité et de la performance de nos clients.
          </p>
        </div>
        <img
          src={aboutCover}
          alt="Architecture corporate"
          width={1600}
          height={1000}
          loading="lazy"
          className="h-72 w-full object-cover md:h-96"
        />
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-10">
            <span className="eyebrow">Mission</span>
            <h2 className="mt-5 font-serif text-3xl font-semibold text-ink">
              Apporter des solutions juridiques et fiscales fiables.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Nous accompagnons nos clients pour qu'ils prennent des décisions éclairées, conformes
              et porteuses de valeur durable.
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--gradient-ink)] p-10 text-background">
            <span className="eyebrow text-primary-soft before:bg-primary-soft">Vision</span>
            <h2 className="mt-5 font-serif text-3xl font-semibold text-background">
              Devenir une référence du conseil juridique et fiscal en Afrique francophone.
            </h2>
            <p className="mt-5 text-background/75">
              Construire une signature reconnue pour son exigence, son intégrité et la qualité de
              ses recommandations.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow mx-auto justify-center">Valeurs</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Cinq principes qui guident chacune de nos missions.
            </h2>
          </div>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <li key={v.label} className="rounded-2xl bg-background p-8 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
                  <v.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <p className="mt-5 font-serif text-lg font-semibold text-ink">{v.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <span className="eyebrow">Notre approche</span>
          <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
            Un accompagnement personnalisé, orienté résultats.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Chaque dossier est unique. Nous prenons le temps de comprendre votre contexte, vos
            contraintes et vos objectifs pour bâtir une réponse sur-mesure — claire, actionnable et
            mesurable.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
              <img
                src={heroFounder}
                alt="Fondateur du cabinet"
                width={1080}
                height={1600}
                loading="lazy"
                className="h-[32rem] w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="eyebrow">Le Fondateur</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Une vision exigeante du conseil.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Le fondateur de JURIS-CONSULTANT met au service de ses clients une expérience
              reconnue en droit des affaires, fiscalité et droit social. Sa conviction&nbsp;: chaque
              décision juridique ou fiscale doit être un levier de performance et de sérénité.
            </p>
            <p className="mt-4 text-muted-foreground">
              Diplômé en droit et en fiscalité, il a accompagné de nombreuses structures — des
              entrepreneurs individuels aux groupes établis — dans la sécurisation et l'optimisation
              de leurs activités.
            </p>
            <Link to="/contact" className="btn-primary mt-8">
              Échanger avec le cabinet
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
