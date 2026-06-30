import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Role = "ADMIN" | "ASSOCIE" | "JURISTE" | "STAGIAIRE";

export interface Membre {
  id: string;
  user_id: string;
  nom: string;
  email: string;
  role: Role;
}

interface MembreAuthContextValue {
  membre: Membre | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const MembreAuthContext = createContext<MembreAuthContextValue | null>(null);

function getStoredMembre(): Membre | null {
  if (typeof sessionStorage === "undefined") return null;
  const stored = sessionStorage.getItem("jc_membre");
  if (!stored) return null;
  try { return JSON.parse(stored) as Membre; } catch { sessionStorage.removeItem("jc_membre"); return null; }
}

function setStoredMembre(m: Membre | null) {
  if (typeof sessionStorage === "undefined") return;
  if (m) sessionStorage.setItem("jc_membre", JSON.stringify(m));
  else sessionStorage.removeItem("jc_membre");
}

async function fetchMembreByUserId(userId: string): Promise<Membre | null> {
  const { data, error } = await supabase
    .from("membres")
    .select("id, user_id, nom, email, role")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return { id: data.id, user_id: data.user_id, nom: data.nom, email: data.email, role: data.role as Role };
}

export function MembreAuthProvider({ children }: { children: ReactNode }) {
  const [membre, setMembre] = useState<Membre | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredMembre();
    if (stored) {
      setMembre(stored);
      setIsLoading(false);
      return;
    }

    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("getSession timeout")), 8000)
    );
    Promise.race([sessionPromise, timeoutPromise])
      .then(async (result: any) => {
        const session = result?.data?.session;
        if (session?.user) {
          const m = await fetchMembreByUserId(session.user.id);
          if (m) { setMembre(m); setStoredMembre(m); }
          else { setMembre(null); setStoredMembre(null); }
        } else {
          setMembre(null); setStoredMembre(null);
        }
      })
      .catch((err) => {
        console.error("MembreAuth session error:", err);
        setMembre(null); setStoredMembre(null);
      })
      .finally(() => setIsLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const m = await fetchMembreByUserId(session.user.id);
        if (m) { setMembre(m); setStoredMembre(m); }
        else { setMembre(null); setStoredMembre(null); }
      } else {
        setMembre(null); setStoredMembre(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, error: error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : "Erreur de connexion." };
    }
    if (data.user) {
      const m = await fetchMembreByUserId(data.user.id);
      if (!m) {
        await supabase.auth.signOut();
        return { ok: false, error: "Accès réservé aux membres du cabinet. Veuillez contacter l'administration." };
      }
      setMembre(m);
      setStoredMembre(m);
      return { ok: true };
    }
    return { ok: false, error: "Erreur de connexion." };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setMembre(null);
    setStoredMembre(null);
    navigate({ to: "/espace-membres/login" });
  }, [navigate]);

  const hasRole = useCallback((...roles: Role[]) => {
    if (!membre) return false;
    return roles.includes(membre.role);
  }, [membre]);

  return (
    <MembreAuthContext.Provider value={{ membre, isAuthenticated: !!membre, isLoading, login, logout, hasRole }}>
      {children}
    </MembreAuthContext.Provider>
  );
}

export function useMembreAuth() {
  const ctx = useContext(MembreAuthContext);
  if (!ctx) throw new Error("useMembreAuth must be used within MembreAuthProvider");
  return ctx;
}
