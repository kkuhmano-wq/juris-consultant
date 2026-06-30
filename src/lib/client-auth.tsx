import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(sbUser: SupabaseUser): User {
  const meta = sbUser.user_metadata ?? {};
  return {
    id: sbUser.id,
    email: sbUser.email ?? "",
    prenom: meta.prenom ?? sbUser.email?.split("@")[0] ?? "Client",
    nom: meta.nom ?? "",
    telephone: meta.telephone ?? "",
  };
}

function getStoredUser(): User | null {
  if (typeof sessionStorage === "undefined") return null;
  const stored = sessionStorage.getItem("jc_client_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    sessionStorage.removeItem("jc_client_user");
    return null;
  }
}

function setStoredUser(u: User | null) {
  if (typeof sessionStorage === "undefined") return;
  if (u) {
    sessionStorage.setItem("jc_client_user", JSON.stringify(u));
  } else {
    sessionStorage.removeItem("jc_client_user");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);

    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("getSession timeout")), 8000)
    );
    Promise.race([sessionPromise, timeoutPromise])
      .then((result: any) => {
        const session = result?.data?.session;
        if (session?.user) {
          const u = mapUser(session.user);
          setUser(u);
          setStoredUser(u);
        } else {
          setUser(null);
          setStoredUser(null);
        }
      })
      .catch((err) => {
        console.error("Auth session error:", err);
        setUser(null);
        setStoredUser(null);
      })
      .finally(() => setIsLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = mapUser(session.user);
        setUser(u);
        setStoredUser(u);
      } else {
        setUser(null);
        setStoredUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg =
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : error.message === "Email not confirmed"
            ? "Veuillez confirmer votre adresse email avant de vous connecter."
            : "Erreur de connexion. Veuillez réessayer.";
      return { ok: false, error: msg };
    }
    if (data.user) {
      const u = mapUser(data.user);
      setUser(u);
      setStoredUser(u);
      return { ok: true };
    }
    return { ok: false, error: "Erreur de connexion. Veuillez réessayer." };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStoredUser(null);
    navigate({ to: "/connexion" });
  }, [navigate]);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/connexion?reset=true`,
    });
    if (error) {
      return { ok: false, error: "Erreur lors de l'envoi de l'email de réinitialisation." };
    }
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
