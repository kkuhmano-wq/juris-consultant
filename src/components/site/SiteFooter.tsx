import { Link } from "@tanstack/react-router";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-background">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Scale className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-background">
              JURIS-CONSULTANT
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-background/70">
            Cabinet de conseil juridique et fiscal. Nous accompagnons entreprises, commerçants,
            travailleurs et investisseurs dans la sécurisation de leurs activités.
          </p>
          <p className="mt-6 font-serif italic text-background/80">
            « Anticiper les risques. Sécuriser vos activités. Optimiser vos décisions. »
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-background/60">
            Navigation
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm text-background/80">
            <li><Link to="/cabinet" className="hover:text-primary-soft">Le Cabinet</Link></li>
            <li><Link to="/expertises" className="hover:text-primary-soft">Expertises</Link></li>
            <li><Link to="/actualites" className="hover:text-primary-soft">Actualités</Link></li>
            <li><Link to="/faq" className="hover:text-primary-soft">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-primary-soft">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-background/60">
            Contact
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-background/80">
            <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 text-primary-soft" /> +225 00 00 00 00</li>
            <li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 text-primary-soft" /> contact@juris-consultant.com</li>
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-primary-soft" /> Abidjan, Côte d'Ivoire</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-background/50 md:flex-row">
          <p>© {new Date().getFullYear()} JURIS-CONSULTANT. Tous droits réservés.</p>
          <p>Cabinet de Conseil Juridique &amp; Fiscal</p>
        </div>
      </div>
    </footer>
  );
}
