-- ============================================================
-- Workspace Collaboratif — Schéma de base de données
-- Cabinet JurisConsultants
-- ============================================================

-- 1. Membres du cabinet
create table if not exists membres (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  nom text not null,
  email text not null unique,
  role text not null check (role in ('ADMIN', 'ASSOCIE', 'JURISTE', 'STAGIAIRE')),
  actif boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Dossiers
create table if not exists workspace_dossiers (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  reference text,
  statut text default 'ouvert' check (statut in ('ouvert', 'en_cours', 'clos', 'archive')),
  responsable_id uuid references membres(id),
  client_nom text,
  client_contact text,
  date_ouverture timestamptz default now(),
  date_cloture timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Accès aux dossiers par membre
create table if not exists dossier_acces (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references workspace_dossiers(id) on delete cascade not null,
  membre_id uuid references membres(id) on delete cascade not null,
  permission text default 'consultation' check (permission in ('gestion', 'edition', 'consultation')),
  unique(dossier_id, membre_id)
);

-- 4. Tâches
create table if not exists workspace_taches (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references workspace_dossiers(id) on delete set null,
  titre text not null,
  description text,
  assignee_id uuid references membres(id),
  createur_id uuid references membres(id) not null,
  priorite text default 'moyenne' check (priorite in ('basse', 'moyenne', 'haute', 'urgente')),
  statut text default 'a_faire' check (statut in ('a_faire', 'en_cours', 'termine', 'annule')),
  date_echeance timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Messages
create table if not exists workspace_messages (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references workspace_dossiers(id) on delete set null,
  expediteur_id uuid references membres(id) not null,
  sujet text not null,
  contenu text not null,
  created_at timestamptz default now()
);

create table if not exists message_destinataires (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references workspace_messages(id) on delete cascade not null,
  membre_id uuid references membres(id) on delete cascade not null,
  lu boolean default false,
  lu_at timestamptz,
  unique(message_id, membre_id)
);

-- 6. Événements (agenda)
create table if not exists workspace_evenements (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  lieu text,
  type text default 'reunion' check (type in ('reunion', 'audience', 'rendez_vous', 'deadline', 'autre')),
  date_debut timestamptz not null,
  date_fin timestamptz,
  createur_id uuid references membres(id) not null,
  dossier_id uuid references workspace_dossiers(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists evenement_participants (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid references workspace_evenements(id) on delete cascade not null,
  membre_id uuid references membres(id) on delete cascade not null,
  unique(evenement_id, membre_id)
);

-- 7. Documents (bibliothèque)
create table if not exists workspace_documents (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid references workspace_dossiers(id) on delete set null,
  uploader_id uuid references membres(id) not null,
  nom text not null,
  description text,
  type text,
  taille bigint,
  url text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_membres_user_id on membres(user_id);
create index if not exists idx_membres_role on membres(role);
create index if not exists idx_membres_email on membres(email);
create index if not exists idx_workspace_dossiers_responsable on workspace_dossiers(responsable_id);
create index if not exists idx_workspace_dossiers_statut on workspace_dossiers(statut);
create index if not exists idx_dossier_acces_dossier on dossier_acces(dossier_id);
create index if not exists idx_dossier_acces_membre on dossier_acces(membre_id);
create index if not exists idx_workspace_taches_assignee on workspace_taches(assignee_id);
create index if not exists idx_workspace_taches_dossier on workspace_taches(dossier_id);
create index if not exists idx_workspace_taches_statut on workspace_taches(statut);
create index if not exists idx_workspace_messages_expediteur on workspace_messages(expediteur_id);
create index if not exists idx_message_destinataires_membre on message_destinataires(membre_id);
create index if not exists idx_workspace_evenements_date on workspace_evenements(date_debut);
create index if not exists idx_workspace_documents_dossier on workspace_documents(dossier_id);

-- Enable RLS
alter table membres enable row level security;
alter table workspace_dossiers enable row level security;
alter table dossier_acces enable row level security;
alter table workspace_taches enable row level security;
alter table workspace_messages enable row level security;
alter table message_destinataires enable row level security;
alter table workspace_evenements enable row level security;
alter table evenement_participants enable row level security;
alter table workspace_documents enable row level security;

-- RLS Policies
-- Membres: lecture pour tous les membres authentifiés, écriture pour ADMIN uniquement
create policy "Membres select" on membres
  for select using (auth.role() = 'authenticated');
create policy "Membres insert" on membres
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );
create policy "Membres update" on membres
  for update using (
    exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );
create policy "Membres delete" on membres
  for delete using (
    exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );

-- Dossiers: ADMIN et ASSOCIE voient tout, les autres voient selon dossier_acces
create policy "Dossiers select" on workspace_dossiers
  for select using (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
    or exists (select 1 from dossier_acces da join membres m on m.id = da.membre_id where m.user_id = auth.uid() and da.dossier_id = workspace_dossiers.id)
  );
create policy "Dossiers insert" on workspace_dossiers
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Dossiers update" on workspace_dossiers
  for update using (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Dossiers delete" on workspace_dossiers
  for delete using (
    exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );

-- dossier_acces: visible par le membre concerné et ADMIN
create policy "dossier_acces select" on dossier_acces
  for select using (
    membre_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );
create policy "dossier_acces insert" on dossier_acces
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "dossier_acces delete" on dossier_acces
  for delete using (
    exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );

-- Tâches: select pour qui peut voir selon son rôle
create policy "Taches select" on workspace_taches
  for select using (
    assignee_id = (select id from membres where user_id = auth.uid())
    or createur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Taches insert" on workspace_taches
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE', 'JURISTE'))
  );
create policy "Taches update" on workspace_taches
  for update using (
    assignee_id = (select id from membres where user_id = auth.uid())
    or createur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Taches delete" on workspace_taches
  for delete using (
    exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );

-- Messages
create policy "Messages select" on workspace_messages
  for select using (
    expediteur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from message_destinataires md join membres m on m.id = md.membre_id where m.user_id = auth.uid() and md.message_id = workspace_messages.id)
  );
create policy "Messages insert" on workspace_messages
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid())
  );
create policy "Messages delete" on workspace_messages
  for delete using (
    expediteur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );

-- message_destinataires
create policy "Destinataires select" on message_destinataires
  for select using (
    membre_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );
create policy "Destinataires insert" on message_destinataires
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid()) and
    exists (select 1 from workspace_messages where id = message_id and expediteur_id = (select id from membres where user_id = auth.uid()))
  );
create policy "Destinataires update" on message_destinataires
  for update using (
    membre_id = (select id from membres where user_id = auth.uid())
  );

-- Événements
create policy "Evenements select" on workspace_evenements
  for select using (
    createur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from evenement_participants ep join membres m on m.id = ep.membre_id where m.user_id = auth.uid() and ep.evenement_id = workspace_evenements.id)
    or exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Evenements insert" on workspace_evenements
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid())
  );
create policy "Evenements update" on workspace_evenements
  for update using (
    createur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );
create policy "Evenements delete" on workspace_evenements
  for delete using (
    createur_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );

-- evenement_participants
create policy "Participants select" on evenement_participants
  for select using (
    membre_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Participants insert" on evenement_participants
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid())
  );
create policy "Participants delete" on evenement_participants
  for delete using (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );

-- Documents
create policy "Documents select" on workspace_documents
  for select using (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
    or exists (select 1 from dossier_acces da join membres m on m.id = da.membre_id where m.user_id = auth.uid() and (da.dossier_id = workspace_documents.dossier_id or da.dossier_id is null))
    or uploader_id = (select id from membres where user_id = auth.uid())
  );
create policy "Documents insert" on workspace_documents
  for insert with check (
    exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE', 'JURISTE'))
  );
create policy "Documents update" on workspace_documents
  for update using (
    uploader_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role in ('ADMIN', 'ASSOCIE'))
  );
create policy "Documents delete" on workspace_documents
  for delete using (
    uploader_id = (select id from membres where user_id = auth.uid())
    or exists (select 1 from membres where user_id = auth.uid() and role = 'ADMIN')
  );
