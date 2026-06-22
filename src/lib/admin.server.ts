import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const POSTS_FILE = join(DATA_DIR, "posts.json");
const FAQ_FILE = join(DATA_DIR, "faq.json");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

const sessions = new Map<string, number>();

type Post = {
  id: string;
  cat: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  createdAt: string;
};

type FaqEntry = {
  id: string;
  q: string;
  a: string;
  order: number;
  createdAt: string;
};

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(POSTS_FILE)) {
    await writeFile(POSTS_FILE, "[]", "utf-8");
  }
  if (!existsSync(FAQ_FILE)) {
    await writeFile(FAQ_FILE, "[]", "utf-8");
  }
}

async function readJSON<T>(file: string): Promise<T[]> {
  await ensureDataDir();
  const raw = await readFile(file, "utf-8");
  return JSON.parse(raw);
}

async function writeJSON<T>(file: string, data: T[]) {
  await ensureDataDir();
  await writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function verifyToken(token: string): boolean {
  return sessions.has(token);
}

// ─── Auth ───────────────────────────────────────────

export const login = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string() }))
  .handler(async ({ data }) => {
    if (data.password === ADMIN_PASSWORD) {
      const token = crypto.randomUUID();
      sessions.set(token, Date.now());
      return { success: true, token };
    }
    return { success: false, error: "Mot de passe incorrect" };
  });

export const logout = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    sessions.delete(data.token);
    return { success: true };
  });

export const requireAuth = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    return { authenticated: verifyToken(data.token) };
  });

// ─── Posts (Actualités) ─────────────────────────────

export const getPosts = createServerFn({ method: "GET" })
  .handler(async () => {
    const posts = await readJSON<Post>(POSTS_FILE);
    return posts.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
  });

export const savePost = createServerFn({ method: "POST" })
  .validator(z.object({
    token: z.string(),
    id: z.string().optional(),
    cat: z.string().min(1),
    title: z.string().min(1),
    date: z.string().min(1),
    excerpt: z.string().min(1),
    content: z.string().optional().default(""),
  }))
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) return { success: false, error: "Non authentifié" };
    const posts = await readJSON<Post>(POSTS_FILE);
    if (data.id && posts.find((p) => p.id === data.id)) {
      const idx = posts.findIndex((p) => p.id === data.id);
      posts[idx] = { ...posts[idx], ...data, token: undefined };
    } else {
      posts.push({
        id: generateId(),
        cat: data.cat,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content: data.content || "",
        createdAt: new Date().toISOString(),
      });
    }
    await writeJSON(POSTS_FILE, posts);
    return { success: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) return { success: false, error: "Non authentifié" };
    let posts = await readJSON<Post>(POSTS_FILE);
    posts = posts.filter((p) => p.id !== data.id);
    await writeJSON(POSTS_FILE, posts);
    return { success: true };
  });

// ─── FAQ ────────────────────────────────────────────

export const getFaq = createServerFn({ method: "GET" })
  .handler(async () => {
    const faq = await readJSON<FaqEntry>(FAQ_FILE);
    return faq.sort((a, b) => a.order - b.order);
  });

export const saveFaqEntry = createServerFn({ method: "POST" })
  .validator(z.object({
    token: z.string(),
    id: z.string().optional(),
    q: z.string().min(1),
    a: z.string().min(1),
    order: z.number().optional().default(0),
  }))
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) return { success: false, error: "Non authentifié" };
    const faq = await readJSON<FaqEntry>(FAQ_FILE);
    if (data.id && faq.find((f) => f.id === data.id)) {
      const idx = faq.findIndex((f) => f.id === data.id);
      faq[idx] = { ...faq[idx], ...data, token: undefined };
    } else {
      faq.push({
        id: generateId(),
        q: data.q,
        a: data.a,
        order: data.order || faq.length,
        createdAt: new Date().toISOString(),
      });
    }
    await writeJSON(FAQ_FILE, faq);
    return { success: true };
  });

export const deleteFaqEntry = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    if (!verifyToken(data.token)) return { success: false, error: "Non authentifié" };
    let faq = await readJSON<FaqEntry>(FAQ_FILE);
    faq = faq.filter((f) => f.id !== data.id);
    await writeJSON(FAQ_FILE, faq);
    return { success: true };
  });
