-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  funding_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  languages TEXT,
  app_link TEXT,
  website_link TEXT,
  youtube_link TEXT,
  other_links TEXT,
  thumbnail TEXT,
  images TEXT,
  revenue TEXT,
  users TEXT,
  business_model TEXT,
  team_info TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'active',
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_funding_type ON projects(funding_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
