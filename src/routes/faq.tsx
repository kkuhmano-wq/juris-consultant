import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getFaq } from "@/lib/admin.server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  }),
  component: FaqPage,
});

function FaqPage() {
  const [faq, setFaq] = useState<any[]>([]);

  useEffect(() => {
    getFaq({}).then(setFaq).catch(() => {});
  }, []);

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
          {faq.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              Aucune question pour le moment.
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faq.map((f, i) => (
                <AccordionItem key={f.id} value={f.id} className="border-border">
                  <AccordionTrigger className="text-left font-serif text-xl text-ink hover:text-primary">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

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