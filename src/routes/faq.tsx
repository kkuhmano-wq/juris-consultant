import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
  {
    q: "Comment créer une entreprise ?",
    a: "Nous vous accompagnons du choix de la forme juridique aux formalités constitutives : rédaction des statuts, immatriculation, conseils fiscaux et sociaux à la création.",
  },
  {
    q: "Comment gérer un contrôle fiscal ?",
    a: "Nous vous assistons à chaque étape : préparation des pièces, échanges avec l'administration, contestation éventuelle des redressements et défense de vos droits.",
  },
  {
    q: "Comment recouvrer une créance ?",
    a: "Notre démarche combine relance amiable, mise en demeure structurée et, si nécessaire, procédures judiciaires (injonction de payer, référé-provision, saisies).",
  },
  {
    q: "Quels documents pour une mise en conformité ?",
    a: "Cela dépend de votre activité : statuts à jour, registres obligatoires, contrats-types, politiques internes, déclarations fiscales et sociales. Nous établissons un diagnostic personnalisé.",
  },
  {
    q: "Comment rédiger un contrat sécurisé ?",
    a: "Un contrat solide identifie clairement les parties, les obligations, les modalités d'exécution, les garanties, les sanctions et la juridiction compétente. Nous rédigeons et auditons vos contrats.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — JURIS-CONSULTANT" },
      {
        name: "description",
        content:
          "Réponses aux questions fréquentes : création d'entreprise, contrôle fiscal, recouvrement, mise en conformité, contrats.",
      },
      { property: "og:title", content: "FAQ — JURIS-CONSULTANT" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <span className="eyebrow">FAQ</span>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Vos questions, nos réponses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Les interrogations les plus fréquentes adressées au cabinet, avec des éléments de
            réponse synthétiques.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-serif text-xl text-ink hover:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-14 rounded-2xl border border-border bg-secondary p-8 text-center">
            <p className="font-serif text-2xl text-ink">Une question qui n'apparaît pas&nbsp;?</p>
            <p className="mt-2 text-muted-foreground">
              Notre équipe vous répond dans les meilleurs délais.
            </p>
            <Link to="/contact" className="btn-primary mt-6">
              Poser ma question
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
