import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { supabase, isDbConnected, generateId } from "./db.server";
import type { Prospect } from "./db.server";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "prospects.json");

// ─── JSON file helpers (fallback) ────────────────────

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readProspects(): Promise<Prospect[]> {
  await ensureDataDir();
  const raw = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeProspects(prospects: Prospect[]) {
  await ensureDataDir();
  await writeFile(DATA_FILE, JSON.stringify(prospects, null, 2), "utf-8");
}

// ─── Server Functions ────────────────────────────────

export const saveProspect = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional().default(""),
      subject: z.string().optional().default(""),
      message: z.string().min(1),
      source: z.string().optional().default("contact"),
    })
  )
  .handler(async ({ data }) => {
    const prospect = {
      id: generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      subject: data.subject || "",
      message: data.message,
      source: data.source || "contact",
      created_at: new Date().toISOString(),
    };

    if (isDbConnected()) {
      const { error } = await supabase!.from("prospects").insert(prospect);
      if (error) throw error;
      return { success: true, id: prospect.id };
    }

    const prospects = await readProspects();
    prospects.push(prospect);
    await writeProspects(prospects);
    return { success: true, id: prospect.id };
  });

export const getProspects = createServerFn({ method: "GET" }).handler(
  async () => {
    if (isDbConnected()) {
      const { data, error } = await supabase!
        .from("prospects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Prospect[];
    }

    const prospects = await readProspects();
    return prospects.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
);

export const deleteProspect = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    if (isDbConnected()) {
      const { error } = await supabase!
        .from("prospects")
        .delete()
        .eq("id", data.id);
      if (error) throw error;
      return { success: true };
    }

    let prospects = await readProspects();
    prospects = prospects.filter((p) => p.id !== data.id);
    await writeProspects(prospects);
    return { success: true };
  });
