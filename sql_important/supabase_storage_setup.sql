-- =====================================================
-- Storage Bucket Setup for Project Images
-- =====================================================
-- Run this in Supabase SQL Editor to create the storage bucket
-- and set up the necessary RLS policies for admin uploads

-- 1. Create the storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- 3. Allow public read access to all images
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

-- 4. Allow authenticated users (admins) to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Allow authenticated users (admins) to update images
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Allow authenticated users (admins) to delete images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- ALTERNATIVE: If you want only admins to upload
-- Replace policies 4-6 with these stricter versions:
-- =====================================================

-- CREATE POLICY "Allow admin uploads"
-- ON storage.objects
-- FOR INSERT
-- WITH CHECK (
--   bucket_id = 'project-images' 
--   AND EXISTS (
--     SELECT 1 FROM public.user_roles 
--     WHERE user_id = auth.uid() 
--     AND role = 'admin'
--   )
-- );

-- CREATE POLICY "Allow admin updates"
-- ON storage.objects
-- FOR UPDATE
-- USING (
--   bucket_id = 'project-images' 
--   AND EXISTS (
--     SELECT 1 FROM public.user_roles 
--     WHERE user_id = auth.uid() 
--     AND role = 'admin'
--   )
-- );

-- CREATE POLICY "Allow admin deletes"
-- ON storage.objects
-- FOR DELETE
-- USING (
--   bucket_id = 'project-images' 
--   AND EXISTS (
--     SELECT 1 FROM public.user_roles 
--     WHERE user_id = auth.uid() 
--     AND role = 'admin'
--   )
-- );
