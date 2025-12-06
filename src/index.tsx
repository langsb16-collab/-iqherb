import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// In-memory storage as fallback when D1 is not available
let memoryProjects: any[] = []

// Enable CORS for all routes with permissive settings
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: false,
}))

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// API Routes - Projects CRUD
// ============================================

// Get all projects
app.get('/api/projects', async (c) => {
  try {
    // Try D1 database first
    if (c.env.DB) {
      try {
        const { results } = await c.env.DB.prepare(
          'SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC'
        ).bind('active').all()
        return c.json({ success: true, data: results })
      } catch (dbError) {
        console.warn('D1 error, falling back to memory:', dbError)
      }
    }
    
    // Fallback to memory storage
    const activeProjects = memoryProjects.filter(p => p.status === 'active' || !p.status)
    return c.json({ 
      success: true, 
      data: activeProjects,
      message: memoryProjects.length === 0 ? 'No projects yet. Add some through the admin panel!' : undefined
    })
  } catch (error) {
    console.error('API error:', error)
    return c.json({ success: true, data: [] })
  }
})

// Get single project by ID
app.get('/api/projects/:id', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, error: 'Database not configured' }, 500)
    }
    
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(id).all()
    
    if (results.length === 0) {
      return c.json({ success: false, error: 'Project not found' }, 404)
    }
    
    // Increment view count
    await c.env.DB.prepare(
      'UPDATE projects SET view_count = view_count + 1 WHERE id = ?'
    ).bind(id).run()
    
    return c.json({ success: true, data: results[0] })
  } catch (error) {
    console.error('DB error:', error)
    return c.json({ success: false, error: 'Database connection issue' }, 500)
  }
})

// Create new project
app.post('/api/projects', async (c) => {
  try {
    const body = await c.req.json()
    
    // Try D1 first
    if (c.env.DB) {
      try {
        const result = await c.env.DB.prepare(`
          INSERT INTO projects (
            title, description, category, funding_type, amount, languages,
            app_link, website_link, youtube_link, other_links,
            thumbnail, revenue, users, business_model, team_info,
            contact_name, contact_email, contact_phone, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          body.title,
          body.description || '',
          body.category || '',
          body.funding_type || '',
          body.amount || 0,
          body.languages || '',
          body.app_link || '',
          body.website_link || '',
          body.youtube_link || '',
          body.other_links || '',
          body.thumbnail || '',
          body.revenue || '',
          body.users || '',
          body.business_model || '',
          body.team_info || '',
          body.contact_name || '',
          body.contact_email || '',
          body.contact_phone || '',
          body.status || 'active'
        ).run()
        
        return c.json({ 
          success: true, 
          data: { id: result.meta.last_row_id } 
        })
      } catch (dbError) {
        console.warn('D1 error, using memory storage:', dbError)
      }
    }
    
    // Fallback to memory storage
    const newProject = {
      id: Date.now(),
      ...body,
      status: body.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0
    }
    
    memoryProjects.push(newProject)
    
    return c.json({ 
      success: true, 
      data: { id: newProject.id } 
    })
  } catch (error) {
    console.error('Create project error:', error)
    return c.json({ success: false, error: 'Failed to create project' }, 500)
  }
})

// Update project
app.put('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    // Try D1 first
    if (c.env.DB) {
      try {
        await c.env.DB.prepare(`
          UPDATE projects SET
            title = ?, description = ?, category = ?, funding_type = ?, 
            amount = ?, languages = ?, app_link = ?, website_link = ?, 
            youtube_link = ?, other_links = ?, thumbnail = ?,
            revenue = ?, users = ?, business_model = ?, team_info = ?,
            contact_name = ?, contact_email = ?, contact_phone = ?,
            status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(
          body.title,
          body.description || '',
          body.category || '',
          body.funding_type || '',
          body.amount || 0,
          body.languages || '',
          body.app_link || '',
          body.website_link || '',
          body.youtube_link || '',
          body.other_links || '',
          body.thumbnail || '',
          body.revenue || '',
          body.users || '',
          body.business_model || '',
          body.team_info || '',
          body.contact_name || '',
          body.contact_email || '',
          body.contact_phone || '',
          body.status || 'active',
          id
        ).run()
        return c.json({ success: true })
      } catch (dbError) {
        console.warn('D1 error, using memory storage:', dbError)
      }
    }
    
    // Fallback to memory storage
    const idx = memoryProjects.findIndex(p => p.id == id)
    if (idx !== -1) {
      memoryProjects[idx] = {
        ...memoryProjects[idx],
        ...body,
        updated_at: new Date().toISOString()
      }
      return c.json({ success: true })
    }
    
    return c.json({ success: false, error: 'Project not found' }, 404)
  } catch (error) {
    console.error('Update project error:', error)
    return c.json({ success: false, error: 'Failed to update project' }, 500)
  }
})

// Delete project
app.delete('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Try D1 first
    if (c.env.DB) {
      try {
        await c.env.DB.prepare(
          'DELETE FROM projects WHERE id = ?'
        ).bind(id).run()
        return c.json({ success: true })
      } catch (dbError) {
        console.warn('D1 error, using memory storage:', dbError)
      }
    }
    
    // Fallback to memory storage
    const initialLength = memoryProjects.length
    memoryProjects = memoryProjects.filter(p => p.id != id)
    
    if (memoryProjects.length < initialLength) {
      return c.json({ success: true })
    }
    
    return c.json({ success: false, error: 'Project not found' }, 404)
  } catch (error) {
    console.error('Delete project error:', error)
    return c.json({ success: false, error: 'Failed to delete project' }, 500)
  }
})

// ============================================
// API Routes - Announcements CRUD
// ============================================

let memoryAnnouncements: any[] = []

// Get all announcements
app.get('/api/announcements', async (c) => {
  try {
    const activeAnnouncements = memoryAnnouncements.filter(a => a.status === 'active' || !a.status)
    return c.json({ success: true, data: activeAnnouncements })
  } catch (error) {
    console.error('Announcements API error:', error)
    return c.json({ success: true, data: [] })
  }
})

// Create new announcement
app.post('/api/announcements', async (c) => {
  try {
    const body = await c.req.json()
    const newAnnouncement = {
      id: Date.now(),
      title: body.title,
      content: body.content,
      image_url: body.image_url || '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    memoryAnnouncements.push(newAnnouncement)
    return c.json({ success: true, data: newAnnouncement })
  } catch (error) {
    console.error('Create announcement error:', error)
    return c.json({ success: false, error: 'Failed to create announcement' }, 500)
  }
})

// Update announcement
app.put('/api/announcements/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const idx = memoryAnnouncements.findIndex(a => a.id == id)
    if (idx !== -1) {
      memoryAnnouncements[idx] = {
        ...memoryAnnouncements[idx],
        ...body,
        updated_at: new Date().toISOString()
      }
      return c.json({ success: true })
    }
    return c.json({ success: false, error: 'Announcement not found' }, 404)
  } catch (error) {
    console.error('Update announcement error:', error)
    return c.json({ success: false, error: 'Failed to update announcement' }, 500)
  }
})

