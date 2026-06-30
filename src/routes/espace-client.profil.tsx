import { createFileRoute } from "@tanstack/react-router";
import { User, Mail, Phone, MapPin, Pencil } from "lucide-react";
import { useAuth } from "@/lib/client-auth";

export const Route = createFileRoute("/espace-client/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Espace Client | Cabinet JurisConsultants" },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold text-ink">Mon profil</h1>
      <p className="mt-2 text-muted-foreground">
        Gérez vos informations personnelles.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-background p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </span>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {user?.prenom} {user?.nom}
            </h2>
            <p className="text-sm text-muted-foreground">Client</p>
          </div>
          <button className="ml-auto flex items-center gap-2 rounded-xl border border-input px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary">
            <Pencil className="h-4 w-4" />
            Modifier mes informations
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-xl border border-border p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <User className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Nom</p>
              <p className="font-medium text-foreground">{user?.nom}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <User className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Prénom</p>
              <p className="font-medium text-foreground">{user?.prenom}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Mail className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Phone className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Téléphone</p>
              <p className="font-medium text-foreground">{user?.telephone}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-border p-5 sm:col-span-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Adresse</p>
              <p className="font-medium text-foreground">Abidjan, Côte d'Ivoire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
