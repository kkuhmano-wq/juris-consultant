import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Scale,
  Calculator,
  Landmark,
  Rocket,
  Gavel,
  ShieldCheck,
  Microscope,
  Users,
  Lock,
  Sprout,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import heroFounder from "@/assets/hero-founder.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cabinet JurisConsultants — Conseil Juridique & Fiscal pour entreprises" },
      {
        name: "description",
        content:
          "Cabinet de conseil juridique et fiscal. Sécurisation des activités, conformité, droit des affaires, recouvrement, contentieux.",
      },
      { property: "og:title", content: "Cabinet JurisConsultants — Conseil Juridique & Fiscal" },
      {
        property: "og:description",
        content: "Anticiper les risques. Sécuriser vos activités. Optimiser vos décisions.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const expertises = [
  { icon: Scale, title: "Conseil Juridique & Gouvernance", desc: "Sécurisation des activités et assistance juridique.", slug: "/conseil-juridique" },
  { icon: Calculator, title: "Conseil Fiscal & Optimisation", desc: "Conformité et optimisation fiscale.", slug: "/conseil-fiscal" },
  { icon: Landmark, title: "Opérations Complexes & Stratégie", desc: "Fusions, acquisitions et ingénierie juridique.", slug: "/operations-complexes" },
  { icon: Gavel, title: "Recouvrement & Contentieux", desc: "Protection et défense de vos intérêts.", slug: "/contentieux" },
  { icon: Rocket, title: "Création & Développement d'Entreprise", desc: "Accompagnement des porteurs de projets.", slug: "/creation-entreprise" },
  { icon: ShieldCheck, title: "Patrimoine & Propriété", desc: "Protection des actifs fonciers et intellectuels.", slug: "/patrimoine-propriete" },
  { icon: Lock, title: "Numérique & Cybersécurité Juridique", desc: "Sécurisation juridique des systèmes d'information.", slug: "/cybersecurite-juridique" },
  { icon: Users, title: "RH & Psychologie du Travail", desc: "Gestion des ressources humaines et accompagnement managérial.", slug: "/ressources-humaines" },
  { icon: Sprout, title: "Développement Territorial & Bureau d'Études", desc: "Développement local, aménagement et études.", slug: "/developpement-territorial" },
  { icon: GraduationCap, title: "Formation & Renforcement des Capacités", desc: "Formations professionnelles sur mesure.", slug: "/formation" },
];

const reasons = [
  { icon: ShieldCheck, title: "Expertise", desc: "Des solutions adaptées à vos problématiques." },
  { icon: Microscope, title: "Rigueur", desc: "Une analyse approfondie de chaque dossier." },
  { icon: Users, title: "Proximité", desc: "Un interlocuteur à votre écoute." },
  { icon: Lock, title: "Confidentialité", desc: "Protection totale des informations confiées." },
];

const method = [
  { step: "01", title: "Diagnostic", desc: "Comprendre votre situation." },
  { step: "02", title: "Analyse", desc: "Identifier les risques et opportunités." },
  { step: "03", title: "Recommandations", desc: "Proposer des solutions concrètes." },
  { step: "04", title: "Accompagnement", desc: "Assurer le suivi jusqu'à la résolution." },
];

