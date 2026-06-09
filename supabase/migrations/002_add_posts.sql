-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Allow public read
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read posts" ON posts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert posts" ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update posts" ON posts
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete posts" ON posts
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Extend media table: allow new categories and add post relation
ALTER TABLE media DROP CONSTRAINT IF EXISTS media_category_check;
ALTER TABLE media ADD CONSTRAINT media_category_check CHECK (category IN ('photo', 'video', 'script', 'cinema', 'reportage-documentaire'));

ALTER TABLE media ADD COLUMN IF NOT EXISTS post_id UUID;
CREATE INDEX IF NOT EXISTS idx_media_post_id ON media(post_id);

ALTER TABLE media
  ADD CONSTRAINT fk_media_post
  FOREIGN KEY (post_id) REFERENCES posts(id)
  ON DELETE SET NULL;
