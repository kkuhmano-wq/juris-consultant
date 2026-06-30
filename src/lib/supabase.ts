import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let client: SupabaseClient | undefined;

export const supabase = new Proxy<SupabaseClient>({} as SupabaseClient, {
  get(_, prop) {
    if (!client) {
      if (!supabaseUrl) throw new Error("VITE_SUPABASE_URL is not set");
      if (!supabaseKey) throw new Error("VITE_SUPABASE_ANON_KEY is not set");
      client = createClient(supabaseUrl, supabaseKey);
    }
    return (client as any)[prop];
  },
});
