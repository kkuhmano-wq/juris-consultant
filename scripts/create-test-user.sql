-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nhcjbkxqywqjxmgptqng/sql/new

-- Create a test client user
-- Password: Hermann00
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token,
  email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'kkuhmano@gmail.com',
  crypt('Hermann00', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"prenom":"Kouamé","nom":"Konan","telephone":"+225 07 07 07 07"}',
  now(), now(), '', '', '', ''
);

-- Also create the identity entry
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'kkuhmano@gmail.com'),
  jsonb_build_object('sub', (SELECT id::text FROM auth.users WHERE email = 'kkuhmano@gmail.com'), 'email', 'kkuhmano@gmail.com'),
  'email',
  'kkuhmano@gmail.com',
  now(), now(), now()
);

SELECT '✓ Test user created: kkuhmano@gmail.com / Hermann00' AS result;
