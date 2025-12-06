// Admin page JavaScript
let projects = []
let editingProject = null

// Image upload to Base64
function handleImageUpload(inputElement, callback) {
  const file = inputElement.files[0]
  if (!file) return
  
  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('이미지 크기는 2MB 이하여야 합니다')
    inputElement.value = ''
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    callback(e.target.result)
  }
  reader.onerror = () => {
    alert('이미지 업로드에 실패했습니다')
  }
  reader.readAsDataURL(file)
}

// Get YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(url) {
  const videoId = getYouTubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}

// Render admin page
function renderAdminPage() {
  const app = document.getElementById('adminApp')
  
  app.innerHTML = `
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              <i class="fas fa-cog text-purple-600 mr-2"></i>
              관리자 페이지
            </h1>
            <p class="text-sm text-gray-600 mt-1">프로젝트 관리</p>
          </div>
          <div class="flex gap-3">
            <button onclick="showProjectForm()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-plus mr-2"></i>새 프로젝트
            </button>
            <a href="/" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
              <i class="fas fa-home mr-2"></i>메인으로
            </a>
          </div>
        </div>
      </div>
      
      <!-- Database Status Banner -->
      <div id="dbStatusBanner" class="hidden bg-yellow-50 border-b border-yellow-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center">
            <i class="fas fa-info-circle text-yellow-600 mr-3"></i>
            <div class="flex-1">
              <p class="text-sm text-yellow-800">
                <strong>데이터베이스 미연결:</strong> 프로덕션 환경에서 프로젝트를 저장하려면 D1 데이터베이스를 연결해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Project Form Modal -->
    <div id="projectFormModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div class="min-h-screen px-4 py-8">
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl">
          <div class="p-6 border-b flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">
              <span id="formTitle">새 프로젝트 추가</span>
            </h2>
            <button onclick="closeProjectForm()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <form id="projectForm" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 프로젝트명 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">프로젝트명 *</label>
                <input type="text" name="title" required 
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <!-- 한줄 소개 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">한줄 소개</label>
                <textarea name="description" rows="2" 
                          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>
              
              <!-- 카테고리 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                <select name="category" required 
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">선택하세요</option>
                  <option value="앱">앱</option>
                  <option value="웹플랫폼">웹플랫폼</option>
                  <option value="O2O">O2O</option>
                  <option value="게임">게임</option>
                  <option value="헬스케어">헬스케어</option>
                  <option value="교육">교육</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              
              <!-- 자금 방식 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">자금 방식 *</label>
                <select name="funding_type" required 
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">선택하세요</option>
                  <option value="투자">투자</option>
                  <option value="수익분배">수익분배</option>
                  <option value="창업희망">창업희망</option>
                </select>
              </div>
              
              <!-- 희망 금액 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">희망 금액 (만원) *</label>
                <input type="number" name="amount" required min="0" step="100"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <!-- 지원 언어 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">지원 언어</label>
                <input type="text" name="languages" placeholder="예: 한국어, 영어, 중국어"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <!-- 앱 링크 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">앱 스토어 링크</label>
                <input type="url" name="app_link" placeholder="https://"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <!-- 웹사이트 링크 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">웹사이트 링크</label>
                <input type="url" name="website_link" placeholder="https://"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <!-- 유튜브 링크 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fab fa-youtube text-red-600 mr-1"></i>유튜브 링크 (썸네일 + 재생 버튼 자동 표시)
                </label>
                <input type="url" name="youtube_link" id="youtubeLink" placeholder="https://www.youtube.com/watch?v=..."
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                       onchange="previewYouTube(this.value)">
                <div id="youtubePreview" class="mt-3 hidden">
                  <p class="text-sm text-gray-600 mb-2">미리보기:</p>
                  <div class="relative inline-block">
                    <img id="youtubeThumb" src="" alt="YouTube Thumbnail" class="w-64 h-auto rounded">
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center opacity-90">
                      <div class="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 썸네일 이미지 업로드 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-image mr-1"></i>썸네일 이미지 (PC 업로드)
                </label>
                <input type="file" id="thumbnailUpload" accept="image/*" 
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <input type="hidden" name="thumbnail" id="thumbnailBase64">
                <div id="thumbnailPreview" class="mt-3 hidden">
                  <p class="text-sm text-gray-600 mb-2">업로드된 이미지:</p>
                  <img id="thumbnailImg" src="" alt="Thumbnail" class="w-64 h-auto rounded">
                </div>
              </div>
              
              <!-- 추가 정보 -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">비즈니스 모델</label>
                <textarea name="business_model" rows="2" placeholder="수익 구조, 사업 모델 설명"
                          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">매출/수익 정보</label>
                <input type="text" name="revenue" placeholder="예: 월 500만원"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">사용자 수</label>
                <input type="text" name="users" placeholder="예: 10,000명"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">팀 소개</label>
                <textarea name="team_info" rows="2" placeholder="팀원, 역할, 경력 등"
                          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>
              
              <!-- 연락처 정보 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">담당자 이름</label>
                <input type="text" name="contact_name"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input type="email" name="contact_email"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <input type="tel" name="contact_phone"
                       class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select name="status" 
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
            </div>
            
            <div class="flex gap-3 justify-end pt-6 border-t">
              <button type="button" onclick="closeProjectForm()" 
                      class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                취소
              </button>
              <button type="submit" 
                      class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <i class="fas fa-save mr-2"></i>저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Projects List -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold text-gray-900">등록된 프로젝트</h3>
        </div>
        <div id="projectsList" class="divide-y">
          <!-- Projects will be loaded here -->
        </div>
        <div id="loadingIndicator" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
          <p class="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    </section>
  `
  
  // Set up form handlers
  document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit)
  document.getElementById('thumbnailUpload').addEventListener('change', function() {
    handleImageUpload(this, (base64) => {
      document.getElementById('thumbnailBase64').value = base64
      document.getElementById('thumbnailImg').src = base64
      document.getElementById('thumbnailPreview').classList.remove('hidden')
    })
  })
  
  loadProjects()
}

