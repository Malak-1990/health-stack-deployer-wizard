-- Create missing profile for the current user who doesn't have one
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '9bfa91be-1f94-457f-9d3a-07a22a198574',
  'pofdkjdas@gmail.com',
  'laia',
  'patient',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;