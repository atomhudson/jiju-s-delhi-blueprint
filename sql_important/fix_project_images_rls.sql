-- =====================================================
-- FIX: Add missing RLS policies for project_images table
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable RLS (in case not enabled)
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON public.project_images;
DROP POLICY IF EXISTS "Public can view project_images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can insert project_images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can update project_images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can delete project_images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can manage project_images" ON public.project_images;

-- Create policies
-- Anyone can view project images
CREATE POLICY "Public can view project_images" ON public.project_images
  FOR SELECT USING (true);

-- Admins can insert project images
CREATE POLICY "Admins can insert project_images" ON public.project_images
  FOR INSERT WITH CHECK ( public.has_role('admin'::public.app_role, auth.uid()) );

-- Admins can update project images
CREATE POLICY "Admins can update project_images" ON public.project_images
  FOR UPDATE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- Admins can delete project images
CREATE POLICY "Admins can delete project_images" ON public.project_images
  FOR DELETE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- =====================================================
-- DONE! Now admins can add/edit/delete project images.
-- =====================================================
