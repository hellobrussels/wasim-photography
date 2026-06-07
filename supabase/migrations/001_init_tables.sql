-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  category TEXT NOT NULL CHECK (category IN ('photo', 'video', 'script')),
  section TEXT NOT NULL CHECK (section IN ('portfolio', 'hero', 'home')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster queries
CREATE INDEX idx_media_created_at ON media(created_at DESC);
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_section ON media(section);

-- Enable RLS (Row Level Security) on media table
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read" ON media
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update/delete (adjust as needed)
CREATE POLICY "Allow authenticated insert" ON media
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON media
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON media
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media bucket
CREATE POLICY "Allow public read media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Allow authenticated upload media" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete from media bucket
CREATE POLICY "Allow authenticated delete media" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );
