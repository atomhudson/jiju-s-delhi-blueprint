-- =====================================================
-- ANALYTICS & LIKE SYSTEM - DATABASE MIGRATION
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Page Views table (track website visits)
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path text NOT NULL,
  visitor_id text,
  user_agent text,
  referrer text,
  created_at timestamp with time zone DEFAULT now()
);

-- Project Views table (track which projects are viewed)
CREATE TABLE IF NOT EXISTS public.project_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  visitor_id text,
  created_at timestamp with time zone DEFAULT now()
);

-- Project Likes table (customers can like projects)
CREATE TABLE IF NOT EXISTS public.project_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, visitor_id)
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anyone can add views/likes)
DROP POLICY IF EXISTS "Allow public insert" ON public.page_views;
DROP POLICY IF EXISTS "Allow public insert" ON public.project_views;
DROP POLICY IF EXISTS "Allow public insert" ON public.project_likes;
DROP POLICY IF EXISTS "Allow public delete" ON public.project_likes;
DROP POLICY IF EXISTS "Allow public read" ON public.page_views;
DROP POLICY IF EXISTS "Allow public read" ON public.project_views;
DROP POLICY IF EXISTS "Allow public read" ON public.project_likes;

CREATE POLICY "Allow public insert" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON public.project_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON public.project_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.project_likes FOR DELETE USING (true);
CREATE POLICY "Allow public read" ON public.page_views FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.project_views FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.project_likes FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON public.project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON public.project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_visitor_id ON public.project_likes(visitor_id);

-- =====================================================
-- DONE! Analytics tables created.
-- =====================================================
