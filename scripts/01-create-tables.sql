-- Create farm_data table for daily monitoring
CREATE TABLE IF NOT EXISTS farm_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  flock_id VARCHAR(100) NOT NULL DEFAULT 'flock-1',
  feed_consumed_kg DECIMAL(10, 2),
  water_consumed_liters DECIMAL(10, 2),
  mortality_count INT DEFAULT 0,
  live_bird_count INT,
  avg_weight_kg DECIMAL(8, 3),
  temperature_celsius DECIMAL(5, 2),
  humidity_percentage DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(flock_id, date)
);

-- Create ai_insights table for storing AI recommendations
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flock_id VARCHAR(100) NOT NULL DEFAULT 'flock-1',
  insight_type VARCHAR(50) NOT NULL, -- 'anomaly', 'recommendation', 'forecast'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
  action_items TEXT[],
  data_analyzed_from DATE,
  data_analyzed_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table for critical events
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flock_id VARCHAR(100) NOT NULL DEFAULT 'flock-1',
  alert_type VARCHAR(100) NOT NULL, -- 'high_mortality', 'abnormal_fcr', 'feed_shortage', etc
  message TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'warning', -- 'info', 'warning', 'critical'
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_farm_data_date ON farm_data(date DESC);
CREATE INDEX IF NOT EXISTS idx_farm_data_flock ON farm_data(flock_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_flock ON ai_insights(flock_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created ON ai_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_flock ON alerts(flock_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