const stats = [
 "+100 dossiers accompagnés",
 "+50 entreprises conseillées",
 "100% confidentialité",
 "Réponse sous 24h",
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-secondary" />
        <div className="absolute -top-32 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary-soft blur-3xl opacity-70" />
        <div className="container-page grid items-center gap-14 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <span className="eyebrow">Cabinet de Conseil Juridique &amp; Fiscal</span>
            <div className="relative mt-6">
              <span className="absolute -left-6 top-3 h-16 w-0.5 rounded-full bg-gradient-to-b from-primary/60 to-transparent hidden md:block" />
              <h1 className="font-serif text-lg font-bold leading-[1.2] text-ink md:text-xl lg:text-2xl">
                <span className="block animate-fade-slide-up" style={{ animationDelay: "0s" }}>Sécurisez vos activités.</span>
                <span className="block mt-1 animate-fade-slide-up" style={{ animationDelay: "0.2s" }}>Optimisez vos décisions.</span>
                <span className="block mt-2 animate-fade-slide-up bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent italic animate-shimmer" style={{ animationDelay: "0.4s" }}>
                  Défendez vos intérêts.
                </span>
              </h1>
            </div>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Cabinet JurisConsultants accompagne les entreprises, commerçants, travailleurs et investisseurs
              dans la sécurisation de leurs activités et la gestion de leurs obligations juridiques
              et fiscales.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
             <a
  href="https://wa.me/2250789853607?text=Bonjour%20Cabinet JurisConsultants,%20je%20souhaite%20obtenir%20un%20rendez-vous."
  target="_blank"
  rel="noopener noreferrer"
  className="btn-primary"
>
  Prendre rendez-vous <ArrowRight className="h-4 w-4" />
</a>
              <Link to="/expertises" className="btn-outline">
                Découvrir nos expertises
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-8 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-5">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10" />
            <div className="overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-elegant)]">
              <img
                src={heroFounder}
                alt="Fondateur du cabinet Cabinet JurisConsultants"
                width={1080}
                height={1600}
                className="h-[34rem] w-full object-cover md:h-[40rem]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-background p-5 shadow-[var(--shadow-soft)] md:block">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Slogan</p>
              <p className="mt-2 max-w-[14rem] font-serif text-base italic leading-snug text-ink">
                « Anticiper les risques. Sécuriser vos activités. Optimiser vos décisions. »
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">Nos Expertises</span>
              <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
                Dix domaines d'intervention au service de votre sérénité.
              </h2>
            </div>
            <Link to="/expertises" className="text-sm font-semibold text-primary hover:underline">
              Voir toutes les expertises →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {expertises.map((e) => (
  <Link
    key={e.title}
    to={e.slug}
    className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[inset_0_1.5px_0_rgba(255,255,255,0.35),inset_0_-1.5px_0_rgba(0,0,0,0.1),var(--shadow-soft)]"
  >
    <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg">
      <e.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.6} />
    </span>

    <h3 className="mt-6 font-serif text-2xl font-semibold text-ink transition-colors duration-300 group-hover:text-primary">
      {e.title}
    </h3>

    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
      {e.desc}
    </p>

  </Link>
))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">Pourquoi nous choisir</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Une exigence à la hauteur de vos enjeux.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Nous combinons expertise multidisciplinaire et engagement personnel pour vous délivrer
              des solutions juridiques et fiscales fiables, comprises et durables.
            </p>
          </div>
          <div className="lg:col-span-8 grid gap-5 sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl bg-background p-7">
                <r.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
                <h3 className="mt-5 font-serif text-xl font-semibold text-ink">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow mx-auto justify-center">Notre méthode</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Une démarche structurée, du diagnostic à la résolution.
            </h2>
          </div>

          <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {method.map((m, i) => (
              <li key={m.step} className="relative rounded-2xl border border-border bg-card p-8">
                <span className="font-serif text-5xl font-semibold text-primary/30">{m.step}</span>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">{m.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{m.desc}</p>
                {i < method.length - 1 && (
                  <span className="absolute right-6 top-10 hidden text-primary lg:inline-block">→</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">À propos</span>
            <h2 className="mt-5 font-serif text-4xl font-semibold text-ink md:text-5xl">
              Un cabinet engagé aux côtés de ceux qui entreprennent.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Cabinet JurisConsultants est un cabinet spécialisé en conseil juridique et fiscal offrant un
              accompagnement professionnel aux entreprises, commerçants, travailleurs et
              investisseurs.
            </p>
            <p className="mt-4 text-muted-foreground">
              Notre mission consiste à sécuriser les activités de nos clients tout en les aidant à
              prendre des décisions conformes et stratégiques.
            </p>
            <Link to="/cabinet" className="mt-8 btn-outline">
              Découvrir le cabinet
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Excellence", "Intégrité", "Confidentialité", "Professionnalisme"].map((v) => (
              <div key={v} className="rounded-2xl border border-border bg-background p-6">
                <span className="font-serif text-3xl font-semibold text-primary">{v[0]}</span>
                <p className="mt-3 font-serif text-lg font-semibold text-ink">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--gradient-ink)] px-8 py-16 text-center md:px-16 md:py-20">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow mx-auto justify-center text-primary-soft before:bg-primary-soft">
                Appel à l'action
              </span>
              <h2 className="mt-6 font-serif text-4xl font-semibold text-background md:text-5xl">
                Besoin d'un accompagnement juridique ou fiscal&nbsp;?
              </h2>
              <p className="mt-5 text-background/75">
                Prenez rendez-vous avec un expert Cabinet JurisConsultants.
              </p>
              <Link to="/contact" className="btn-primary mt-9">
                Nous contacter <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
