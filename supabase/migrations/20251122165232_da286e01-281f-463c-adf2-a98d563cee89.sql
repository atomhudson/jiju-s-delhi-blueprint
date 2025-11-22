-- Create enum for project status
CREATE TYPE project_status AS ENUM ('completed', 'ongoing', 'planned');

-- Create enum for project categories
CREATE TYPE project_category AS ENUM ('bathroom', 'bedroom', 'dining', 'kitchen', 'facade', 'living_room', 'terrace');

-- Create enum for inquiry status
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'resolved');

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  division TEXT,
  status project_status NOT NULL DEFAULT 'planned',
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_images table
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  category project_category NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_type project_category,
  message TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status inquiry_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects (public read, admin write)
CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

-- RLS Policies for project_images (public read)
CREATE POLICY "Project images are viewable by everyone"
  ON public.project_images FOR SELECT
  USING (true);

-- RLS Policies for inquiries (anyone can insert, no public read)
CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project images
CREATE POLICY "Project images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Insert seed data - 6 sample Delhi projects
INSERT INTO public.projects (title, address, latitude, longitude, division, status, start_date, end_date, description) VALUES
  ('Modern Villa Renovation', 'Connaught Place, Central Delhi', 28.6333, 77.2167, 'Central Delhi', 'completed', '2023-01-15', '2023-06-30', 'Complete renovation of a heritage villa with modern amenities'),
  ('Luxury Apartment Interior', 'Saket, South Delhi', 28.5244, 77.2100, 'South Delhi', 'completed', '2023-03-01', '2023-08-15', '3BHK apartment interior with premium finishes'),
  ('Commercial Complex', 'Rohini, North West Delhi', 28.7495, 77.0736, 'North West Delhi', 'ongoing', '2024-01-10', NULL, 'Multi-story commercial building construction'),
  ('Residential Tower', 'Mayur Vihar, East Delhi', 28.6082, 77.3010, 'East Delhi', 'ongoing', '2023-11-01', NULL, '15-floor residential tower with modern facilities'),
  ('Heritage Home Restoration', 'Rajouri Garden, West Delhi', 28.6415, 77.1200, 'West Delhi', 'completed', '2022-09-01', '2023-02-28', 'Restoration of a 1970s family home preserving original character'),
  ('Smart Home Project', 'Shahdara, North East Delhi', 28.6844, 77.2882, 'North East Delhi', 'planned', '2025-01-15', NULL, 'Eco-friendly smart home with sustainable materials');