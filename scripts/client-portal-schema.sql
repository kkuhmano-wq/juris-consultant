-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nhcjbkxqywqjxmgptqng/sql/new

-- Dossiers clients
CREATE TABLE IF NOT EXISTS client_dossiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'en_cours'
    CHECK (status IN ('en_cours', 'en_attente', 'termine', 'archive')),
  category TEXT DEFAULT '',
  reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents clients
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES client_dossiers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT '',
  size TEXT DEFAULT '',
  url TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dossiers_client ON client_dossiers(client_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_status ON client_dossiers(status);
CREATE INDEX IF NOT EXISTS idx_documents_dossier ON client_documents(dossier_id);
CREATE INDEX IF NOT EXISTS idx_documents_client ON client_documents(client_id);

-- Enable RLS
ALTER TABLE client_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

-- Clients can read their own dossiers and documents
DO $$ BEGIN
  CREATE POLICY "clients_read_own_dossiers" ON client_dossiers
    FOR SELECT USING (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "clients_read_own_documents" ON client_documents
    FOR SELECT USING (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_dossiers" ON client_dossiers
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Demandes de rendez-vous ────────────────────────────
CREATE TABLE IF NOT EXISTS client_rendez_vous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT DEFAULT '',
  jours_proposes DATE[] NOT NULL DEFAULT '{}',
  statut TEXT NOT NULL DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'confirme', 'refuse')),
  message_cabinet TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rdv_client ON client_rendez_vous(client_id);
CREATE INDEX IF NOT EXISTS idx_rdv_statut ON client_rendez_vous(statut);

ALTER TABLE client_rendez_vous ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "clients_read_own_rdv" ON client_rendez_vous
    FOR SELECT USING (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "clients_insert_own_rdv" ON client_rendez_vous
    FOR INSERT WITH CHECK (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "clients_update_own_rdv" ON client_rendez_vous
    FOR UPDATE USING (auth.uid() = client_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Storage bucket pour les documents ──────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('client-documents', 'client-documents', true, 52428800, '{ "application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain" }')
ON CONFLICT (id) DO NOTHING;

-- RLS : permettre l'upload via service_role (pas d'accès public anonyme)
DO $$ BEGIN
  CREATE POLICY "service_role_all" ON storage.objects
    FOR ALL USING (bucket_id = 'client-documents' AND auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

SELECT '✓ Tables client_dossiers, client_documents, client_rendez_vous, and storage ready' AS result;
