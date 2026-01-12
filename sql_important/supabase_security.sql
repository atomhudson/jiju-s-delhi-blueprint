-- =====================================================
-- BACKEND SECURITY: ROLE-BASED ACCESS CONTROL (RLS)
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 0. SETUP: Ensure Role Types and Tables Exist

-- Create Enum if not exists (handling the type issue)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create the has_role function safely
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id uuid)
RETURNS boolean AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
  AND role = _role
);
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- 1. Enable RLS on all Content Tables
-- =====================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interior_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Define Policies with Explicit Type Casting
-- error 42883 fix: cast 'admin' to app_role enum
-- =====================================================

-- PROJECTS
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK ( public.has_role('admin'::public.app_role, auth.uid()) );

DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- INQUIRIES
DROP POLICY IF EXISTS "Public can create inquiries" ON public.inquiries;
CREATE POLICY "Public can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
CREATE POLICY "Admins can view inquiries" ON public.inquiries
  FOR SELECT USING ( public.has_role('admin'::public.app_role, auth.uid()) );

DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
CREATE POLICY "Admins can update inquiries" ON public.inquiries
  FOR UPDATE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- SERVICES
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TITLE: Team Members
DROP POLICY IF EXISTS "Public can view team" ON public.team_members;
CREATE POLICY "Public can view team" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage team" ON public.team_members;
CREATE POLICY "Admins can manage team" ON public.team_members
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TITLE: Milestones
DROP POLICY IF EXISTS "Public can view milestones" ON public.milestones;
CREATE POLICY "Public can view milestones" ON public.milestones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage milestones" ON public.milestones;
CREATE POLICY "Admins can manage milestones" ON public.milestones
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TITLE: Achievements
DROP POLICY IF EXISTS "Public can view achievements" ON public.achievements;
CREATE POLICY "Public can view achievements" ON public.achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TITLE: Core Values
DROP POLICY IF EXISTS "Public can view core_values" ON public.core_values;
CREATE POLICY "Public can view core_values" ON public.core_values FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage core_values" ON public.core_values;
CREATE POLICY "Admins can manage core_values" ON public.core_values
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TITLE: Brand Partners
DROP POLICY IF EXISTS "Public can view brand_partners" ON public.brand_partners;
CREATE POLICY "Public can view brand_partners" ON public.brand_partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage brand_partners" ON public.brand_partners;
CREATE POLICY "Admins can manage brand_partners" ON public.brand_partners
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TITLE: Interior Categories
DROP POLICY IF EXISTS "Public can view interior_categories" ON public.interior_categories;
CREATE POLICY "Public can view interior_categories" ON public.interior_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage interior_categories" ON public.interior_categories;
CREATE POLICY "Admins can manage interior_categories" ON public.interior_categories
  FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- =====================================================
-- 3. ASSIGN ADMIN ROLE TO YOURSELF
-- =====================================================
-- IMPORTANT: Use your User ID from authentication tab
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'admin'::public.app_role);
