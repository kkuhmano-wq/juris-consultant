-- Run this SQL in your Supabase project SQL Editor
-- https://supabase.com/dashboard/project/<your-project>/sql/new

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  cat TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faq (
  id TEXT PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prospects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'contact',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: enable RLS with a simple public anon policy for reading/writing
-- Adjust these policies based on your security needs

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- Allow anon key to read/write all tables (sufficient for this app)
CREATE POLICY "anon_all_posts" ON posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_faq" ON faq FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_prospects" ON prospects FOR ALL USING (true) WITH CHECK (true);
