-- =====================================================
-- ADD IMAGE URL TO PROJECTS & ADD DEMO DATA
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Step 1: Add image_url column to projects table (for direct external URLs)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url text;

-- Step 2: Update existing projects with demo images
-- These are beautiful construction/interior images from Unsplash

-- Update all projects with rotating demo images based on their category
UPDATE public.projects
SET image_url = CASE 
  WHEN category ILIKE '%BATHROOM%' THEN 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80'
  WHEN category ILIKE '%BEDROOM%' THEN 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80'
  WHEN category ILIKE '%KITCHEN%' THEN 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
  WHEN category ILIKE '%LIVING%' THEN 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'
  WHEN category ILIKE '%DINING%' THEN 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80'
  WHEN category ILIKE '%FACADE%' THEN 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'
  WHEN category ILIKE '%TERRACE%' THEN 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'
  ELSE 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
END
WHERE image_url IS NULL;

-- =====================================================
-- DONE! Your projects now have demo images in image_url column.
-- =====================================================
