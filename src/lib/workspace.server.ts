import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey)
    throw new Error("Missing Supabase service_role credentials");
  return createClient(supabaseUrl, serviceRoleKey);
}

// ── Membres ──────────────────────────────────────────

export const listMembres = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const { data, error } = await sb.from("membres").select("*").order("nom");
    if (error) throw error;
    return data;
  });

export const createMembre = createServerFn({ method: "POST" })
  .validator(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    nom: z.string().min(1),
    role: z.enum(["ADMIN", "ASSOCIE", "JURISTE", "STAGIAIRE"]),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { data: user, error: authError } = await sb.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (authError) throw new Error(authError.message);
    const { error: insertError } = await sb.from("membres").insert({
      user_id: user.user.id,
      nom: data.nom,
      email: data.email,
      role: data.role,
    });
    if (insertError) {
      await sb.auth.admin.deleteUser(user.user.id);
      throw new Error(insertError.message);
    }
    return { id: user.user.id, email: data.email, nom: data.nom, role: data.role };
  });

export const updateMembre = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    nom: z.string().optional(),
    role: z.enum(["ADMIN", "ASSOCIE", "JURISTE", "STAGIAIRE"]).optional(),
    actif: z.boolean().optional(),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const updates: Record<string, any> = {};
    if (data.nom) updates.nom = data.nom;
    if (data.role) updates.role = data.role;
    if (data.actif !== undefined) updates.actif = data.actif;
    const { error } = await sb.from("membres").update(updates).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteMembre = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), user_id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    await sb.from("membres").delete().eq("id", data.id);
    const { error } = await sb.auth.admin.deleteUser(data.user_id);
    if (error) throw error;
    return { ok: true };
  });

// ── Dossiers ─────────────────────────────────────────

export const listDossiers = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const { data, error } = await sb.from("workspace_dossiers")
      .select("*, responsable:responsable_id(id, nom, email, role)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const getDossier = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { data: dossier, error } = await sb.from("workspace_dossiers")
      .select("*, responsable:responsable_id(id, nom, email, role)")
      .eq("id", data.id)
      .single();
    if (error) throw error;
    const { data: acces } = await sb.from("dossier_acces")
      .select("*, membre:membre_id(id, nom, email, role)")
      .eq("dossier_id", data.id);
    const { data: taches } = await sb.from("workspace_taches")
      .select("*, assignee:assignee_id(id, nom, email, role)")
      .eq("dossier_id", data.id)
      .order("created_at", { ascending: false });
    const { data: documents } = await sb.from("workspace_documents")
      .select("*")
      .eq("dossier_id", data.id)
      .order("created_at", { ascending: false });
    return { ...dossier, acces: acces ?? [], taches: taches ?? [], documents: documents ?? [] };
  });

