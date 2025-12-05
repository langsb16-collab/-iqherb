import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// API Routes - Projects CRUD
// ============================================

// Get all projects
app.get('/api/projects', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC'
    ).bind('active').all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch projects' }, 500)
  }
})

// Get single project by ID
app.get('/api/projects/:id', async (c) => {
  try {
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
    return c.json({ success: false, error: 'Failed to fetch project' }, 500)
  }
})

// Create new project
app.post('/api/projects', async (c) => {
  try {
    const body = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO projects (
        title, description, category, funding_type, amount, languages,
        app_link, website_link, youtube_link, other_links,
        thumbnail, images, revenue, users, business_model, team_info,
        contact_name, contact_email, contact_phone, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      body.images || '',
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
    
    await c.env.DB.prepare(`
      UPDATE projects SET
        title = ?, description = ?, category = ?, funding_type = ?, 
        amount = ?, languages = ?, app_link = ?, website_link = ?, 
        youtube_link = ?, other_links = ?, thumbnail = ?, images = ?,
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
      body.images || '',
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
  } catch (error) {
    console.error('Update project error:', error)
    return c.json({ success: false, error: 'Failed to update project' }, 500)
  }
})

// Delete project
app.delete('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    await c.env.DB.prepare(
      'DELETE FROM projects WHERE id = ?'
    ).bind(id).run()
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to delete project' }, 500)
  }
})

// ============================================
// Frontend Routes
// ============================================

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OpenFunding IT Hub - 당신의 아이디어, 이곳에서 투자와 연결됩니다</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          body { font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
          .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
          .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; }
          .badge-investment { background-color: #EF4444; color: white; }
          .badge-revenue { background-color: #10B981; color: white; }
          .badge-loan { background-color: #F59E0B; color: white; }
          .amount-tag { background-color: #FCD34D; color: #92400E; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; }
          .youtube-thumbnail { position: relative; cursor: pointer; }
          .youtube-play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background-color: rgba(255, 0, 0, 0.9); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
          .youtube-play-btn::after { content: ''; width: 0; height: 0; border-style: solid; border-width: 10px 0 10px 17px; border-color: transparent transparent transparent white; margin-left: 3px; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-center items-center">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-gray-900">
                            <i class="fas fa-rocket text-purple-600 mr-2"></i>
                            OpenFunding IT Hub
                        </h1>
                        <p class="text-sm text-gray-600 mt-1">프로젝트가 자본을 만나는 곳</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="hero-gradient text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">
                    당신의 아이디어, 이곳에서 투자와 연결됩니다
                </h2>
                <p class="text-xl md:text-2xl mb-8 opacity-90">
                    개발자·창업자·창작자를 위한 자금 조달 허브
                </p>
                <div class="flex flex-wrap justify-center gap-4 text-lg">
                    <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                        <i class="fas fa-hand-holding-usd mr-2"></i>투자
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                        <i class="fas fa-chart-line mr-2"></i>수익분배
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                        <i class="fas fa-coins mr-2"></i>대출희망
                    </div>
                </div>
            </div>
        </section>

        <!-- Filter Section -->
        <section class="bg-white border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex flex-wrap gap-4 items-center">
                    <div>
                        <label class="text-sm font-medium text-gray-700 mr-2">자금 방식:</label>
                        <select id="filterFunding" class="border border-gray-300 rounded-lg px-4 py-2">
                            <option value="">전체</option>
                            <option value="투자">투자</option>
                            <option value="수익분배">수익분배</option>
                            <option value="대출희망">대출희망</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700 mr-2">정렬:</label>
                        <select id="sortBy" class="border border-gray-300 rounded-lg px-4 py-2">
                            <option value="latest">최신순</option>
                            <option value="amount_desc">금액 높은순</option>
                            <option value="amount_asc">금액 낮은순</option>
                            <option value="views">조회수순</option>
                        </select>
                    </div>
                    <div class="ml-auto">
                        <input type="text" id="searchInput" placeholder="프로젝트 검색..." 
                               class="border border-gray-300 rounded-lg px-4 py-2 w-64">
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div id="projectsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Projects will be loaded here -->
            </div>
            <div id="loadingIndicator" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                <p class="mt-4 text-gray-600">프로젝트를 불러오는 중...</p>
            </div>
            <div id="emptyState" class="hidden text-center py-12">
                <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-xl text-gray-600">등록된 프로젝트가 없습니다</p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-lg font-semibold mb-2">프로젝트가 자본을 만나는 곳</p>
                <p class="text-sm text-gray-400">© 2024 OpenFunding IT Hub. All rights reserved.</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Admin page
app.get('/', (c) => {
  const hash = c.req.header('referer')?.includes('#/admin') || c.req.query('page') === 'admin'
  
  if (hash) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>관리자 페이지 - OpenFunding IT Hub</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100">
          <div id="adminApp"></div>
          <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
          <script src="/static/admin.js"></script>
      </body>
      </html>
    `)
  }
  
  return c.redirect('/')
})

export default app