// Delete announcement
app.delete('/api/announcements/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const initialLength = memoryAnnouncements.length
    memoryAnnouncements = memoryAnnouncements.filter(a => a.id != id)
    if (memoryAnnouncements.length < initialLength) {
      return c.json({ success: true })
    }
    return c.json({ success: false, error: 'Announcement not found' }, 404)
  } catch (error) {
    console.error('Delete announcement error:', error)
    return c.json({ success: false, error: 'Failed to delete announcement' }, 500)
  }
})

// ============================================
// API Routes - News CRUD
// ============================================

let memoryNews: any[] = []

// Get all news
app.get('/api/news', async (c) => {
  try {
    const activeNews = memoryNews.filter(n => n.status === 'active' || !n.status)
    return c.json({ success: true, data: activeNews })
  } catch (error) {
    console.error('News API error:', error)
    return c.json({ success: true, data: [] })
  }
})

// Create new news
app.post('/api/news', async (c) => {
  try {
    const body = await c.req.json()
    const newNews = {
      id: Date.now(),
      title: body.title,
      youtube_link: body.youtube_link || '',
      description: body.description || '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    memoryNews.push(newNews)
    return c.json({ success: true, data: newNews })
  } catch (error) {
    console.error('Create news error:', error)
    return c.json({ success: false, error: 'Failed to create news' }, 500)
  }
})

// Update news
app.put('/api/news/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const idx = memoryNews.findIndex(n => n.id == id)
    if (idx !== -1) {
      memoryNews[idx] = {
        ...memoryNews[idx],
        ...body,
        updated_at: new Date().toISOString()
      }
      return c.json({ success: true })
    }
    return c.json({ success: false, error: 'News not found' }, 404)
  } catch (error) {
    console.error('Update news error:', error)
    return c.json({ success: false, error: 'Failed to update news' }, 500)
  }
})

// Delete news
app.delete('/api/news/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const initialLength = memoryNews.length
    memoryNews = memoryNews.filter(n => n.id != id)
    if (memoryNews.length < initialLength) {
      return c.json({ success: true })
    }
    return c.json({ success: false, error: 'News not found' }, 404)
  } catch (error) {
    console.error('Delete news error:', error)
    return c.json({ success: false, error: 'Failed to delete news' }, 500)
  }
})

// ============================================
// Frontend Routes
// ============================================

