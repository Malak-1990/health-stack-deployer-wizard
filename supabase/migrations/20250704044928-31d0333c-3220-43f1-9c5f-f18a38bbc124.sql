-- Remove the incorrect unique constraint on the role column
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_key;