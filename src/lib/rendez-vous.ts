import { supabase } from "@/lib/supabase";

export interface RendezVous {
  id: string;
  client_id: string;
  titre: string;
  description: string;
  jours_proposes: string[];
  statut: "en_attente" | "confirme" | "refuse";
  message_cabinet: string;
  created_at: string;
}

export interface RendezVousInput {
  titre: string;
  description: string;
  jours_proposes: string[];
}

export async function createRendezVous(userId: string, input: RendezVousInput): Promise<RendezVous> {
  const { data, error } = await supabase
    .from("client_rendez_vous")
    .insert({
      client_id: userId,
      titre: input.titre,
      description: input.description,
      jours_proposes: input.jours_proposes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchRendezVous(userId: string): Promise<RendezVous[]> {
  const { data, error } = await supabase
    .from("client_rendez_vous")
    .select("*")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function cancelRendezVous(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from("client_rendez_vous")
    .delete()
    .eq("client_id", userId)
    .eq("id", id);

  if (error) throw error;
}