// Main page - SPA with admin route
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OpenFunding IT Hub</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body { font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
          .hero-gradient { background: linear-gradient(135deg, #a855f7 0%, #c026d3 100%); }
          .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
          .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }
          .badge-investment { background-color: #EF4444; color: white; }
          .badge-revenue { background-color: #10B981; color: white; }
          .badge-loan { background-color: #F59E0B; color: white; }
          .amount-tag { background-color: #FCD34D; color: #92400E; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Main Content Container -->
        <div id="mainContent">
        <!-- Header -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div class="flex justify-center items-center">
                    <div class="text-center">
                        <h1 class="text-lg sm:text-xl font-bold text-gray-900">
                            <i class="fas fa-rocket text-purple-600 mr-1"></i>
                            OpenFunding IT Hub
                        </h1>
                        <p class="text-xs text-gray-600 mt-0.5">프로젝트가 자본을 만나는 곳</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Hero Section - Mobile Optimized (50% reduced) -->
        <section class="hero-gradient text-white py-3 sm:py-6">
            <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
                <h2 class="text-base sm:text-xl md:text-2xl font-bold mb-1.5 leading-tight">
                    Code your vision,<br>build your future
                </h2>
                <p class="text-xs sm:text-sm md:text-base mb-3 opacity-90">
                    개발자, 전략적 투자자 조달 허브
                </p>
                <div class="flex flex-wrap justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <div class="bg-white/20 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <i class="fas fa-hand-holding-usd mr-0.5 text-xs"></i>투자
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <i class="fas fa-chart-line mr-0.5 text-xs"></i>수익분배
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap">
                        <i class="fas fa-coins mr-0.5 text-xs"></i>창업희망
                    </div>
                </div>
            </div>
        </section>

        <!-- Announcements Section -->
        <section class="bg-yellow-50 border-b border-yellow-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <i class="fas fa-bullhorn text-yellow-600 mr-2"></i>공지
                </h3>
                <div id="announcementsContainer" class="space-y-3">
                    <!-- Announcements will be loaded here -->
                </div>
                <div id="announcementsEmpty" class="hidden text-center text-gray-500 text-sm py-4">
                    등록된 공지가 없습니다
                </div>
            </div>
        </section>

        <!-- News Section -->
        <section class="bg-blue-50 border-b border-blue-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <i class="fas fa-newspaper text-blue-600 mr-2"></i>참고뉴스
                </h3>
                <div id="newsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- News will be loaded here -->
                </div>
                <div id="newsEmpty" class="hidden text-center text-gray-500 text-sm py-4">
                    등록된 참고뉴스가 없습니다
                </div>
            </div>
        </section>

        <!-- Filter Section -->
        <section class="bg-white border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div class="flex flex-wrap gap-2 items-center text-xs sm:text-sm">
                    <div class="flex items-center gap-1">
                        <label class="font-medium text-gray-700">자금:</label>
                        <select id="filterFunding" class="border border-gray-300 rounded-lg px-2 py-1 text-xs">
                            <option value="">전체</option>
                            <option value="투자">투자</option>
                            <option value="수익분배">수익분배</option>
                            <option value="창업희망">창업희망</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-1">
                        <label class="font-medium text-gray-700">정렬:</label>
                        <select id="sortBy" class="border border-gray-300 rounded-lg px-2 py-1 text-xs">
                            <option value="latest">최신순</option>
                            <option value="amount_desc">금액↓</option>
                            <option value="amount_asc">금액↑</option>
                            <option value="views">조회수</option>
                        </select>
                    </div>
                    <div class="flex-1 min-w-0">
                        <input type="text" id="searchInput" placeholder="검색..." 
                               class="border border-gray-300 rounded-lg px-2 py-1 w-full text-xs">
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div id="projectsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Projects will be loaded here -->
            </div>
            <div id="loadingIndicator" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-3xl text-purple-600"></i>
                <p class="mt-3 text-gray-600 text-sm">프로젝트를 불러오는 중...</p>
            </div>
            <div id="emptyState" class="hidden text-center py-8">
                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                <p class="text-base text-gray-600">등록된 프로젝트가 없습니다</p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-4 mt-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-sm font-semibold mb-1">프로젝트가 자본을 만나는 곳</p>
                <p class="text-xs text-gray-400">© 2024 OpenFunding IT Hub. All rights reserved.</p>
            </div>
        </footer>
        </div>

        <!-- Admin Content Container -->
        <div id="adminContent" style="display:none;"></div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          const STORAGE_KEY = 'iqherb_projects';
          const ANNOUNCEMENTS_KEY = 'iqherb_announcements';
          const NEWS_KEY = 'iqherb_news';
          const MAX_PROJECTS = 20; // 최대 20개까지만 보관
          
          // QuotaExceededError 방지용 래퍼 함수
          function safeSetItem(key, value) {
            try {
              localStorage.setItem(key, value);
              return true;
            } catch (e) {
              const isQuota =
                e && (
                  e.name === 'QuotaExceededError' ||
                  e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
                  e.code === 22 ||                           // Chrome, Edge
                  e.code === 1014                            // Firefox
                );

              if (isQuota) {
                alert(
                  '⚠️ 브라우저 저장공간이 가득 찼습니다.\\n\\n' +
                  '이전 프로젝트 일부를 삭제한 후 다시 시도해 주세요.\\n\\n' +
                  '또는 "긴급 초기화" 버튼을 클릭하세요.'
                );

                // 해당 키만 삭제
                localStorage.removeItem(key);
                console.warn('⚠️ Storage quota exceeded: ' + key);
              } else {
                console.error('❌ localStorage error:', e);
              }
              return false;
            }
          }
          
          // 페이지 로드 시 localStorage 상태 확인 및 정리
          function initializeStorage() {
            try {
              const data = localStorage.getItem(STORAGE_KEY) || '[]';
              const sizeInMB = (new Blob([data]).size / 1024 / 1024);
              
              console.log(\`💾 현재 저장 공간: \${sizeInMB.toFixed(2)}MB\`);
              
              // 2MB 이상이면 적극적으로 정리
              if (sizeInMB > 2) {
                console.warn(\`⚠️ localStorage 용량 초과: \${sizeInMB.toFixed(2)}MB - 자동 정리 중...\`);
                const parsed = JSON.parse(data);
                
                // 최근 3개만 유지 (더 적극적)
                if (parsed.length > 3) {
                  const recent = parsed.slice(-3);
                  safeSetItem(STORAGE_KEY, JSON.stringify(recent));
                  console.log(\`✅ 최근 3개 프로젝트만 유지 (\${parsed.length}개 → 3개)\`);
                  alert(\`🔔 알림\\n\\n저장 공간 확보를 위해 오래된 프로젝트가 자동 삭제되었습니다.\\n\\n남은 프로젝트: 최근 3개\`);
                  return recent;
                }
              }
              
              return JSON.parse(data);
            } catch (e) {
              console.error('Storage initialization error:', e);
              localStorage.clear();
              return [];
            }
          }
          
          let projects = initializeStorage();
          let editing = null;

          // localStorage 데이터를 API로 동기화 (중복 방지)
          let syncInProgress = false;
          let lastSyncTime = 0;
          
          async function syncToAPI() {
            if (projects.length === 0) {
              console.log('ℹ️ No projects to sync');
              return;
            }
            
            // 중복 실행 방지 (10초 이내 재실행 차단)
            const now = Date.now();
            if (syncInProgress || (now - lastSyncTime < 10000)) {
              console.log('⏭️ Sync skipped (already running or too soon)');
              return;
            }
            
            syncInProgress = true;
            lastSyncTime = now;
            
            try {
              console.log('🔄 Syncing', projects.length, 'projects to API...');
              
              let successCount = 0;
              let skipCount = 0;
              
              for (const project of projects) {
                try {
                  await axios.post('/api/projects', project);
                  successCount++;
                  console.log('✅', project.title);
                } catch (error) {
                  skipCount++;
                  // 이미 존재하는 경우 무시
                  if (error.response?.status === 409 || error.response?.status === 500) {
                    console.log('⏭️ Skipped (already exists):', project.title);
                  } else {
                    console.warn('⚠️ Failed:', project.title);
                  }
                }
              }
              
              console.log(\`✅ Sync complete! Success: \${successCount}, Skipped: \${skipCount}\`);
            } catch (error) {
              console.error('❌ Sync error:', error);
            } finally {
              syncInProgress = false;
            }
          }

          function loadPage() {
            const hash = window.location.hash;
            if (hash === '#/admin' || hash === '#admin') {
              showAdminPage();
              // 관리자 페이지 로드 시 자동 동기화
              syncToAPI();
            } else {
              showMainPage();
            }
          }
          
          function showMainPage() {
            document.getElementById('mainContent').style.display = 'block';
            document.getElementById('adminContent').style.display = 'none';
            loadProjects();
          }
          
          function showAdminPage() {
            document.getElementById('mainContent').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            renderAdminPanel();
          }

          function getStorageInfo() {
            try {
              const data = localStorage.getItem(STORAGE_KEY) || '[]';
              const sizeInMB = (new Blob([data]).size / 1024 / 1024).toFixed(2);
              const percentage = ((new Blob([data]).size / (5 * 1024 * 1024)) * 100).toFixed(1);
              return { sizeInMB, percentage, projects: JSON.parse(data).length };
            } catch (e) {
              return { sizeInMB: '0', percentage: '0', projects: 0 };
            }
          }

          function clearStorage() {
            if (confirm('⚠️ 모든 프로젝트 데이터가 삭제됩니다. 계속하시겠습니까?\\n\\n(백업하지 않은 데이터는 복구할 수 없습니다)')) {
              try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.clear(); // 전체 localStorage 초기화
                projects = [];
                alert('✅ 저장 공간이 완전히 초기화되었습니다.\\n\\n이제 새 프로젝트를 등록할 수 있습니다.');
                location.reload(); // 페이지 새로고침
              } catch (e) {
                alert('❌ 초기화 중 오류가 발생했습니다. 브라우저를 새로고침해주세요.');
              }
            }
          }
          
          function emergencyClear() {
            // 긴급 초기화 (확인 없이)
            try {
              localStorage.clear();
              projects = [];
              alert('🚨 긴급 초기화 완료!\\n\\n페이지를 새로고침합니다.');
              location.reload();
            } catch (e) {
              alert('오류 발생. 브라우저 설정에서 캐시를 삭제해주세요.');
            }
          }

          function exportData() {
            try {
              const data = JSON.stringify(projects, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = \`iqherb-projects-\${new Date().toISOString().split('T')[0]}.json\`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              alert('✅ 데이터를 성공적으로 내보냈습니다!\\n\\n다운로드한 파일을 다른 기기에서 가져올 수 있습니다.');
            } catch (e) {
              console.error('Export error:', e);
              alert('❌ 내보내기 실패: ' + e.message);
            }
          }

          function importData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
              try {
                const imported = JSON.parse(e.target.result);
                
                if (!Array.isArray(imported)) {
                  throw new Error('올바른 형식이 아닙니다.');
                }

                // 기존 데이터와 병합 (중복 제거)
                const existingIds = new Set(projects.map(p => p.id));
                const newProjects = imported.filter(p => !existingIds.has(p.id));
                
                projects = [...projects, ...newProjects];
                
                safeSetItem(STORAGE_KEY, JSON.stringify(projects));
                alert(\`✅ 데이터를 성공적으로 가져왔습니다!\\n\\n새로 추가된 프로젝트: \${newProjects.length}개\\n기존 프로젝트: \${projects.length - newProjects.length}개\`);
                renderAdminPanel();
              } catch (e) {
                console.error('Import error:', e);
                alert('❌ 가져오기 실패: ' + e.message + '\\n\\n올바른 JSON 파일인지 확인해주세요.');
              }
            };
            reader.readAsText(file);
            
            // 파일 선택 초기화
            event.target.value = '';
          }

          function renderAdminPanel() {
            const storageInfo = getStorageInfo();
            const storageColor = storageInfo.percentage > 80 ? 'text-red-600' : storageInfo.percentage > 50 ? 'text-orange-600' : 'text-green-600';
            const showWarning = storageInfo.percentage > 70;
            
            document.getElementById('adminContent').innerHTML = \`
              \${showWarning ? \`
              <div class="bg-red-600 text-white py-4 px-6">
                <div class="max-w-7xl mx-auto flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <i class="fas fa-exclamation-triangle text-3xl"></i>
                    <div>
                      <div class="font-bold text-lg">⚠️ 저장 공간 부족! (\${storageInfo.percentage}% 사용 중)</div>
                      <div class="text-sm">새 프로젝트 등록 전에 반드시 공간을 확보하세요!</div>
                    </div>
                  </div>
                  <button onclick="clearStorage()" class="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 text-lg">
                    <i class="fas fa-trash mr-2"></i>지금 초기화
                  </button>
                </div>
              </div>
              \` : ''}
              <header class="bg-white shadow p-4">
                <div class="max-w-7xl mx-auto">
                  <div class="flex justify-between items-center mb-3">
                    <h1 class="text-2xl font-bold"><i class="fas fa-cog text-purple-600 mr-2"></i>관리자 페이지</h1>
                    <a href="/" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                      <i class="fas fa-home mr-2"></i>메인
                    </a>
                  </div>
                  
                  <!-- Tabs -->
                  <div class="flex gap-2 border-b mb-4">
                    <button id="tabProjects" onclick="switchTab('projects')" class="px-4 py-2 font-medium border-b-2 border-purple-600 text-purple-600">
                      <i class="fas fa-folder mr-2"></i>프로젝트
                    </button>
                    <button id="tabAnnouncements" onclick="switchTab('announcements')" class="px-4 py-2 font-medium text-gray-600 hover:text-purple-600">
                      <i class="fas fa-bullhorn mr-2"></i>공지
                    </button>
                    <button id="tabNews" onclick="switchTab('news')" class="px-4 py-2 font-medium text-gray-600 hover:text-purple-600">
                      <i class="fas fa-newspaper mr-2"></i>참고뉴스
                    </button>
                  </div>
                  
                  <!-- Projects Tab Content -->
                  <div id="projectsTab">
                    <div class="flex gap-2 flex-wrap mb-3">
                      <button onclick="showForm()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <i class="fas fa-plus mr-2"></i>새 프로젝트
                      </button>
                      <button onclick="exportData()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" title="데이터 내보내기">
                        <i class="fas fa-download mr-2"></i>내보내기
                      </button>
                      <button onclick="document.getElementById('importFile').click()" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" title="데이터 가져오기">
                        <i class="fas fa-upload mr-2"></i>가져오기
                      </button>
                      <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(event)">
                      <button onclick="clearStorage()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" title="확인 후 삭제">
                        <i class="fas fa-trash mr-2"></i>전체 삭제
                      </button>
                    </div>
                  <div class="flex items-center gap-4 text-sm">
                    <span class="font-medium">저장 공간:</span>
                    <span class="\${storageColor} font-bold">
                      <i class="fas fa-database mr-1"></i>\${storageInfo.sizeInMB}MB / 5MB (\${storageInfo.percentage}%)
                    </span>
                    <span class="text-gray-600">프로젝트: \${storageInfo.projects}개</span>
                    \${storageInfo.percentage > 70 ? '<span class="text-red-600"><i class="fas fa-exclamation-triangle mr-1"></i>저장 공간 부족</span>' : ''}
                  </div>
                </div>
              </header>
              <div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50" onclick="if(event.target===this) closeForm()">
                <div class="min-h-screen px-4 py-8 flex items-center justify-center">
                  <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b flex justify-between items-center">
                      <h2 class="text-2xl font-bold" id="formTitle">새 프로젝트</h2>
                      <button onclick="closeForm()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                      </button>
                    </div>
                    <form id="form" class="p-6 space-y-4" onsubmit="save(event)">
                      <div><label class="block text-sm font-medium mb-2">프로젝트명 *</label>
                      <input name="title" required class="w-full border rounded px-4 py-2"></div>
                      <div><label class="block text-sm font-medium mb-2">한줄 소개</label>
                      <textarea name="description" rows="2" class="w-full border rounded px-4 py-2"></textarea></div>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium mb-2">카테고리 *</label>
                        <select name="category" required class="w-full border rounded px-4 py-2">
                          <option value="">선택</option><option value="앱">앱</option><option value="웹플랫폼">웹플랫폼</option>
                          <option value="O2O">O2O</option><option value="게임">게임</option><option value="기타">기타</option>
                        </select></div>
                        <div><label class="block text-sm font-medium mb-2">자금 방식 *</label>
                        <select name="funding_type" required class="w-full border rounded px-4 py-2">
                          <option value="">선택</option><option value="투자">투자</option>
                          <option value="수익분배">수익분배</option><option value="창업희망">창업희망</option>
                        </select></div>
                        <div><label class="block text-sm font-medium mb-2">희망 금액 (만원) *</label>
                        <input type="number" name="amount" required min="0" step="100" class="w-full border rounded px-4 py-2"></div>
                      </div>
                      
                      <div><label class="block text-sm font-medium mb-2">유튜브 링크</label>
                      <input type="url" name="youtube_link" placeholder="https://youtube.com/watch?v=..." class="w-full border rounded px-4 py-2"></div>
                      
                      <div><label class="block text-sm font-medium mb-2">텍스트 정보</label>
                      <textarea name="text_info" rows="5" placeholder="프로젝트에 대한 상세 설명을 입력하세요..." class="w-full border rounded px-4 py-2"></textarea></div>
                      
                      <div class="flex gap-3 justify-end pt-4 border-t">
                        <button type="button" onclick="closeForm()" class="px-6 py-2 border rounded">취소</button>
                        <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                          <i class="fas fa-save mr-2"></i>저장
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <main class="max-w-7xl mx-auto px-4 py-8" id="projectsContent">
                <div class="bg-white rounded-xl shadow">
                  <div class="p-6 border-b"><h3 class="text-xl font-bold">등록된 프로젝트 (\${projects.length}개)</h3></div>
                  <div id="list">\${projects.length ? projects.map(p => \`
                    <div class="p-6 border-b hover:bg-gray-50">
                      <div class="flex justify-between">
                        <div class="flex-1">
                          <h4 class="text-lg font-bold mb-2">\${p.title}</h4>
                          <p class="text-gray-600 text-sm mb-3">\${p.description || ''}</p>
                          <div class="flex gap-2 text-sm">
                            <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">\${p.funding_type}</span>
                            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold">\${(p.amount||0).toLocaleString()}만원</span>
                          </div>
                        </div>
                        <div class="flex gap-2 ml-4">
                          <button onclick="edit(\${p.id})" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><i class="fas fa-edit"></i></button>
                          <button onclick="del(\${p.id})" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  \`).join('') : '<div class="p-12 text-center text-gray-500"><i class="fas fa-inbox text-6xl mb-4"></i><p>등록된 프로젝트가 없습니다</p></div>'}</div>
                </div>
              </main>
              </div>
              
              <!-- Announcements Tab Content -->
              <div id="announcementsTab" style="display:none;">
                <div class="flex gap-2 flex-wrap mb-3">
                  <button onclick="showAnnouncementForm()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    <i class="fas fa-plus mr-2"></i>새 공지
                  </button>
                </div>
                <main class="max-w-7xl mx-auto px-4 py-8" id="announcementsContent">
                  <!-- Announcements will be loaded here -->
                </main>
              </div>
              
              <!-- News Tab Content -->
              <div id="newsTab" style="display:none;">
                <div class="flex gap-2 flex-wrap mb-3">
                  <button onclick="showNewsForm()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    <i class="fas fa-plus mr-2"></i>새 참고뉴스
                  </button>
                </div>
                <main class="max-w-7xl mx-auto px-4 py-8" id="newsContent">
                  <!-- News will be loaded here -->
                </main>
              </div>
              
              </div>
            </header>
            \`;
          }

          function renderMainPage() {
            loadProjects();
            loadAnnouncementsMain();
            loadNewsMain();
          }

          function showForm() {
            editing = null;
            const formTitle = document.getElementById('formTitle');
            const form = document.getElementById('form');
            const modal = document.getElementById('modal');
            
            if (formTitle) formTitle.textContent = '새 프로젝트';
            if (form) form.reset();
            if (modal) modal.classList.remove('hidden');
          }

          function closeForm() {
            const modal = document.getElementById('modal');
            if (modal) modal.classList.add('hidden');
            editing = null;
          }
          
          function getYouTubeVideoId(url) {
            if (!url) return null;
            
            // YouTube URL 패턴들
            const patterns = [
              /(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\s?]+)/,  // watch?v= or youtu.be/
              /youtube\\.com\\/embed\\/([^&\\s?]+)/,                       // embed/
              /youtube\\.com\\/v\\/([^&\\s?]+)/,                           // v/
              /youtube\\.com\\/shorts\\/([^&\\s?]+)/                       // shorts/
            ];
            
            for (const pattern of patterns) {
              const match = url.match(pattern);
              if (match && match[1]) {
                // 11자리 YouTube ID만 반환
                return match[1].substring(0, 11);
              }
            }
            
            return null;
          }

          async function save(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            
            try {
              if (editing) {
                // 수정 모드
                const idx = projects.findIndex(p => p.id === editing.id);
                projects[idx] = {...editing, ...data};
                
                // API에 수정 요청 (선택적)
                try {
                  await axios.put(\`/api/projects/\${editing.id}\`, data);
                } catch (apiError) {
                  console.warn('API 수정 실패, localStorage만 사용:', apiError);
                }
              } else {
                // 새 프로젝트
                data.id = Date.now();
                data.created_at = new Date().toISOString();
                
                // API에 생성 요청 시도
                try {
                  const response = await axios.post('/api/projects', data);
                  if (response.data && response.data.success && response.data.data && response.data.data.id) {
                    // API에서 생성된 ID 사용
                    data.id = response.data.data.id;
                  }
                } catch (apiError) {
                  console.warn('API 생성 실패, localStorage만 사용:', apiError);
                }
                
                projects.push(data);
              }
              
              // localStorage에 저장
              safeSetItem(STORAGE_KEY, JSON.stringify(projects));
              alert(editing ? '✅ 수정되었습니다' : '✅ 추가되었습니다');
              closeForm();
              renderAdminPanel();
            } catch (error) {
              console.error('❌ 저장 오류:', error);
              alert('❌ 저장 오류: ' + error.message);
            }
          }

          function edit(id) {
            editing = projects.find(p => p.id === id);
            const formTitle = document.getElementById('formTitle');
            const form = document.getElementById('form');
            const modal = document.getElementById('modal');
            
            if (formTitle) formTitle.textContent = '프로젝트 수정';
            if (form) {
              Object.keys(editing).forEach(k => {
                if (form.elements[k]) form.elements[k].value = editing[k] || '';
              });
            }
            
            if (modal) modal.classList.remove('hidden');
          }

          async function del(id) {
            if (!confirm('삭제하시겠습니까?')) return;
            
            try {
              // API에 삭제 요청 (선택적)
              try {
                await axios.delete(\`/api/projects/\${id}\`);
              } catch (apiError) {
                console.warn('API 삭제 실패, localStorage만 사용:', apiError);
              }
              
              // localStorage에서 삭제
              projects = projects.filter(p => p.id !== id);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
              alert('삭제되었습니다');
              renderAdminPanel();
            } catch (error) {
              console.error('삭제 오류:', error);
              alert('삭제 중 오류가 발생했습니다');
            }
          }

          async function loadProjects() {
            const container = document.getElementById('projectsContainer');
            const loading = document.getElementById('loadingIndicator');
            const empty = document.getElementById('emptyState');

            try {
              // 1. localStorage에서 먼저 로드 (즉시 표시)
              const storedProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
              console.log('📦 localStorage에서', storedProjects.length, '개 프로젝트 로드');
              
              // 2. localStorage 데이터가 있으면 즉시 표시
              if (storedProjects.length > 0) {
                projects = storedProjects;
              }
              
              // 3. API에서 최신 데이터 가져오기 시도 (백그라운드)
              try {
                const response = await axios.get('/api/projects');
                if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
                  console.log('🌐 API에서', response.data.data.length, '개 프로젝트 로드');
                  
                  // API 데이터로 업데이트
                  projects = response.data.data;
                  safeSetItem(STORAGE_KEY, JSON.stringify(projects));
                }
              } catch (apiError) {
                console.log('ℹ️ API 호출 실패, localStorage 데이터 사용');
              }
              
              // 4. 최종 데이터 결정
              const finalProjects = projects;
              
              loading.style.display = 'none';
              
              if (finalProjects.length === 0) {
                empty.classList.remove('hidden');
                return;
              }

              container.innerHTML = finalProjects.map(project => {
                const youtubeId = getYouTubeVideoId(project.youtube_link);
                
                return \`
                <div class="bg-white rounded-lg shadow card-hover overflow-hidden cursor-pointer" onclick="showProjectDetail(\${project.id})">
                  <div class="p-3">
                    <h3 class="text-sm font-bold text-gray-900 mb-2 line-clamp-1">\${project.title}</h3>
                    <p class="text-xs text-gray-600 mb-2 line-clamp-2">\${project.description || ''}</p>
                    <div class="flex flex-wrap gap-1.5">
                      <span class="badge badge-\${project.funding_type === '투자' ? 'investment' : project.funding_type === '수익분배' ? 'revenue' : 'loan'}" style="display: flex; align-items: center; justify-content: center; font-size: 0.65rem; padding: 0.2rem 0.5rem;">
                        <i class="fas fa-tag mr-1"></i>\${project.funding_type}
                      </span>
                      <span class="amount-tag" style="display: flex; align-items: center; justify-content: center; font-size: 0.65rem; padding: 0.3rem 0.6rem;">
                        <i class="fas fa-won-sign mr-1"></i>\${(project.amount || 0).toLocaleString()}만원
                      </span>
                      \${youtubeId ? '<span class="badge" style="background:#FF0000; color:white; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; padding: 0.2rem 0.5rem;"><i class="fab fa-youtube mr-1"></i>영상</span>' : ''}
                    </div>
                  </div>
                </div>
              \`;
              }).join('');
            } catch (error) {
              console.error('Error loading projects:', error);
              loading.style.display = 'none';
              empty.classList.remove('hidden');
            }
          }

          function showProjectDetail(id) {
            const project = projects.find(p => p.id === id);
            if (!project) return;
            
            const youtubeId = getYouTubeVideoId(project.youtube_link);
            
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            
            modal.innerHTML = \`
              <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b flex justify-between items-center">
                  <h2 class="text-2xl font-bold">\${project.title}</h2>
                  <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-2xl"></i>
                  </button>
                </div>
                <div class="p-6">
                  \${youtubeId ? \`
                    <div class="mb-6">
                      <h3 class="text-lg font-bold mb-2"><i class="fab fa-youtube text-red-600 mr-2"></i>클릭하시면 설명 영상 보입니다</h3>
                      <div class="mb-4 max-w-[59%] mx-auto">
                        <img src="https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg" 
                          alt="YouTube 썸네일" 
                          class="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                          onclick="this.style.display='none'; this.nextElementSibling.style.display='block';"
                          onerror="this.onerror=null; this.src='https://img.youtube.com/vi/\${youtubeId}/default.jpg';"
                          loading="lazy">
                        <div class="relative pb-[56.25%] h-0" style="display:none;">
                          <iframe src="https://www.youtube.com/embed/\${youtubeId}?autoplay=1" 
                            class="absolute top-0 left-0 w-full h-full rounded-lg"
                            frameborder="0" allowfullscreen allow="autoplay"></iframe>
                        </div>
                      </div>
                    </div>
                  \` : ''}
                  
                  <div class="mb-4">
                    <h3 class="text-lg font-bold mb-2">프로젝트 내용</h3>
                    <p class="text-gray-600 whitespace-pre-wrap">\${project.text_info || project.description || '프로젝트 내용이 없습니다.'}</p>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="badge badge-\${project.funding_type === '투자' ? 'investment' : project.funding_type === '수익분배' ? 'revenue' : 'loan'}" style="display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-tag mr-1"></i>\${project.funding_type}
                    </span>
                    <span class="amount-tag" style="display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-won-sign mr-1"></i>\${(project.amount || 0).toLocaleString()}만원
                    </span>
                  </div>
                </div>
              </div>
            \`;
            
            document.body.appendChild(modal);
          }
          
          // ============================================
          // Tab Switching
          // ============================================
          function switchTab(tab) {
            // Hide all tabs
            document.getElementById('projectsTab').style.display = 'none';
            document.getElementById('announcementsTab').style.display = 'none';
            document.getElementById('newsTab').style.display = 'none';
            
            // Remove active state from all tab buttons
            document.getElementById('tabProjects').className = 'px-4 py-2 font-medium text-gray-600 hover:text-purple-600';
            document.getElementById('tabAnnouncements').className = 'px-4 py-2 font-medium text-gray-600 hover:text-purple-600';
            document.getElementById('tabNews').className = 'px-4 py-2 font-medium text-gray-600 hover:text-purple-600';
            
            // Show selected tab
            if (tab === 'projects') {
              document.getElementById('projectsTab').style.display = 'block';
              document.getElementById('tabProjects').className = 'px-4 py-2 font-medium border-b-2 border-purple-600 text-purple-600';
            } else if (tab === 'announcements') {
              document.getElementById('announcementsTab').style.display = 'block';
              document.getElementById('tabAnnouncements').className = 'px-4 py-2 font-medium border-b-2 border-purple-600 text-purple-600';
              loadAnnouncements();
            } else if (tab === 'news') {
              document.getElementById('newsTab').style.display = 'block';
              document.getElementById('tabNews').className = 'px-4 py-2 font-medium border-b-2 border-purple-600 text-purple-600';
              loadNews();
            }
          }
          
          // ============================================
          // Announcements Functions
          // ============================================
          let editingAnnouncement = null;
          
          async function loadAnnouncements() {
            try {
              // localStorage에서 공지 로드
              const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
              
              const content = document.getElementById('announcementsContent');
              if (announcements.length === 0) {
                content.innerHTML = '<div class="bg-white rounded-xl shadow p-12 text-center text-gray-500"><i class="fas fa-inbox text-6xl mb-4"></i><p>등록된 공지가 없습니다</p></div>';
                return;
              }
              
              content.innerHTML = \`
                <div class="bg-white rounded-xl shadow">
                  <div class="p-6 border-b"><h3 class="text-xl font-bold">등록된 공지 (\${announcements.length}개)</h3></div>
                  <div>\${announcements.map(a => \`
                    <div class="p-6 border-b hover:bg-gray-50">
                      <div class="flex justify-between">
                        <div class="flex-1">
                          <h4 class="text-lg font-bold mb-2">\${a.title}</h4>
                          <p class="text-gray-600 text-sm mb-3 whitespace-pre-wrap">\${a.content || ''}</p>
                          \${a.image_url ? \`<img src="\${a.image_url}" alt="\${a.title}" class="max-w-md rounded mt-3" />\` : ''}
                        </div>
                        <div class="flex gap-2 ml-4">
                          <button onclick="editAnnouncement(\${a.id})" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><i class="fas fa-edit"></i></button>
                          <button onclick="deleteAnnouncement(\${a.id})" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  \`).join('')}</div>
                </div>
              \`;
            } catch (error) {
              console.error('공지 로드 실패:', error);
            }
          }
          
          function showAnnouncementForm() {
            editingAnnouncement = null;
            const html = \`
              <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onclick="if(event.target===this) closeAnnouncementForm()">
                <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div class="p-6 border-b flex justify-between items-center">
                    <h2 class="text-2xl font-bold">새 공지</h2>
                    <button onclick="closeAnnouncementForm()" class="text-gray-500 hover:text-gray-700">
                      <i class="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                  <form onsubmit="saveAnnouncement(event)" class="p-6 space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">제목 *</label>
                      <input name="title" required class="w-full border rounded px-4 py-2" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">내용 *</label>
                      <textarea name="content" required rows="6" class="w-full border rounded px-4 py-2"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">이미지 URL</label>
                      <input type="url" name="image_url" class="w-full border rounded px-4 py-2" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="flex gap-3 justify-end pt-4 border-t">
                      <button type="button" onclick="closeAnnouncementForm()" class="px-6 py-2 border rounded">취소</button>
                      <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                        <i class="fas fa-save mr-2"></i>저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            \`;
            document.body.insertAdjacentHTML('beforeend', html);
          }
          
          async function editAnnouncement(id) {
            try {
              const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
              editingAnnouncement = announcements.find(a => a.id === id);
              
              const html = \`
                <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onclick="if(event.target===this) closeAnnouncementForm()">
                  <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b flex justify-between items-center">
                      <h2 class="text-2xl font-bold">공지 수정</h2>
                      <button onclick="closeAnnouncementForm()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                      </button>
                    </div>
                    <form onsubmit="saveAnnouncement(event)" class="p-6 space-y-4">
                      <div>
                        <label class="block text-sm font-medium mb-2">제목 *</label>
                        <input name="title" required value="\${editingAnnouncement.title}" class="w-full border rounded px-4 py-2" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">내용 *</label>
                        <textarea name="content" required rows="6" class="w-full border rounded px-4 py-2">\${editingAnnouncement.content || ''}</textarea>
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">이미지 URL</label>
                        <input type="url" name="image_url" value="\${editingAnnouncement.image_url || ''}" class="w-full border rounded px-4 py-2" placeholder="https://example.com/image.jpg" />
                      </div>
                      <div class="flex gap-3 justify-end pt-4 border-t">
                        <button type="button" onclick="closeAnnouncementForm()" class="px-6 py-2 border rounded">취소</button>
                        <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                          <i class="fas fa-save mr-2"></i>저장
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              \`;
              document.body.insertAdjacentHTML('beforeend', html);
            } catch (error) {
              alert('공지 로드 실패');
            }
          }
          
          async function saveAnnouncement(event) {
            event.preventDefault();
            const form = event.target;
            
            try {
              const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
              
              if (editingAnnouncement) {
                // 수정
                const index = announcements.findIndex(a => a.id === editingAnnouncement.id);
                if (index !== -1) {
                  announcements[index] = {
                    ...announcements[index],
                    title: form.title.value,
                    content: form.content.value,
                    image_url: form.image_url.value,
                    updated_at: new Date().toISOString()
                  };
                }
                alert('공지가 수정되었습니다');
              } else {
                // 새로 등록
                const newAnnouncement = {
                  id: Date.now(),
                  title: form.title.value,
                  content: form.content.value,
                  image_url: form.image_url.value,
                  status: 'active',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                announcements.push(newAnnouncement);
                alert('공지가 등록되었습니다');
              }
              
              localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
              closeAnnouncementForm();
              loadAnnouncements();
              loadAnnouncementsMain();
            } catch (error) {
              alert('저장 실패: ' + error.message);
            }
          }
          
          async function deleteAnnouncement(id) {
            if (!confirm('이 공지를 삭제하시겠습니까?')) return;
            
            try {
              let announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
              announcements = announcements.filter(a => a.id !== id);
              localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
              alert('공지가 삭제되었습니다');
              loadAnnouncements();
              loadAnnouncementsMain();
            } catch (error) {
              alert('삭제 실패: ' + error.message);
            }
          }
          
          function closeAnnouncementForm() {
            const modal = document.querySelector('.fixed.inset-0');
            if (modal) modal.remove();
            editingAnnouncement = null;
          }
          
          // ============================================
          // News Functions
          // ============================================
          let editingNews = null;
          
          async function loadNews() {
            try {
              const newsList = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
              
              const content = document.getElementById('newsContent');
              if (newsList.length === 0) {
                content.innerHTML = '<div class="bg-white rounded-xl shadow p-12 text-center text-gray-500"><i class="fas fa-inbox text-6xl mb-4"></i><p>등록된 참고뉴스가 없습니다</p></div>';
                return;
              }
              
              content.innerHTML = \`
                <div class="bg-white rounded-xl shadow">
                  <div class="p-6 border-b"><h3 class="text-xl font-bold">등록된 참고뉴스 (\${newsList.length}개)</h3></div>
                  <div>\${newsList.map(n => {
                    const youtubeId = getYouTubeVideoId(n.youtube_link);
                    return \`
                    <div class="p-6 border-b hover:bg-gray-50">
                      <div class="flex justify-between">
                        <div class="flex-1">
                          <h4 class="text-lg font-bold mb-2">\${n.title}</h4>
                          <p class="text-gray-600 text-sm mb-3">\${n.description || ''}</p>
                          \${youtubeId ? \`
                            <div class="mt-3">
                              <img src="https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg" 
                                   alt="YouTube 썸네일" 
                                   class="w-48 rounded cursor-pointer hover:opacity-80"
                                   onclick="window.open('https://www.youtube.com/watch?v=\${youtubeId}', '_blank')" />
                            </div>
                          \` : ''}
                        </div>
                        <div class="flex gap-2 ml-4">
                          <button onclick="editNews(\${n.id})" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><i class="fas fa-edit"></i></button>
                          <button onclick="deleteNews(\${n.id})" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"><i class="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                    \`;
                  }).join('')}</div>
                </div>
              \`;
            } catch (error) {
              console.error('참고뉴스 로드 실패:', error);
            }
          }
          
          function showNewsForm() {
            editingNews = null;
            const html = \`
              <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onclick="if(event.target===this) closeNewsForm()">
                <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div class="p-6 border-b flex justify-between items-center">
                    <h2 class="text-2xl font-bold">새 참고뉴스</h2>
                    <button onclick="closeNewsForm()" class="text-gray-500 hover:text-gray-700">
                      <i class="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                  <form onsubmit="saveNews(event)" class="p-6 space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">제목 *</label>
                      <input name="title" required class="w-full border rounded px-4 py-2" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">YouTube 링크 *</label>
                      <input type="url" name="youtube_link" required class="w-full border rounded px-4 py-2" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">설명</label>
                      <textarea name="description" rows="3" class="w-full border rounded px-4 py-2"></textarea>
                    </div>
                    <div class="flex gap-3 justify-end pt-4 border-t">
                      <button type="button" onclick="closeNewsForm()" class="px-6 py-2 border rounded">취소</button>
                      <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                        <i class="fas fa-save mr-2"></i>저장
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            \`;
            document.body.insertAdjacentHTML('beforeend', html);
          }
          
          async function editNews(id) {
            try {
              const newsList = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
              editingNews = newsList.find(n => n.id === id);
              
              const html = \`
                <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onclick="if(event.target===this) closeNewsForm()">
                  <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b flex justify-between items-center">
                      <h2 class="text-2xl font-bold">참고뉴스 수정</h2>
                      <button onclick="closeNewsForm()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-2xl"></i>
                      </button>
                    </div>
                    <form onsubmit="saveNews(event)" class="p-6 space-y-4">
                      <div>
                        <label class="block text-sm font-medium mb-2">제목 *</label>
                        <input name="title" required value="\${editingNews.title}" class="w-full border rounded px-4 py-2" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">YouTube 링크 *</label>
                        <input type="url" name="youtube_link" required value="\${editingNews.youtube_link || ''}" class="w-full border rounded px-4 py-2" placeholder="https://youtube.com/watch?v=..." />
                      </div>
                      <div>
                        <label class="block text-sm font-medium mb-2">설명</label>
                        <textarea name="description" rows="3" class="w-full border rounded px-4 py-2">\${editingNews.description || ''}</textarea>
                      </div>
                      <div class="flex gap-3 justify-end pt-4 border-t">
                        <button type="button" onclick="closeNewsForm()" class="px-6 py-2 border rounded">취소</button>
                        <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                          <i class="fas fa-save mr-2"></i>저장
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              \`;
              document.body.insertAdjacentHTML('beforeend', html);
            } catch (error) {
              alert('참고뉴스 로드 실패');
            }
          }
          
          async function saveNews(event) {
            event.preventDefault();
            const form = event.target;
            
            try {
              const newsList = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
              
              if (editingNews) {
                // 수정
                const index = newsList.findIndex(n => n.id === editingNews.id);
                if (index !== -1) {
                  newsList[index] = {
                    ...newsList[index],
                    title: form.title.value,
                    youtube_link: form.youtube_link.value,
                    description: form.description.value,
                    updated_at: new Date().toISOString()
                  };
                }
                alert('참고뉴스가 수정되었습니다');
              } else {
                // 새로 등록
                const newNews = {
                  id: Date.now(),
                  title: form.title.value,
                  youtube_link: form.youtube_link.value,
                  description: form.description.value,
                  status: 'active',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                newsList.push(newNews);
                alert('참고뉴스가 등록되었습니다');
              }
              
              localStorage.setItem(NEWS_KEY, JSON.stringify(newsList));
              closeNewsForm();
              loadNews();
              loadNewsMain();
            } catch (error) {
              alert('저장 실패: ' + error.message);
            }
          }
          
          async function deleteNews(id) {
            if (!confirm('이 참고뉴스를 삭제하시겠습니까?')) return;
            
            try {
              let newsList = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
              newsList = newsList.filter(n => n.id !== id);
              localStorage.setItem(NEWS_KEY, JSON.stringify(newsList));
              alert('참고뉴스가 삭제되었습니다');
              loadNews();
              loadNewsMain();
            } catch (error) {
              alert('삭제 실패: ' + error.message);
            }
          }
          
          function closeNewsForm() {
            const modal = document.querySelector('.fixed.inset-0');
            if (modal) modal.remove();
            editingNews = null;
          }
          
          // ============================================
          // Main Page Loading Functions
          // ============================================
          async function loadAnnouncementsMain() {
            try {
              const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
              
              const container = document.getElementById('announcementsContainer');
              const empty = document.getElementById('announcementsEmpty');
              
              if (announcements.length === 0) {
                container.innerHTML = '';
                empty.classList.remove('hidden');
                return;
              }
              
              empty.classList.add('hidden');
              container.innerHTML = announcements.map(a => \`
                <div class="bg-white rounded-lg shadow p-4">
                  <h4 class="font-bold text-base mb-2">\${a.title}</h4>
                  <p class="text-sm text-gray-600 whitespace-pre-wrap">\${a.content}</p>
                  \${a.image_url ? \`<img src="\${a.image_url}" alt="\${a.title}" class="mt-3 rounded max-w-full" />\` : ''}
                </div>
              \`).join('');
            } catch (error) {
              console.error('공지 로드 실패:', error);
            }
          }
          
          async function loadNewsMain() {
            try {
              const newsList = JSON.parse(localStorage.getItem(NEWS_KEY) || '[]');
              
              const container = document.getElementById('newsContainer');
              const empty = document.getElementById('newsEmpty');
              
              if (newsList.length === 0) {
                container.innerHTML = '';
                empty.classList.remove('hidden');
                return;
              }
              
              empty.classList.add('hidden');
              container.innerHTML = newsList.map(n => {
                const youtubeId = getYouTubeVideoId(n.youtube_link);
                return \`
                  <div class="bg-white rounded-lg shadow overflow-hidden">
                    \${youtubeId ? \`
                      <div class="relative" style="padding-top: 56.25%;">
                        <img 
                          src="https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg"
                          alt="YouTube 썸네일"
                          loading="lazy"
                          class="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                          onclick="playYouTubeNews('\${youtubeId}', this.parentElement)"
                          onerror="this.src='https://img.youtube.com/vi/\${youtubeId}/default.jpg'; this.onerror=null;"
                        />
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-play text-white text-2xl ml-1"></i>
                          </div>
                        </div>
                      </div>
                    \` : ''}
                    <div class="p-4">
                      <h4 class="font-bold text-sm mb-1">\${n.title}</h4>
                      <p class="text-xs text-gray-600">\${n.description || ''}</p>
                    </div>
                  </div>
                \`;
              }).join('');
            } catch (error) {
              console.error('참고뉴스 로드 실패:', error);
            }
          }
          
          function playYouTubeNews(videoId, container) {
            container.innerHTML = \`
              <iframe
                src="https://www.youtube.com/embed/\${videoId}?autoplay=1"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="absolute top-0 left-0 w-full h-full"
              ></iframe>
            \`;
          }
          
          window.addEventListener('hashchange', loadPage);
          window.addEventListener('load', loadPage);
        </script>
    </body>
    </html>
  `)
})

// Admin page direct route
app.get('/admin.html', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>관리자 페이지 - OpenFunding IT Hub</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body { font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
        </style>
    </head>
    <body class="bg-gray-100">
        <div id="adminApp"></div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/admin.js"></script>
    </body>
    </html>
  `)
})

export default app
