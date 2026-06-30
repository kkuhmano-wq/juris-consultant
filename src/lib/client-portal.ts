import { supabase } from "@/lib/supabase";

export interface Dossier {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: "en_cours" | "en_attente" | "termine" | "archive";
  category: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  dossier_id: string | null;
  client_id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploaded_at: string;
}

export interface DashboardStats {
  dossiersCount: number;
  documentsCount: number;
}

function mapStatus(status: string): string {
  switch (status) {
    case "en_cours": return "En cours";
    case "en_attente": return "En attente";
    case "termine": return "Terminé";
    case "archive": return "Archivé";
    default: return status;
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function statusBadge(statut: string): string {
  switch (statut) {
    case "En cours": return "bg-blue-50 text-blue-700";
    case "En attente": return "bg-amber-50 text-amber-700";
    case "Terminé": return "bg-primary-soft text-primary";
    case "Archivé": return "bg-secondary text-muted-foreground";
    default: return "bg-secondary text-muted-foreground";
  }
}

export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  const { count: dossiersCount } = await supabase
    .from("client_dossiers")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId);

  const { count: documentsCount } = await supabase
    .from("client_documents")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId);

  return {
    dossiersCount: dossiersCount ?? 0,
    documentsCount: documentsCount ?? 0,
  };
}

export async function fetchDossiers(userId: string): Promise<(Dossier & { statutLabel: string; dateLabel: string })[]> {
  const { data, error } = await supabase
    .from("client_dossiers")
    .select("*")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((d) => ({
    ...d,
    statutLabel: mapStatus(d.status),
    dateLabel: formatDate(d.created_at),
  }));
}

export async function fetchDossierById(userId: string, dossierId: string): Promise<(Dossier & { statutLabel: string; dateLabel: string }) | null> {
  const { data, error } = await supabase
    .from("client_dossiers")
    .select("*")
    .eq("client_id", userId)
    .eq("id", dossierId)
    .single();

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    statutLabel: mapStatus(data.status),
    dateLabel: formatDate(data.created_at),
  };
}

export async function fetchDocuments(userId: string): Promise<(Document & { dateLabel: string })[]> {
  const { data, error } = await supabase
    .from("client_documents")
    .select("*")
    .eq("client_id", userId)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.uploaded_at),
  }));
}

export async function fetchDocumentsByDossier(userId: string, dossierId: string): Promise<(Document & { dateLabel: string })[]> {
  const { data, error } = await supabase
    .from("client_documents")
    .select("*")
    .eq("client_id", userId)
    .eq("dossier_id", dossierId)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.uploaded_at),
  }));
}