export const createDossier = createServerFn({ method: "POST" })
  .validator(z.object({
    titre: z.string().min(1),
    description: z.string().optional(),
    reference: z.string().optional(),
    responsable_id: z.string().optional(),
    client_nom: z.string().optional(),
    client_contact: z.string().optional(),
    membre_ids: z.array(z.string()).optional(),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { data: dossier, error } = await sb.from("workspace_dossiers").insert({
      titre: data.titre,
      description: data.description ?? null,
      reference: data.reference ?? null,
      responsable_id: data.responsable_id ?? null,
      client_nom: data.client_nom ?? null,
      client_contact: data.client_contact ?? null,
    }).select().single();
    if (error) throw error;
    if (data.membre_ids?.length) {
      const rows = data.membre_ids.map((membre_id) => ({
        dossier_id: dossier.id,
        membre_id,
        permission: membre_id === data.responsable_id ? "gestion" : "consultation",
      }));
      await sb.from("dossier_acces").insert(rows);
    }
    return dossier;
  });

export const updateDossier = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    titre: z.string().optional(),
    description: z.string().optional(),
    statut: z.enum(["ouvert", "en_cours", "clos", "archive"]).optional(),
    responsable_id: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const updates: Record<string, any> = {};
    if (data.titre) updates.titre = data.titre;
    if (data.description !== undefined) updates.description = data.description;
    if (data.statut) updates.statut = data.statut;
    if (data.responsable_id) updates.responsable_id = data.responsable_id;
    if (data.statut === "clos" || data.statut === "archive") updates.date_cloture = new Date().toISOString();
    const { error } = await sb.from("workspace_dossiers").update(updates).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteDossier = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    await sb.from("workspace_documents").delete().eq("dossier_id", data.id);
    await sb.from("workspace_taches").delete().eq("dossier_id", data.id);
    await sb.from("dossier_acces").delete().eq("dossier_id", data.id);
    const { error } = await sb.from("workspace_dossiers").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ── Accès dossier ────────────────────────────────────

export const updateDossierAcces = createServerFn({ method: "POST" })
  .validator(z.object({
    dossier_id: z.string(),
    membre_ids: z.array(z.string()),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    await sb.from("dossier_acces").delete().eq("dossier_id", data.dossier_id);
    if (data.membre_ids.length) {
      const rows = data.membre_ids.map((membre_id) => ({
        dossier_id: data.dossier_id,
        membre_id,
        permission: "consultation",
      }));
      await sb.from("dossier_acces").insert(rows);
    }
    return { ok: true };
  });

// ── Tâches ───────────────────────────────────────────

export const listTaches = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const { data, error } = await sb.from("workspace_taches")
      .select("*, assignee:assignee_id(id, nom, email, role), createur:createur_id(id, nom, email, role), dossier:dossier_id(id, titre)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const createTache = createServerFn({ method: "POST" })
  .validator(z.object({
    createur_id: z.string(),
    dossier_id: z.string().optional(),
    titre: z.string().min(1),
    description: z.string().optional(),
    assignee_id: z.string().optional(),
    priorite: z.enum(["basse", "moyenne", "haute", "urgente"]).optional(),
    date_echeance: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { data: tache, error } = await sb.from("workspace_taches").insert({
      dossier_id: data.dossier_id ?? null,
      titre: data.titre,
      description: data.description ?? null,
      assignee_id: data.assignee_id ?? null,
      priorite: data.priorite ?? "moyenne",
      date_echeance: data.date_echeance ?? null,
      createur_id: data.createur_id,
    }).select().single();
    if (error) throw error;
    return tache;
  });

export const updateTache = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    titre: z.string().optional(),
    description: z.string().optional(),
    statut: z.enum(["a_faire", "en_cours", "termine", "annule"]).optional(),
    priorite: z.enum(["basse", "moyenne", "haute", "urgente"]).optional(),
    assignee_id: z.string().optional(),
    date_echeance: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const updates: Record<string, any> = {};
    if (data.titre) updates.titre = data.titre;
    if (data.description !== undefined) updates.description = data.description;
    if (data.statut) updates.statut = data.statut;
    if (data.priorite) updates.priorite = data.priorite;
    if (data.assignee_id) updates.assignee_id = data.assignee_id;
    if (data.date_echeance !== undefined) updates.date_echeance = data.date_echeance;
    const { error } = await sb.from("workspace_taches").update(updates).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteTache = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { error } = await sb.from("workspace_taches").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ── Messages ─────────────────────────────────────────

export const listMessages = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const { data, error } = await sb.from("workspace_messages")
      .select("*, expediteur:expediteur_id(id, nom, email, role), destinataires:message_destinataires(*, membre:membre_id(id, nom, email, role))")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const getMessage = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { data: message, error } = await sb.from("workspace_messages")
      .select("*, expediteur:expediteur_id(id, nom, email, role), destinataires:message_destinataires(*, membre:membre_id(id, nom, email, role))")
      .eq("id", data.id)
      .single();
    if (error) throw error;
    return message;
  });

export const marquerLu = createServerFn({ method: "POST" })
  .validator(z.object({ message_id: z.string(), membre_id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { error } = await sb.from("message_destinataires")
      .update({ lu: true, lu_at: new Date().toISOString() })
      .eq("message_id", data.message_id)
      .eq("membre_id", data.membre_id);
    if (error) throw error;
    return { ok: true };
  });

// ── Événements ───────────────────────────────────────

export const listEvenements = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const { data, error } = await sb.from("workspace_evenements")
      .select("*, createur:createur_id(id, nom, email, role), participants:evenement_participants(*, membre:membre_id(id, nom, email, role)), dossier:dossier_id(id, titre)")
      .order("date_debut");
    if (error) throw error;
    return data;
  });

export const createEvenement = createServerFn({ method: "POST" })
  .validator(z.object({
    createur_id: z.string(),
    titre: z.string().min(1),
    description: z.string().optional(),
    lieu: z.string().optional(),
    type: z.enum(["reunion", "audience", "rendez_vous", "deadline", "autre"]),
    date_debut: z.string(),
    date_fin: z.string().optional(),
    dossier_id: z.string().optional(),
    participant_ids: z.array(z.string()).optional(),
  }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { data: event, error } = await sb.from("workspace_evenements").insert({
      titre: data.titre,
      description: data.description ?? null,
      lieu: data.lieu ?? null,
      type: data.type,
      date_debut: data.date_debut,
      date_fin: data.date_fin ?? null,
      dossier_id: data.dossier_id ?? null,
      createur_id: data.createur_id,
    }).select().single();
    if (error) throw error;
    if (data.participant_ids?.length) {
      const rows = data.participant_ids.map((membre_id) => ({
        evenement_id: event.id,
        membre_id,
      }));
      await sb.from("evenement_participants").insert(rows);
    }
    return event;
  });

// ── Documents ────────────────────────────────────────

export const listDocuments = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const { data, error } = await sb.from("workspace_documents")
      .select("*, uploader:uploader_id(id, nom, email, role), dossier:dossier_id(id, titre)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const { error } = await sb.from("workspace_documents").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ── Statistiques dashboard ───────────────────────────

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const sb = getAdminClient();
    const [
      { count: totalDossiers },
      { count: dossiersOuverts },
      { count: totalTaches },
      { count: tachesEnCours },
      { count: messagesNonLus },
      { count: totalMembres },
      { data: dossiersRecents },
      { data: tachesRecentes },
      { data: evenementsToday },
    ] = await Promise.all([
      sb.from("workspace_dossiers").select("*", { count: "exact", head: true }),
      sb.from("workspace_dossiers").select("*", { count: "exact", head: true }).eq("statut", "ouvert"),
      sb.from("workspace_taches").select("*", { count: "exact", head: true }),
      sb.from("workspace_taches").select("*", { count: "exact", head: true }).neq("statut", "termine"),
      sb.from("message_destinataires").select("*", { count: "exact", head: true }).eq("lu", false),
      sb.from("membres").select("*", { count: "exact", head: true }),
      sb.from("workspace_dossiers").select("id, titre, statut, created_at, responsable:responsable_id(id, nom)").order("created_at", { ascending: false }).limit(5),
      sb.from("workspace_taches").select("id, titre, statut, priorite, assignee:assignee_id(id, nom)").order("created_at", { ascending: false }).limit(5),
      sb.from("workspace_evenements").select("id, titre, date_debut, type").gte("date_debut", new Date().toISOString().split("T")[0]).lte("date_debut", new Date(Date.now() + 86400000).toISOString().split("T")[0]).order("date_debut"),
    ]);
    return {
      totalDossiers: totalDossiers ?? 0,
      dossiersOuverts: dossiersOuverts ?? 0,
      totalTaches: totalTaches ?? 0,
      tachesEnCours: tachesEnCours ?? 0,
      messagesNonLus: messagesNonLus ?? 0,
      totalMembres: totalMembres ?? 0,
      dossiersRecents: dossiersRecents ?? [],
      tachesRecentes: tachesRecentes ?? [],
      evenementsToday: evenementsToday ?? [],
    };
  });
