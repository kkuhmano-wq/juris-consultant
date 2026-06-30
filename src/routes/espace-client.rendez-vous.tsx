import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, Clock,
  CheckCircle, XCircle, Loader2, Send, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import { createRendezVous, fetchRendezVous } from "@/lib/rendez-vous";
import type { RendezVous } from "@/lib/rendez-vous";

export const Route = createFileRoute("/espace-client/rendez-vous")({
  head: () => ({
    meta: [
      { title: "Demander un rendez-vous — Espace Client | Cabinet JurisConsultants" },
    ],
  }),
  component: RdvPage,
});

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function classNames(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function useCalendar(now: Date) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const weeks: (number | null)[][] = [];
  let cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
    if (cells.length === 7) { weeks.push(cells); cells = []; }
  }
  if (cells.length) weeks.push(cells);
  return { year, month, weeks };
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function statutBadge(statut: string) {
  switch (statut) {
    case "en_attente":
      return "bg-amber-50 text-amber-700";
    case "confirme":
      return "bg-primary-soft text-primary";
    case "refuse":
      return "bg-red-50 text-red-700";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

function statutLabel(statut: string) {
  switch (statut) {
    case "en_attente": return "En attente";
    case "confirme": return "Confirmé";
    case "refuse": return "Refusé";
    default: return statut;
  }
}

function RdvPage() {
  const { user } = useAuth();
  const [today, setToday] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [loadingRdvs, setLoadingRdvs] = useState(true);

  const { year, month, weeks } = useCalendar(today);

  useMemo(() => {
    if (!user) return;
    fetchRendezVous(user.id).then(setRdvs).catch(() => {}).finally(() => setLoadingRdvs(false));
  }, [user]);

  function prevMonth() {
    setToday(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setToday(new Date(year, month + 1, 1));
  }

  function toggleDay(day: number) {
    const key = formatDate(year, month, day);
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function isPast(day: number) {
    const d = new Date(year, month, day, 23, 59, 59);
    return d < new Date();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!titre.trim()) { setError("Veuillez indiquer le motif du rendez-vous."); return; }
    if (selectedDays.size === 0) { setError("Veuillez sélectionner au moins un jour de disponibilité."); return; }
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await createRendezVous(user.id, {
        titre: titre.trim(),
        description: description.trim(),
        jours_proposes: Array.from(selectedDays).sort(),
      });
      setSuccess("Votre demande de rendez-vous a été envoyée. Le cabinet vous répondra sous 48h.");
      setTitre("");
      setDescription("");
      setSelectedDays(new Set());
      const updated = await fetchRendezVous(user.id);
      setRdvs(updated);
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-semibold text-ink">Demander un rendez-vous</h1>
      <p className="mt-2 text-muted-foreground">
        Sélectionnez vos jours de disponibilité et précisez l&apos;objet de votre demande.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary text-muted-foreground">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="font-serif text-xl font-semibold text-ink">
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary text-muted-foreground">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {weeks.map((week, wi) =>
                week.map((day, di) => {
                  if (day === null) return <div key={`e-${wi}-${di}`} />;
                  const key = formatDate(year, month, day);
                  const selected = selectedDays.has(key);
                  const past = isPast(day);
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={past}
                      onClick={() => toggleDay(day)}
                      className={classNames(
                        "rounded-xl py-3 text-sm font-medium transition-all",
                        selected && "bg-primary text-primary-foreground shadow-sm",
                        !selected && !past && "hover:bg-primary-soft text-ink",
                        !selected && past && "text-muted-foreground/30 cursor-not-allowed",
                      )}
                    >
                      {day}
                    </button>
                  );
                })
              )}
            </div>

            {selectedDays.size > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-primary-soft px-4 py-3">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">
                  {selectedDays.size} jour{selectedDays.size > 1 ? "s" : ""} sélectionné{selectedDays.size > 1 ? "s" : ""}&nbsp;:
                </span>
                {Array.from(selectedDays).sort().map((d) => (
                  <span key={d} className="rounded-lg bg-background px-2.5 py-1 text-xs font-medium text-ink shadow-sm">
                    {new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-background p-6 space-y-5">
            <h3 className="font-serif text-lg font-semibold text-ink">Détails de la demande</h3>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-ink">Motif du rendez-vous *</label>
              <input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex: Consultation pour divorce, litige commercial..."
                className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink">Informations complémentaires</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Précisez l'objet de votre rendez-vous, les pièces à fournir..."
                className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-background p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
              <Clock className="h-5 w-5 text-primary" />
              Mes demandes
            </h3>

            {loadingRdvs ? (
              <div className="mt-6 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : rdvs.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Vous n&apos;avez encore aucune demande de rendez-vous.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {rdvs.map((rdv) => (
                  <div key={rdv.id} className="rounded-xl border border-border p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{rdv.titre}</p>
                      <span className={classNames("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium", statutBadge(rdv.statut))}>
                        {statutLabel(rdv.statut)}
                      </span>
                    </div>
                    {rdv.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{rdv.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {rdv.jours_proposes.map((d) => (
                        <span key={d} className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                          {new Date(d + "T12:00:00").toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      ))}
                    </div>
                    {rdv.message_cabinet && (
                      <p className="rounded-lg bg-primary-soft px-3 py-2 text-xs text-primary">
                        {rdv.message_cabinet}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(rdv.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
