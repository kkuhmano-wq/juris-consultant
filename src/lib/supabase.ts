import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function buildClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase non configuré — VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant");
    const noop = () => Promise.resolve({ data: null, error: null });
    const sub = { unsubscribe() {} };
    return new Proxy({} as SupabaseClient, {
      get(_t, prop: string | symbol) {
        const key = String(prop);
        if (key === "then" || key === "catch") return;
        if (key === "auth") {
          return {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: sub }, error: null }),
            signInWithPassword: noop,
            signOut: noop,
            resetPasswordForEmail: noop,
          };
        }
        if (key === "from") return () => ({ select: () => ({ eq: () => Promise.resolve({ data: [], error: null }), order: () => Promise.resolve({ data: [], error: null }), single: () => Promise.resolve({ data: null, error: null }) }), insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }), update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }), delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) });
        if (key === "storage") {
          return {
            from: () => ({
              upload: noop,
              getPublicUrl: () => ({ data: { publicUrl: "" } }),
              remove: noop,
            }),
          };
        }
        return () => Promise.resolve({ data: null, error: null });
      },
    });
  }
  return createClient(supabaseUrl, supabaseKey);
}

let client: SupabaseClient | undefined;

export const supabase = new Proxy<SupabaseClient>({} as SupabaseClient, {
  get(_, prop) {
    if (!client) client = buildClient();
    return (client as any)[prop];
  },
});
