import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useMembreAuth } from "@/lib/auth-membres";
import bgConnexion from "@/assets/Crea CJC.png";

export const Route = createFileRoute("/espace-membres/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Espace Collaboratif | Cabinet JurisConsultants" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, isLoading } = useMembreAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1A2E]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    );
  }

  if (isAuthenticated) {
    navigate({ to: "/espace-membres" });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) navigate({ to: "/espace-membres" });
    else setError(result.error ?? "Erreur de connexion");
  };

  return (
    <div className="flex min-h-screen bg-[#0F1A2E]">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mx-auto flex w-fit items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#D4A843] text-[#0F1A2E] shadow-lg shadow-[#D4A843]/20">
              <Scale className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                Cabinet JurisConsultants
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#D4A843]">
                Espace Collaboratif
              </span>
            </div>
          </div>

          <h1 className="mt-16 font-serif text-4xl font-semibold text-white">
            Connexion
          </h1>
          <p className="mt-3 text-white/60">
            Accès réservé aux membres du cabinet.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-5">
            <div>
              <label className="text-sm font-medium text-white/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]"
                placeholder="vous@cabinet.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">Mot de passe</label>
              <div className="relative mt-1.5">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/30 outline-none transition-all focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4A843] px-6 py-3.5 text-sm font-semibold text-[#0F1A2E] transition-all hover:bg-[#C49A3C] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center p-16 relative"
           style={{ backgroundImage: `url(${bgConnexion})` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-md text-center">
          <div className="mb-8 mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-[#D4A843]/10 border border-[#D4A843]/20">
            <Lock className="h-10 w-10 text-[#D4A843]" strokeWidth={1.4} />
          </div>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-white">
            Espace réservé aux membres
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Cet espace est strictement privé. Seuls les collaborateurs et associés du cabinet y ont accès.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 border border-white/20">ADMIN</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 border border-white/20">ASSOCIE</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 border border-white/20">JURISTE</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 border border-white/20">STAGIAIRE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
