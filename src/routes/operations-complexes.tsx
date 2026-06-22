import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2, Scale, FileSearch, PiggyBank, Users, Shield } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/operations-complexes")({
  head: () => ({
    meta: [
      {
        title:
          "Opérations Complexes | JURIS-CONSULTANT - Conseil Juridique & Fiscal",
      },
      {
        name: "description",
        content:
          "Accompagnement juridique dans les opérations complexes : fusions, acquisitions, restructurations, LBO, due diligence et ingénierie juridique.",
      },
    ],
  }),
  component: OperationsComplexesPage,
});

const services = [
  "Fusions et acquisitions",
  "Restructurations de sociétés et de groupes",
  "Opérations de LBO (Leveraged Buy-Out)",
  "Scissions et apports partiels d'actifs",
  "Prises de participation et joint-ventures",
  "Audits juridiques et due diligence",
];

const roles = [
  "Réaliser l'audit juridique complet",
  "Identifier et documenter les risques",
  "Structurer juridiquement l'opération",
  "Rédiger les protocoles d'accord et garanties",
  "Préparer les actes de cession",
  "Assurer la conformité fiscale et réglementaire",
];

function OperationsComplexesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <span className="eyebrow">Expertise</span>

          <h1 className="mt-5 font-serif text-5xl font-semibold text-ink md:text-6xl">
            Opérations Complexes
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Les opérations juridiques complexes modifient profondément la structure,
            le contrôle, le patrimoine ou l'organisation d'une entreprise. Elles
            mobilisent plusieurs domaines du droit : droit des sociétés, droit des
            affaires, droit fiscal, droit social, droit de la concurrence.
          </p>

          <div className="mt-8">
            <a
              href="https://wa.me/2250789853607?text=Bonjour%20JURIS-CONSULTANT,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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
            Fusions et acquisitions
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            La fusion est l'opération par laquelle deux ou plusieurs sociétés se
            réunissent pour n'en former qu'une seule. Dans le cadre d'une
            fusion-absorption, une société absorbe une autre avec transmission
            universelle du patrimoine, dissolution sans liquidation et attribution
            d'actions aux associés. Ces opérations sont régies par l'Acte uniforme
            OHADA relatif au droit des sociétés commerciales et du GIE.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            L'acquisition d'entreprise peut prendre la forme d'un achat de titres
            (share deal) avec continuité des contrats mais reprise des dettes
            cachées, ou d'un achat d'actifs (asset deal) permettant de sélectionner
            les éléments utiles et réduire les risques.
          </p>
        </div>
      </section>

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
                <Building2 className="h-8 w-8 text-primary" />
                <p className="mt-4 font-medium text-foreground">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Opérations de LBO et ingénierie financière
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Le LBO (Leveraged Buy-Out) permet à un investisseur de racheter une
            entreprise principalement grâce à l'endettement. Une société holding
            est créée, emprunte auprès des banques, rachète la société cible, et
            les bénéfices futurs de la cible remboursent la dette. L'intérêt
            majeur est d'acquérir une société avec un apport personnel limité.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Les prises de participation peuvent être minoritaires (moins de 50 %),
            majoritaires (plus de 50 %) ou donner un contrôle exclusif à
            l'actionnaire. Les joint-ventures permettent à deux ou plusieurs
            entreprises de créer une société commune pour partager les risques,
            les investissements et les bénéfices d'un projet.
          </p>
        </div>
      </section>

      <section className="section-pad bg-secondary">
        <div className="container-page">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Le rôle du juriste d'affaires
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role}
                className="flex items-start gap-3 rounded-xl bg-background border border-border p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-4xl">
          <h2 className="font-serif text-4xl font-semibold text-ink">
            Restructurations et réorganisations
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Les scissions divisent une société en plusieurs entités distinctes.
            Les apports partiels d'actifs transfèrent une branche d'activité à
            une autre société. Les restructurations de groupes incluent la
            création de holdings, la filialisation, la centralisation des
            fonctions et la réorganisation du capital.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Avant toute opération importante, la due diligence est l'étape
            cruciale. Les juristes vérifient les statuts, contrats, contentieux,
            titres de propriété, dettes fiscales, litiges sociaux et
            autorisations administratives.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="rounded-3xl bg-[var(--gradient-ink)] p-12 text-center">
            <h2 className="font-serif text-4xl font-semibold text-background">
              Un projet de fusion, acquisition ou restructuration ?
            </h2>

            <p className="mt-4 text-background/80 max-w-2xl mx-auto">
              Notre cabinet vous accompagne dans la sécurisation et la réalisation
              de vos opérations juridiques complexes.
            </p>

            <a
              href="https://wa.me/2250789853607?text=Bonjour%20JURIS-CONSULTANT,%20je%20souhaite%20obtenir%20un%20rendez-vous."
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