-- =====================================================
-- MASTER RESET: FIX RPC AND RE-APPLY POLICIES v3
-- Run this in your Supabase SQL Editor
-- This handles dependency errors, existing policy errors, AND swapped argument ambiguity
-- =====================================================

-- 1. Drop ALL PERMUTATIONS of conflicting functions with CASCADE
-- This removes policies that depend on the function
DROP FUNCTION IF EXISTS public.has_role(text, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, text) CASCADE; -- Swapped args (text)
DROP FUNCTION IF EXISTS public.has_role(public.app_role, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE; -- Swapped args (enum) - LIKELY CULPRIT

-- 2. Define Enum if missing
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Recreate the AUTHORTATIVE function
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id uuid)
RETURNS boolean AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
  AND role = _role
);
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. Grant execute permission
GRANT EXECUTE ON FUNCTION public.has_role(public.app_role, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(public.app_role, uuid) TO service_role;

-- =====================================================
-- 5. RE-APPLY ALL POLICIES
-- We explicitly drop them first to avoid "already exists" errors
-- =====================================================

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK ( public.has_role('admin'::public.app_role, auth.uid()) );
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING ( public.has_role('admin'::public.app_role, auth.uid()) );
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- INQUIRIES
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;

CREATE POLICY "Public can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view inquiries" ON public.inquiries FOR SELECT USING ( public.has_role('admin'::public.app_role, auth.uid()) );
CREATE POLICY "Admins can update inquiries" ON public.inquiries FOR UPDATE USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- SERVICES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- TEAM MEMBERS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view team" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team" ON public.team_members;

CREATE POLICY "Public can view team" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team" ON public.team_members FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- MILESTONES
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view milestones" ON public.milestones;
DROP POLICY IF EXISTS "Admins can manage milestones" ON public.milestones;

CREATE POLICY "Public can view milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Admins can manage milestones" ON public.milestones FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- ACHIEVEMENTS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view achievements" ON public.achievements;
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;

CREATE POLICY "Public can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- CORE VALUES
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view core_values" ON public.core_values;
DROP POLICY IF EXISTS "Admins can manage core_values" ON public.core_values;

CREATE POLICY "Public can view core_values" ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Admins can manage core_values" ON public.core_values FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- BRAND PARTNERS
ALTER TABLE public.brand_partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view brand_partners" ON public.brand_partners;
DROP POLICY IF EXISTS "Admins can manage brand_partners" ON public.brand_partners;

CREATE POLICY "Public can view brand_partners" ON public.brand_partners FOR SELECT USING (true);
CREATE POLICY "Admins can manage brand_partners" ON public.brand_partners FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- INTERIOR CATEGORIES
ALTER TABLE public.interior_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view interior_categories" ON public.interior_categories;
DROP POLICY IF EXISTS "Admins can manage interior_categories" ON public.interior_categories;

CREATE POLICY "Public can view interior_categories" ON public.interior_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage interior_categories" ON public.interior_categories FOR ALL USING ( public.has_role('admin'::public.app_role, auth.uid()) );

-- Done!
