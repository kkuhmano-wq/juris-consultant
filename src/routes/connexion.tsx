import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, ArrowRight, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/lib/client-auth";
import bgConnexion from "@/assets/Crea CJC.png";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — Espace Client | Cabinet JurisConsultants" },
      {
        name: "description",
        content: "Accédez à votre espace client sécurisé Cabinet JurisConsultants.",
      },
    ],
  }),
  component: ConnexionPage,
});

function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, resetPassword, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    navigate({ to: "/espace-client" });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate({ to: "/espace-client" });
    } else {
      setError(result.error ?? "Email ou mot de passe incorrect.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.ok) {
      setResetSent(true);
    } else {
      setError(result.error ?? "Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mx-auto flex w-fit items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <Scale className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-xl font-semibold tracking-tight text-ink">
                Cabinet JurisConsultants
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Espace Client
              </span>
            </div>
          </Link>

          <h1 className="mt-12 font-serif text-4xl font-semibold text-ink">
            {resetMode ? "Mot de passe oublié" : "Connexion"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {resetMode
              ? "Saisissez votre email pour recevoir un lien de réinitialisation."
              : "Accédez à votre espace sécurisé pour consulter vos dossiers et documents."}
          </p>

          {resetSent ? (
            <div className="mt-10 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-soft">
                <Mail className="h-8 w-8 text-primary" strokeWidth={1.6} />
              </div>
              <p className="text-lg font-medium text-foreground">Email envoyé</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
              </p>
              <button
                onClick={() => { setResetMode(false); setResetSent(false); }}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={resetMode ? handleReset : handleLogin} className="mt-10 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {!resetMode && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : resetMode ? (
                  <>
                    Envoyer le lien
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {!resetMode && (
                <button
                  type="button"
                  onClick={() => { setResetMode(true); setError(""); }}
                  className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgConnexion})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-md text-center text-primary-foreground">
          <h2 className="font-serif text-5xl font-semibold leading-tight">
            Votre espace, vos dossiers, en un clic.
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            Consultez l'avancement de vos dossiers, téléchargez vos documents et restez connecté
            avec votre conseiller.
          </p>
        </div>
      </div>
    </div>
  );
}
