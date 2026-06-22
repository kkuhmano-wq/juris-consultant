import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export function isDbConnected(): boolean {
  return supabase !== null;
}

// Types shared across server files
export type Post = {
  id: string;
  cat: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  created_at: string;
};

export type FaqEntry = {
  id: string;
  q: string;
  a: string;
  order: number;
  created_at: string;
};

export type Prospect = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  created_at: string;
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
