-- Add category column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'FACADE';