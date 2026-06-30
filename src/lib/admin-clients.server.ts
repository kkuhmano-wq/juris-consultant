import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service_role credentials");
  }
  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

export const listClients = createServerFn({ method: "GET" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { data: users, error } = await getAdminClient().auth.admin.listUsers();
    if (error) throw error;
    return users.users.map((u) => ({
      id: u.id,
      email: u.email,
      prenom: u.user_metadata?.prenom ?? "",
      nom: u.user_metadata?.nom ?? "",
      telephone: u.user_metadata?.telephone ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      confirmed: !!u.email_confirmed_at,
    }));
  });

export const createClient = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      prenom: z.string().optional(),
      nom: z.string().optional(),
      telephone: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { data: user, error } = await getAdminClient().auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        prenom: data.prenom ?? "",
        nom: data.nom ?? "",
        telephone: data.telephone ?? "",
      },
    });
    if (error) throw new Error(error.message);
    return { id: user.user.id, email: user.user.email };
  });

export const deleteClient = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    const { error } = await getAdminClient().auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const listDossiers = createServerFn({ method: "GET" })
  .validator(z.object({ clientId: z.string().optional() }))
  .handler(async ({ data }) => {
    let query = getAdminClient().from("client_dossiers").select("*").order("created_at", { ascending: false });
    if (data.clientId) query = query.eq("client_id", data.clientId);
    const { data: dossiers, error } = await query;
    if (error) throw error;
    return dossiers ?? [];
  });

export const createDossier = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      client_id: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional(),
      reference: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { data: dossier, error } = await getAdminClient()
      .from("client_dossiers")
      .insert({
        client_id: data.client_id,
        title: data.title,
        description: data.description ?? "",
        category: data.category ?? "",
        reference: data.reference ?? "",
        status: "en_cours",
      })
      .select()
      .single();
    if (error) throw error;
    return dossier;
  });

export const updateDossierStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      id: z.string(),
      status: z.enum(["en_cours", "en_attente", "termine", "archive"]),
    })
  )
  .handler(async ({ data }) => {
    const { error } = await getAdminClient()
      .from("client_dossiers")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

export const listDocuments = createServerFn({ method: "GET" })
  .validator(z.object({ dossierId: z.string().optional(), clientId: z.string().optional() }))
  .handler(async ({ data }) => {
    let query = getAdminClient().from("client_documents").select("*").order("uploaded_at", { ascending: false });
    if (data.dossierId) query = query.eq("dossier_id", data.dossierId);
    if (data.clientId) query = query.eq("client_id", data.clientId);
    const { data: docs, error } = await query;
    if (error) throw error;
    return docs ?? [];
  });

export const createDocument = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      client_id: z.string(),
      dossier_id: z.string().nullable().optional(),
      name: z.string().min(1),
      type: z.string().default(""),
      url: z.string().min(1),
      size: z.string().default(""),
    })
  )
  .handler(async ({ data }) => {
    const { data: doc, error } = await getAdminClient()
      .from("client_documents")
      .insert({
        client_id: data.client_id,
        dossier_id: data.dossier_id,
        name: data.name,
        type: data.type,
        size: data.size,
        url: data.url,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return doc;
  });

export const uploadDocument = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      client_id: z.string(),
      dossier_id: z.string().nullable().optional(),
      name: z.string().min(1),
      file_base64: z.string().min(1),
      content_type: z.string().default("application/octet-stream"),
    })
  )
  .handler(async ({ data }) => {
    const sb = getAdminClient();
    const buffer = Buffer.from(data.file_base64, "base64");
    const filePath = `${data.client_id}/${data.dossier_id ?? "general"}/${Date.now()}_${data.name}`;

    const { data: uploadData, error: uploadError } = await sb.storage
      .from("client-documents")
      .upload(filePath, buffer, {
        contentType: data.content_type,
        upsert: true,
      });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: publicUrlData } = sb.storage
      .from("client-documents")
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    const { data: doc, error: insertError } = await sb
      .from("client_documents")
      .insert({
        client_id: data.client_id,
        dossier_id: data.dossier_id,
        name: data.name,
        type: data.content_type,
        size: String(buffer.length),
        url: publicUrl,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (insertError) throw insertError;
    return doc;
  });
