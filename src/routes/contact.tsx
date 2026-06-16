import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JURIS-CONSULTANT" },
      {
        name: "description",
        content:
          "Contactez JURIS-CONSULTANT pour un rendez-vous. Téléphone, WhatsApp, e-mail, adresse et horaires.",
      },
      { property: "og:title", content: "Contact — JURIS-CONSULTANT" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-secondary">
        <div className="container-page py-20 lg:py-28">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Prenons rendez-vous.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Décrivez-nous votre situation. Un expert du cabinet vous recontacte rapidement pour
            convenir d'un premier échange confidentiel.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-5 space-y-5">
            {[
              { icon: Phone, label: "Téléphone", value: "+225 00 00 00 00" },
              { icon: MessageCircle, label: "WhatsApp", value: "+225 00 00 00 00" },
              { icon: Mail, label: "E-mail", value: "contact@juris-consultant.com" },
              { icon: MapPin, label: "Adresse", value: "Abidjan, Côte d'Ivoire" },
              { icon: Clock, label: "Horaires", value: "Lun – Ven : 08h00 – 18h00" },
            ].map((i) => (
              <div
                key={i.label}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <i.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {i.label}
                  </p>
                  <p className="mt-1.5 font-serif text-lg text-ink">{i.value}</p>
                </div>
              </div>
            ))}
          </aside>

          <div className="lg:col-span-7">
            <form
              className="rounded-2xl border border-border bg-card p-8 md:p-10"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {sent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
                    <Send className="h-6 w-6" />
                  </span>
                  <h2 className="mt-6 font-serif text-2xl text-ink">Message envoyé.</h2>
                  <p className="mt-2 text-muted-foreground">
                    Merci. Le cabinet vous répond dans les meilleurs délais.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nom complet" name="name" required />
                    <Field label="E-mail" name="email" type="email" required />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Téléphone" name="phone" />
                    <Field label="Sujet" name="subject" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Votre message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    />
                  </div>
                  <button type="submit" className="btn-primary mt-2 w-full sm:w-fit">
                    Envoyer ma demande <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Localisation JURIS-CONSULTANT"
              src="https://www.google.com/maps?q=Abidjan%2C%20C%C3%B4te%20d'Ivoire&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              className="block w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
