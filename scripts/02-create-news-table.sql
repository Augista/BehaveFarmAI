-- Create news_items table for storing generated news articles
CREATE TABLE IF NOT EXISTS news_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100), -- 'berita', 'kebijakan', 'jatim'
  source VARCHAR(255),
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cached_until TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_cached_until ON news_items(cached_until);

-- Create comparison_logs table for tracking chart comparisons
CREATE TABLE IF NOT EXISTS comparison_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flock_id VARCHAR(100) NOT NULL DEFAULT 'flock-1',
  comparison_type VARCHAR(50), -- 'day_vs_day', 'month_vs_month', 'yoy'
  date_from DATE,
  date_to DATE,
  metric_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comparison_flock_id ON comparison_logs(flock_id);
