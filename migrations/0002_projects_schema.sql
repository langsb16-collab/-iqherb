-- Drop todos table
DROP TABLE IF EXISTS todos;

-- Create projects table with 5 youtube URLs
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_ko TEXT,
  title_en TEXT,
  title_zh TEXT,
  description TEXT,
  description_ko TEXT,
  description_en TEXT,
  description_zh TEXT,
  category TEXT,
  funding_type TEXT NOT NULL,
  amount INTEGER DEFAULT 0,
  youtube_url_1 TEXT,
  youtube_url_2 TEXT,
  youtube_url_3 TEXT,
  youtube_url_4 TEXT,
  youtube_url_5 TEXT,
  text_info TEXT,
  text_info_ko TEXT,
  text_info_en TEXT,
  text_info_zh TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample project
INSERT INTO projects (
  title, title_ko, title_en, title_zh,
  description, description_ko, description_en, description_zh,
  category, funding_type, amount,
  youtube_url_1, youtube_url_2,
  text_info, text_info_ko, text_info_en, text_info_zh
) VALUES (
  '혁신 모바일 앱', '혁신 모바일 앱', 'Innovative Mobile App', '创新移动应用',
  '사용자 경험 중심의 혁신적인 앱', '사용자 경험 중심의 혁신적인 앱', 'User-centric innovative app', '以用户体验为中心的创新应用',
  '앱', '투자', 50000,
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '프로젝트 상세 설명입니다.', '프로젝트 상세 설명입니다.', 'Project detailed description.', '项目详细说明。'
);
