import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "prospects.json");

type Prospect = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  createdAt: string;
};

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
    const prospects = await readProspects();
    const prospect: Prospect = {
      id: `PRO-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      subject: data.subject || "",
      message: data.message,
      source: data.source || "contact",
      createdAt: new Date().toISOString(),
    };
    prospects.push(prospect);
    await writeProspects(prospects);
    return { success: true, id: prospect.id };
  });

export const getProspects = createServerFn({ method: "GET" })
  .handler(async () => {
    const prospects = await readProspects();
    return prospects.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

export const deleteProspect = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    let prospects = await readProspects();
    prospects = prospects.filter((p) => p.id !== data.id);
    await writeProspects(prospects);
    return { success: true };
  });
