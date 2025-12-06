import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

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
    // Check if DB is available
    if (!c.env.DB) {
      return c.json({ 
        success: true, 
        data: [],
        message: 'Database not configured. Please add projects through the admin panel after connecting D1.'
      })
    }
    
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC'
    ).bind('active').all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    console.error('DB error:', error)
    return c.json({ success: true, data: [], message: 'Database connection issue' })
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
    if (!c.env.DB) {
      return c.json({ success: false, error: 'Database not configured. Please use localStorage mode.' }, 200)
    }
    
    const body = await c.req.json()
    
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
  } catch (error) {
    console.error('Create project error:', error)
    return c.json({ success: false, error: 'Database error. Please use localStorage mode.', useLocalStorage: true }, 200)
  }
})

// Update project
app.put('/api/projects/:id', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, error: 'Database not configured' }, 500)
    }
    
    const id = c.req.param('id')
    const body = await c.req.json()
    
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
  } catch (error) {
    console.error('Update project error:', error)
    return c.json({ success: false, error: 'Failed to update project' }, 500)
  }
})

// Delete project
app.delete('/api/projects/:id', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, error: 'Database not configured' }, 500)
    }
    
    const id = c.req.param('id')
    
    await c.env.DB.prepare(
      'DELETE FROM projects WHERE id = ?'
    ).bind(id).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return c.json({ success: false, error: 'Failed to delete project' }, 500)
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

        <!-- Hero Section -->
        <section class="hero-gradient text-white py-8 sm:py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                    Code your vision,<br>build your future
                </h2>
                <p class="text-base sm:text-lg md:text-xl mb-6 opacity-90">
                    개발자, 전략적 투자자 조달 허브
                </p>
                <div class="flex flex-wrap justify-center gap-3 text-sm sm:text-base">
                    <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full whitespace-nowrap">
                        <i class="fas fa-hand-holding-usd mr-1"></i>투자
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full whitespace-nowrap">
                        <i class="fas fa-chart-line mr-1"></i>수익분배
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full whitespace-nowrap">
                        <i class="fas fa-coins mr-1"></i>대출희망
                    </div>
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
                            <option value="대출희망">대출희망</option>
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

          function loadPage() {
            const hash = window.location.hash;
            if (hash === '#/admin' || hash === '#admin') {
              showAdminPage();
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
                    <h1 class="text-2xl font-bold"><i class="fas fa-cog text-purple-600 mr-2"></i>프로젝트 관리</h1>
                    <div class="flex gap-2">
                      <button onclick="showForm()" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <i class="fas fa-plus mr-2"></i>새 프로젝트
                      </button>
                      <button onclick="clearStorage()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" title="확인 후 삭제">
                        <i class="fas fa-trash mr-2"></i>전체 삭제
                      </button>
                      <button onclick="emergencyClear()" class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-bold" title="즉시 초기화">
                        <i class="fas fa-bolt mr-2"></i>긴급 초기화
                      </button>
                      <a href="/" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                        <i class="fas fa-home mr-2"></i>메인
                      </a>
                    </div>
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
                          <option value="수익분배">수익분배</option><option value="대출희망">대출희망</option>
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
              <main class="max-w-7xl mx-auto px-4 py-8">
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
            \`;
          }

          function renderMainPage() {
            loadProjects();
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
            const match = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\s]+)/);
            return match ? match[1] : null;
          }

          function save(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            
            if (editing) {
              const idx = projects.findIndex(p => p.id === editing.id);
              projects[idx] = {...editing, ...data};
            } else {
              data.id = Date.now();
              data.created_at = new Date().toISOString();
              projects.push(data);
            }
            
            try {
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

          function del(id) {
            if (!confirm('삭제하시겠습니까?')) return;
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            alert('삭제되었습니다');
            renderAdminPanel();
          }

          async function loadProjects() {
            const container = document.getElementById('projectsContainer');
            const loading = document.getElementById('loadingIndicator');
            const empty = document.getElementById('emptyState');

            try {
              const storedProjects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
              
              loading.style.display = 'none';
              
              if (storedProjects.length === 0) {
                empty.classList.remove('hidden');
                return;
              }

              container.innerHTML = storedProjects.map(project => {
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
                      <h3 class="text-lg font-bold mb-2"><i class="fab fa-youtube text-red-600 mr-2"></i>프로젝트 영상</h3>
                      <div class="mb-4">
                        <img src="https://img.youtube.com/vi/\${youtubeId}/maxresdefault.jpg" 
                          alt="YouTube 썸네일" 
                          class="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onclick="this.style.display='none'; this.nextElementSibling.style.display='block';"
                          onerror="this.src='https://img.youtube.com/vi/\${youtubeId}/hqdefault.jpg'">
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
