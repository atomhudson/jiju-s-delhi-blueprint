-- =====================================================
-- STAMBHA CONSTRUCTIONS - DATABASE MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: CREATE TABLES (if not exist)
-- =====================================================

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  value text NOT NULL,
  label text NOT NULL,
  icon text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Interior categories table
CREATE TABLE IF NOT EXISTS public.interior_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  gradient text,
  accent text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Team members table (if not exist)
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  designation text NOT NULL,
  image_url text,
  description text,
  quote text,
  experience text,
  is_founder boolean DEFAULT false,
  linkedin_url text,
  email text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Milestones table (if not exist)
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year text NOT NULL,
  title text NOT NULL,
  description text,
  highlight text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Core values table (if not exist)
CREATE TABLE IF NOT EXISTS public.core_values (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text NOT NULL,
  title text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Brand partners table (if not exist)
CREATE TABLE IF NOT EXISTS public.brand_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  tagline text,
  color_gradient text,
  logo_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Services table (if not exist)
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- PART 2: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interior_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 3: CREATE RLS POLICIES (drop first if exist)
-- =====================================================

-- Achievements policies
DROP POLICY IF EXISTS "Allow public read" ON public.achievements;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.achievements;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.achievements;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.achievements;
CREATE POLICY "Allow public read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.achievements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.achievements FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.achievements FOR DELETE USING (auth.uid() IS NOT NULL);

-- Interior categories policies
DROP POLICY IF EXISTS "Allow public read" ON public.interior_categories;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.interior_categories;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.interior_categories;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.interior_categories;
CREATE POLICY "Allow public read" ON public.interior_categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.interior_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.interior_categories FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.interior_categories FOR DELETE USING (auth.uid() IS NOT NULL);

-- Team members policies
DROP POLICY IF EXISTS "Allow public read" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.team_members;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.team_members;
CREATE POLICY "Allow public read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.team_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.team_members FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.team_members FOR DELETE USING (auth.uid() IS NOT NULL);

-- Milestones policies
DROP POLICY IF EXISTS "Allow public read" ON public.milestones;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.milestones;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.milestones;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.milestones;
CREATE POLICY "Allow public read" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.milestones FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.milestones FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.milestones FOR DELETE USING (auth.uid() IS NOT NULL);

-- Core values policies
DROP POLICY IF EXISTS "Allow public read" ON public.core_values;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.core_values;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.core_values;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.core_values;
CREATE POLICY "Allow public read" ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.core_values FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.core_values FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.core_values FOR DELETE USING (auth.uid() IS NOT NULL);

-- Brand partners policies
DROP POLICY IF EXISTS "Allow public read" ON public.brand_partners;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.brand_partners;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.brand_partners;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.brand_partners;
CREATE POLICY "Allow public read" ON public.brand_partners FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.brand_partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.brand_partners FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.brand_partners FOR DELETE USING (auth.uid() IS NOT NULL);

-- Services policies
DROP POLICY IF EXISTS "Allow public read" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.services;
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON public.services FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated update" ON public.services FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated delete" ON public.services FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- PART 4: INSERT DEFAULT DATA
-- =====================================================

-- Clear existing data first
DELETE FROM public.achievements;
DELETE FROM public.interior_categories;
DELETE FROM public.team_members;
DELETE FROM public.milestones;
DELETE FROM public.core_values;
DELETE FROM public.brand_partners;
DELETE FROM public.services;

-- Insert Achievements
INSERT INTO public.achievements (value, label, icon, description, display_order) VALUES
  ('50+', 'Years of Legacy', 'Calendar', 'Three generations', 0),
  ('500+', 'Projects Completed', 'Building', 'Residential & commercial', 1),
  ('1000+', 'Happy Families', 'Users', 'Living in our creations', 2),
  ('100%', 'Client Satisfaction', 'Award', 'Our proudest achievement', 3);

-- Insert Interior Categories
INSERT INTO public.interior_categories (name, icon, gradient, accent, display_order) VALUES
  ('BATHROOM', 'Bath', 'from-sky-400/20 via-blue-500/10 to-indigo-500/20', 'bg-sky-500', 0),
  ('BEDROOM', 'Bed', 'from-violet-400/20 via-purple-500/10 to-fuchsia-500/20', 'bg-violet-500', 1),
  ('DINING', 'Coffee', 'from-amber-400/20 via-orange-500/10 to-red-500/20', 'bg-amber-500', 2),
  ('KITCHEN', 'ChefHat', 'from-rose-400/20 via-red-500/10 to-pink-500/20', 'bg-rose-500', 3),
  ('FACADE', 'Home', 'from-slate-400/20 via-zinc-500/10 to-stone-500/20', 'bg-slate-500', 4),
  ('LIVING ROOM', 'Armchair', 'from-emerald-400/20 via-green-500/10 to-teal-500/20', 'bg-emerald-500', 5),
  ('TERRACE', 'TreePine', 'from-lime-400/20 via-green-500/10 to-emerald-500/20', 'bg-lime-500', 6);

-- Insert Team Members
INSERT INTO public.team_members (name, designation, image_url, description, quote, experience, is_founder, linkedin_url, email, display_order) VALUES
  ('Rajesh Kumar', 'Founder & Managing Director', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 
   'With over 35 years of experience in construction, Rajesh ji laid the foundation of Stambha Constructions. His vision of honest, quality-driven work has been the guiding principle for our entire journey. Under his leadership, we have completed 500+ projects across Delhi NCR.',
   'Every brick we lay is a promise of trust and quality.', '35+ Years', true, '', '', 0),
  ('Amit Kumar', 'Director & Head of Operations', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
   'Amit brings modern construction techniques while honoring traditional values. With expertise in project management and interior design, he ensures every project meets the highest standards of excellence.',
   'Innovation meets tradition in every project we undertake.', '15+ Years', false, '', '', 1),
  ('Suresh Sharma', 'Partner & Technical Head', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
   'Suresh oversees all technical aspects of our construction projects. His expertise in structural engineering and attention to detail ensures that every build is safe, durable, and built to last generations.',
   'Precision and safety are non-negotiable in our work.', '20+ Years', false, '', '', 2);

-- Insert Milestones
INSERT INTO public.milestones (year, title, description, highlight, display_order) VALUES
  ('1970s', 'The Foundation', 'Our grandfather laid the first brick of what would become a legacy. Starting with small residential projects in Old Delhi, he built a reputation for honesty and quality.', 'Family Legacy Begins', 0),
  ('1990s', 'Expansion Era', 'The second generation expanded operations across Delhi NCR, modernizing techniques while preserving traditional craftsmanship values.', 'Delhi NCR Growth', 1),
  ('2012', 'New Leadership', 'Current leadership brings fresh perspective with modern design sensibilities and sustainable building practices.', 'Modern Innovation', 2),
  ('Today', 'Excellence Achieved', 'With 500+ completed projects and 100% client satisfaction, we continue to build dreams into reality.', '500+ Projects', 3);

-- Insert Core Values
INSERT INTO public.core_values (icon, title, description, display_order) VALUES
  ('Shield', 'Integrity First', 'Transparent pricing, honest timelines, and no hidden costs.', 0),
  ('Hammer', 'Master Craftsmanship', 'Three generations of refined construction techniques.', 1),
  ('Heart', 'Client Relationships', 'Many clients have become family friends over the decades.', 2),
  ('Eye', 'Attention to Detail', 'We obsess over every corner, finish, and detail.', 3);

-- Insert Brand Partners
INSERT INTO public.brand_partners (name, tagline, color_gradient, display_order) VALUES
  ('UltraTech', 'The Engineers Choice', 'from-blue-500/20 to-blue-600/20', 0),
  ('TATA Tiscon', 'Super Ductile TMT', 'from-red-500/20 to-red-600/20', 1),
  ('Kajaria', 'Indias No.1 Tile', 'from-orange-500/20 to-orange-600/20', 2),
  ('Kohler', 'The Bold Look', 'from-slate-500/20 to-slate-600/20', 3),
  ('Asian Paints', 'Har Ghar Kuch Kehta Hai', 'from-rose-500/20 to-rose-600/20', 4),
  ('Havells', 'Wires That Dont Catch Fire', 'from-yellow-500/20 to-yellow-600/20', 5),
  ('Pidilite', 'Building Bonds', 'from-purple-500/20 to-purple-600/20', 6),
  ('Saint-Gobain', 'Making a Difference', 'from-teal-500/20 to-teal-600/20', 7);

-- Insert Services
INSERT INTO public.services (title, description, image_url, display_order) VALUES
  ('Bathroom', 'Luxury spa-like bathrooms with modern fixtures', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80', 0),
  ('Bedroom', 'Comfortable sanctuaries for rest', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80', 1),
  ('Kitchen', 'Functional and beautiful cooking spaces', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', 2),
  ('Living Room', 'Inviting spaces for family gatherings', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80', 3),
  ('Dining', 'Elegant dining experiences', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80', 4),
  ('Facade', 'Stunning exterior impressions', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', 5),
  ('Terrace', 'Outdoor retreats with views', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', 6),
  ('Study Room', 'Focused workspaces at home', 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=600&q=80', 7);

-- =====================================================
-- DONE! All tables created and populated.
-- =====================================================
