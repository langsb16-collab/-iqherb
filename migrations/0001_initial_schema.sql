-- OpenFunding IT Hub Database Schema
-- Created: 2025-12-06
-- Purpose: Permanent storage for projects, announcements, and news

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  funding_type TEXT,
  target_amount INTEGER,
  current_amount INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  youtube_url TEXT,
  text_info TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Projects indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_funding_type ON projects(funding_type);

-- ============================================
-- 2. ANNOUNCEMENTS TABLE (공지)
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Announcements indexes
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);

-- ============================================
-- 3. NEWS TABLE (참고뉴스)
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- News indexes
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- ============================================
-- INITIAL DATA (Optional - for testing)
-- ============================================
-- Insert sample announcement
INSERT OR IGNORE INTO announcements (id, title, content, status) 
VALUES ('welcome-1', 'OpenFunding IT Hub 오픈!', '개발자를 위한 전략적 투자 조달 플랫폼이 오픈했습니다.', 'active');

-- Migration completed successfully