// Preview YouTube thumbnail
function previewYouTube(url) {
  const preview = document.getElementById('youtubePreview')
  const thumb = document.getElementById('youtubeThumb')
  
  const thumbnail = getYouTubeThumbnail(url)
  if (thumbnail) {
    thumb.src = thumbnail
    preview.classList.remove('hidden')
  } else {
    preview.classList.add('hidden')
  }
}

// Load projects
async function loadProjects() {
  try {
    const response = await axios.get('/api/projects')
    
    if (response.data.success) {
      projects = response.data.data || []
      
      // Merge with localStorage if empty
      if (projects.length === 0) {
        const localProjects = loadFromLocalStorage()
        if (localProjects.length > 0) {
          projects = localProjects
          console.log('Loaded from localStorage:', projects.length, 'projects')
        }
      }
      
      displayProjects()
      
      // Show database message if present
      if (response.data.message && projects.length === 0) {
        const container = document.getElementById('projectsList')
        container.innerHTML = `
          <div class="p-12 text-center">
            <i class="fas fa-info-circle text-6xl text-blue-500 mb-4"></i>
            <p class="text-xl text-gray-700 mb-2">데이터베이스 미연결</p>
            <p class="text-gray-600">${response.data.message}</p>
            <p class="text-sm text-gray-500 mt-4">
              현재 로컬 저장소 모드로 작동합니다. 프로젝트를 추가하면 브라우저에 임시 저장됩니다.
            </p>
          </div>
        ` + container.innerHTML
      }
    } else {
      throw new Error('Invalid response')
    }
  } catch (error) {
    console.error('Failed to load projects:', error)
    
    // Fallback to localStorage
    const localProjects = loadFromLocalStorage()
    if (localProjects.length > 0) {
      projects = localProjects
      displayProjects()
      
      const loading = document.getElementById('loadingIndicator')
      if (loading) {
        loading.innerHTML = `
          <div class="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <i class="fas fa-info-circle text-yellow-600 text-2xl mb-2"></i>
            <p class="text-sm text-yellow-800">
              <strong>로컬 저장소 모드:</strong> 데이터베이스 연결 실패. ${localProjects.length}개의 프로젝트를 로컬에서 불러왔습니다.
            </p>
          </div>
        `
      }
    } else {
      const loading = document.getElementById('loadingIndicator')
      if (loading) {
        loading.innerHTML = `
          <div class="p-12 text-center">
            <i class="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
            <p class="text-xl text-gray-700 mb-2">데이터베이스 연결 실패</p>
            <p class="text-sm text-gray-600">로컬 저장소 모드로 전환됩니다. 프로젝트를 추가하면 브라우저에 저장됩니다.</p>
            <button onclick="loadProjects()" class="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              다시 시도
            </button>
          </div>
        `
      }
      projects = []
      displayProjects()
    }
  }
}

// Display projects list
function displayProjects() {
  const container = document.getElementById('projectsList')
  const loading = document.getElementById('loadingIndicator')
  
  loading.classList.add('hidden')
  
  if (projects.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center text-gray-500">
        <i class="fas fa-inbox text-6xl mb-4"></i>
        <p>등록된 프로젝트가 없습니다</p>
      </div>
    `
  } else {
    container.innerHTML = projects.map(project => `
      <div class="p-6 hover:bg-gray-50 transition">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="text-lg font-bold text-gray-900 mb-2">${project.title}</h4>
            <p class="text-gray-600 text-sm mb-3">${project.description || '설명 없음'}</p>
            <div class="flex flex-wrap gap-2 text-sm">
              <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                ${project.funding_type}
              </span>
              <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                ${project.category}
              </span>
              <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                ${(project.amount || 0).toLocaleString()}만원
              </span>
              ${project.view_count ? `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"><i class="fas fa-eye mr-1"></i>${project.view_count}회</span>` : ''}
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button onclick="editProject(${project.id})" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteProject(${project.id})" 
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('')
  }
}

