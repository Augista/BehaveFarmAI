-- Create news table for storing farming news and insights
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  category VARCHAR(50) NOT NULL, -- e.g., 'market', 'health', 'technology', 'weather'
  source VARCHAR(100),
  image_url TEXT,
  sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
  relevance_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_date TIMESTAMP,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_pinned ON news(is_pinned);

-- Add RLS policy (assuming Supabase)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to news" ON news
  FOR SELECT
  USING (true);