// Show project form
function showProjectForm() {
  editingProject = null
  document.getElementById('formTitle').textContent = '새 프로젝트 추가'
  document.getElementById('projectForm').reset()
  document.getElementById('thumbnailPreview').classList.add('hidden')
  document.getElementById('youtubePreview').classList.add('hidden')
  document.getElementById('projectFormModal').classList.remove('hidden')
}

// Close project form
function closeProjectForm() {
  document.getElementById('projectFormModal').classList.add('hidden')
  editingProject = null
}

// Edit project
function editProject(id) {
  const project = projects.find(p => p.id === id)
  if (!project) return
  
  editingProject = project
  document.getElementById('formTitle').textContent = '프로젝트 수정'
  
  const form = document.getElementById('projectForm')
  form.elements.title.value = project.title || ''
  form.elements.description.value = project.description || ''
  form.elements.category.value = project.category || ''
  form.elements.funding_type.value = project.funding_type || ''
  form.elements.amount.value = project.amount || 0
  form.elements.languages.value = project.languages || ''
  form.elements.app_link.value = project.app_link || ''
  form.elements.website_link.value = project.website_link || ''
  form.elements.youtube_link.value = project.youtube_link || ''
  form.elements.business_model.value = project.business_model || ''
  form.elements.revenue.value = project.revenue || ''
  form.elements.users.value = project.users || ''
  form.elements.team_info.value = project.team_info || ''
  form.elements.contact_name.value = project.contact_name || ''
  form.elements.contact_email.value = project.contact_email || ''
  form.elements.contact_phone.value = project.contact_phone || ''
  form.elements.status.value = project.status || 'active'
  
  if (project.thumbnail) {
    document.getElementById('thumbnailBase64').value = project.thumbnail
    document.getElementById('thumbnailImg').src = project.thumbnail
    document.getElementById('thumbnailPreview').classList.remove('hidden')
  }
  
  if (project.youtube_link) {
    previewYouTube(project.youtube_link)
  }
  
  document.getElementById('projectFormModal').classList.remove('hidden')
}

// Delete project
async function deleteProject(id) {
  if (!confirm('정말 이 프로젝트를 삭제하시겠습니까?')) return
  
  try {
    const response = await axios.delete(`/api/projects/${id}`)
    
    if (response.data.success) {
      alert('프로젝트가 삭제되었습니다')
      loadProjects()
    } else {
      alert('삭제 실패: ' + response.data.error)
    }
  } catch (error) {
    console.error('Delete error:', error)
    
    // Fallback to localStorage
    deleteFromLocalStorage(id)
    alert('로컬 저장소에서 삭제되었습니다')
    loadProjects()
  }
}

// Delete from localStorage
function deleteFromLocalStorage(id) {
  const projects = JSON.parse(localStorage.getItem('iqherb_projects') || '[]')
  const filtered = projects.filter(p => p.id !== id)
  localStorage.setItem('iqherb_projects', JSON.stringify(filtered))
}

// Handle form submit
async function handleProjectSubmit(e) {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData.entries())
  
  // Get Base64 thumbnail
  const thumbnailBase64 = document.getElementById('thumbnailBase64').value
  if (thumbnailBase64) {
    data.thumbnail = thumbnailBase64
  }
  
  try {
    let response
    if (editingProject) {
      response = await axios.put(`/api/projects/${editingProject.id}`, data)
    } else {
      response = await axios.post('/api/projects', data)
    }
    
    if (response.data.success) {
      alert(editingProject ? '프로젝트가 수정되었습니다' : '프로젝트가 추가되었습니다')
      closeProjectForm()
      loadProjects()
    } else {
      alert('저장 실패: ' + response.data.error)
    }
  } catch (error) {
    console.error('Submit error:', error)
    
    // Fallback to localStorage if API fails
    if (confirm('데이터베이스 연결 실패. 로컬 저장소에 임시로 저장하시겠습니까?')) {
      saveToLocalStorage(data)
      alert('로컬 저장소에 저장되었습니다. D1 데이터베이스를 연결하면 자동으로 동기화됩니다.')
      closeProjectForm()
      loadProjects()
    }
  }
}

// Save to localStorage as fallback
function saveToLocalStorage(data) {
  const projects = JSON.parse(localStorage.getItem('iqherb_projects') || '[]')
  data.id = Date.now()
  data.created_at = new Date().toISOString()
  projects.push(data)
  localStorage.setItem('iqherb_projects', JSON.stringify(projects))
}

// Load from localStorage
function loadFromLocalStorage() {
  return JSON.parse(localStorage.getItem('iqherb_projects') || '[]')
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', () => {
  renderAdminPage()
})
