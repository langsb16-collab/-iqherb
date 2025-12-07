// Translations
const translations = {
  ko: {
    subtitle: '프로젝트가 자본을 만나는 곳',
    hero_title: 'Code your vision,<br>build your future',
    hero_desc: '개발자, 전략적 투자자 조달 허브',
    type_investment: '투자',
    type_revenue: '수익분배',
    type_startup: '창업',
    loading: '프로젝트를 불러오는 중...',
    no_projects: '등록된 프로젝트가 없습니다',
    footer_title: '프로젝트가 자본을 만나는 곳',
    video_label: '영상 보기',
    detail_title: '프로젝트 상세 정보',
    admin_title: '관리자 페이지',
    admin_home: '메인',
    new_project: '새 프로젝트',
    registered_projects: '등록된 프로젝트',
    project_name: '프로젝트명',
    description: '한줄 소개',
    category: '카테고리',
    funding_type: '자금 방식',
    amount: '희망 금액 (USD $)',
    youtube_links: '유튜브 링크 (최대 5개)',
    youtube_link: '유튜브 링크',
    text_info: '텍스트 정보',
    cancel: '취소',
    save: '저장',
    edit: '수정',
    delete: '삭제',
    confirm_delete: '삭제하시겠습니까?',
    success_added: '✅ 추가되었습니다',
    success_updated: '✅ 수정되었습니다',
    success_deleted: '삭제되었습니다',
    error_save: '❌ 저장 오류: ',
    error_delete: '삭제 중 오류가 발생했습니다',
    select: '선택',
    category_medical: '의료',
    category_investment: '투자',
    category_etc: '기타',
    click_to_play: '클릭하여 재생'
  },
  en: {
    subtitle: 'Where Projects Meet Capital',
    hero_title: 'Code your vision,<br>build your future',
    hero_desc: 'Developer & Strategic Investor Hub',
    type_investment: 'Investment',
    type_revenue: 'Revenue Share',
    type_startup: 'Startup',
    loading: 'Loading projects...',
    no_projects: 'No projects registered',
    footer_title: 'Where Projects Meet Capital',
    video_label: 'Watch Video',
    detail_title: 'Project Details',
    admin_title: 'Admin Panel',
    admin_home: 'Home',
    new_project: 'New Project',
    registered_projects: 'Registered Projects',
    project_name: 'Project Name',
    description: 'Description',
    category: 'Category',
    funding_type: 'Funding Type',
    amount: 'Target Amount (USD $)',
    youtube_links: 'YouTube Links (Max 5)',
    youtube_link: 'YouTube Link',
    text_info: 'Detailed Info',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm_delete: 'Are you sure you want to delete?',
    success_added: '✅ Added successfully',
    success_updated: '✅ Updated successfully',
    success_deleted: 'Deleted successfully',
    error_save: '❌ Save error: ',
    error_delete: 'Error occurred while deleting',
    select: 'Select',
    category_medical: 'Medical',
    category_investment: 'Investment',
    category_etc: 'Other',
    click_to_play: 'Click to Play'
  },
  zh: {
    subtitle: '项目与资本相遇之地',
    hero_title: 'Code your vision,<br>build your future',
    hero_desc: '开发者与战略投资者枢纽',
    type_investment: '投资',
    type_revenue: '收益分配',
    type_startup: '创业',
    loading: '正在加载项目...',
    no_projects: '没有注册的项目',
    footer_title: '项目与资本相遇之地',
    video_label: '观看视频',
    detail_title: '项目详情',
    admin_title: '管理员页面',
    admin_home: '主页',
    new_project: '新项目',
    registered_projects: '已注册项目',
    project_name: '项目名称',
    description: '简介',
    category: '类别',
    funding_type: '资金方式',
    amount: '目标金额（美元 $）',
    youtube_links: 'YouTube链接（最多5个）',
    youtube_link: 'YouTube链接',
    text_info: '详细信息',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    confirm_delete: '确定要删除吗？',
    success_added: '✅ 添加成功',
    success_updated: '✅ 修改成功',
    success_deleted: '删除成功',
    error_save: '❌ 保存错误：',
    error_delete: '删除时发生错误',
    select: '选择',
    category_medical: '医疗',
    category_investment: '投资',
    category_etc: '其他',
    click_to_play: '点击播放'
  }
};

let currentLang = localStorage.getItem('lang') || 'ko';
let projects = [];
let editing = null;

function changeLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  
  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    }
  });
  
  // Update all translated elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  
  // Reload projects with new language
  loadProjects();
}

function t(key) {
  return translations[currentLang][key] || translations['ko'][key] || key;
}

function translateFundingType(type) {
  const fundingMap = {
    'investment': { 'ko': '투자', 'en': 'Investment', 'zh': '投资' },
    'donation': { 'ko': '수익분배', 'en': 'Revenue Share', 'zh': '收益分配' }
  };
  
  // Find matching type
  for (const key of Object.keys(fundingMap)) {
    const values = Object.values(fundingMap[key]);
    if (values.includes(type)) {
      return fundingMap[key][currentLang];
    }
  }
  
  return type;
}

function translateCategory(category) {
  const categoryMap = {
    'ko': { '의료': '의료', '투자': '투자', '기타': '기타' },
    'en': { '의료': 'Medical', '투자': 'Investment', '기타': 'Other' },
    'zh': { '의료': '医疗', '투자': '投资', '기타': '其他' }
  };
  
  for (const ko of Object.keys(categoryMap['ko'])) {
    if (category === ko || category === categoryMap['en'][ko] || category === categoryMap['zh'][ko]) {
      return categoryMap[currentLang][ko];
    }
  }
  
  return category;
}

function getTranslatedField(project, field) {
  const langField = `${field}_${currentLang}`;
  if (project[langField]) {
    return project[langField];
  }
  
  const baseValue = project[field] || '';
  if (baseValue.includes('|||')) {
    const parts = baseValue.split('|||').map(s => s.trim());
    if (currentLang === 'ko') return parts[0] || baseValue;
    if (currentLang === 'en') return parts[1] || parts[0] || baseValue;
    if (currentLang === 'zh') return parts[2] || parts[0] || baseValue;
  }
  
  return baseValue;
}

// Initialize language on load
document.addEventListener('DOMContentLoaded', () => {
  changeLang(currentLang);
});

// Load projects from API
async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  const loading = document.getElementById('loadingIndicator');
  const empty = document.getElementById('emptyState');

  try {
    const response = await axios.get('/api/projects');
    projects = response.data.data || [];
    
    loading.style.display = 'none';
    
    if (projects.length === 0) {
      empty.classList.remove('hidden');
      return;
    }

    container.innerHTML = projects.map(project => {
      const title = getTranslatedField(project, 'title');
      const description = getTranslatedField(project, 'description');
      const category = translateCategory(project.category || '기타');
      const fundingType = project.funding_type || 'investment';
      
      // Determine badge color based on funding type
      let badgeClass = 'badge-red';
      let badgeText = '투자';
      
      if (fundingType === 'investment' || fundingType.includes('투자') || fundingType.includes('Investment')) {
        badgeClass = 'badge-red';
        badgeText = t('type_investment');
      } else if (fundingType === 'donation' || fundingType.includes('수익') || fundingType.includes('Revenue')) {
        badgeClass = 'badge-green';
        badgeText = t('type_revenue');
      }
      
      return `
      <div class="project-card" onclick="showProjectDetail('${project.id}')">
        <div class="project-card-header">
          <span class="category-label">${category}</span>
        </div>
        <div class="project-card-body">
          <h3 class="project-title">${title}</h3>
          <p class="project-description">${description || ''}</p>
        </div>
        <div class="project-card-footer">
          <span class="badge ${badgeClass}">${badgeText}</span>
          <span class="amount-badge">$ ${(project.amount || 0).toLocaleString()}</span>
        </div>
      </div>
    `;
    }).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    loading.style.display = 'none';
    empty.classList.remove('hidden');
  }
}

function getYouTubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/,
    /youtube\.com\/embed\/([^&\s?]+)/,
    /youtube\.com\/v\/([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1].substring(0, 11);
  }
  return null;
}

function showProjectDetail(id) {
  const project = projects.find(p => p.id == id);
  if (!project) return;
  
  // Get all YouTube URLs
  const youtubeUrls = [
    project.youtube_url_1,
    project.youtube_url_2,
    project.youtube_url_3,
    project.youtube_url_4,
    project.youtube_url_5
  ].filter(url => url && url.trim()).map(url => getYouTubeVideoId(url)).filter(id => id);
  
  const title = getTranslatedField(project, 'title');
  const description = getTranslatedField(project, 'description');
  const textInfo = getTranslatedField(project, 'text_info');
  const fundingType = translateFundingType(project.funding_type);
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  
  // Videos section HTML - vertical layout for 2-5 videos
  let videosHTML = '';
  if (youtubeUrls.length > 0) {
    videosHTML = `
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 class="text-lg font-bold mb-3 text-center">
          <i class="fab fa-youtube text-red-600 mr-2"></i>${t('video_label')} (${youtubeUrls.length}개)
        </h3>
        <div class="space-y-4 max-w-3xl mx-auto">
          ${youtubeUrls.map((videoId, index) => `
            <div class="youtube-thumbnail" id="modal-video-${index}" onclick="playVideo('modal-video-${index}', '${videoId}')">
              <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video ${index + 1}">
              <div class="play-button"></div>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                ${t('click_to_play')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-700 mb-2">${description}</p>
          ${textInfo ? `<p class="text-gray-600 text-sm">${textInfo}</p>` : ''}
        </div>
        
        <div class="flex gap-2 mb-4">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            ${fundingType}
          </span>
          <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            $${(project.amount || 0).toLocaleString()}
          </span>
        </div>
        
        ${videosHTML}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function playVideo(elementId, videoId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `
    <iframe 
      width="100%" 
      height="100%" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    ></iframe>
  `;
}

// Admin page functions
async function loadAdminProjects() {
  try {
    const response = await axios.get('/api/projects');
    projects = response.data.data || [];
    
    const container = document.getElementById('adminProjectsList');
    container.innerHTML = projects.map(project => {
      const title = project.title_ko || project.title || 'No Title';
      return `
      <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
        <div class="flex-1">
          <h3 class="font-bold text-gray-900">${title}</h3>
          <p class="text-sm text-gray-600">${project.category || ''} | ${project.funding_type || ''} | $${(project.amount || 0).toLocaleString()}</p>
        </div>
        <div class="flex gap-2">
          <button onclick="editProject(${project.id})" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteProject(${project.id})" class="text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    }).join('');
  } catch (error) {
    console.error('Error loading admin projects:', error);
  }
}

function showProjectForm(projectId = null) {
  editing = projectId ? projects.find(p => p.id == projectId) : null;
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onclick="event.stopPropagation()">
      <h2 class="text-2xl font-bold mb-4">${editing ? t('edit') : t('new_project')}</h2>
      
      <form id="projectForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">${t('project_name')} (${t('select')} 한국어|||English|||中文)</label>
          <textarea id="projectTitle" class="w-full border rounded px-3 py-2" rows="2" required
            placeholder="예: 혁신적인 모바일 앱|||Innovative mobile app|||创新移动应用">${editing ? (editing.title_ko || editing.title || '') : ''}</textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">${t('description')} (한국어|||English|||中文)</label>
          <textarea id="projectDescription" class="w-full border rounded px-3 py-2" rows="3"
            placeholder="예: 최신 기술 기반|||Based on latest tech|||基于最新技术">${editing ? (editing.description_ko || editing.description || '') : ''}</textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('category')}</label>
            <select id="projectCategory" class="w-full border rounded px-3 py-2">
              <option value="의료" ${editing && editing.category === '의료' ? 'selected' : ''}>의료</option>
              <option value="투자" ${editing && editing.category === '투자' ? 'selected' : ''}>투자</option>
              <option value="기타" ${editing && editing.category === '기타' ? 'selected' : ''}>기타</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">${t('funding_type')}</label>
            <select id="projectFundingType" class="w-full border rounded px-3 py-2">
              <option value="investment" ${editing && editing.funding_type === 'investment' ? 'selected' : ''}>투자</option>
              <option value="donation" ${editing && editing.funding_type === 'donation' ? 'selected' : ''}>수익분배</option>
            </select>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">${t('amount')}</label>
          <input type="number" id="projectAmount" class="w-full border rounded px-3 py-2" min="0" step="1000"
            value="${editing ? editing.amount || 0 : 0}">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">${t('youtube_links')}</label>
          <div class="space-y-2">
            ${[1, 2, 3, 4, 5].map(i => `
              <input type="url" id="youtubeUrl${i}" class="w-full border rounded px-3 py-2" 
                placeholder="${t('youtube_link')} ${i}"
                value="${editing ? editing[`youtube_url_${i}`] || '' : ''}">
            `).join('')}
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">${t('text_info')} (한국어|||English|||中文)</label>
          <textarea id="projectTextInfo" class="w-full border rounded px-3 py-2" rows="2"
            placeholder="예: 추가 정보|||Additional info|||附加信息">${editing ? (editing.text_info_ko || editing.text_info || '') : ''}</textarea>
        </div>
        
        <div class="flex gap-2 justify-end">
          <button type="button" onclick="this.closest('.fixed').remove()" 
            class="px-4 py-2 border rounded hover:bg-gray-100">${t('cancel')}</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">${t('save')}</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('projectForm').onsubmit = async (e) => {
    e.preventDefault();
    await saveProject();
    modal.remove();
  };
}

async function saveProject() {
  const title = document.getElementById('projectTitle').value.trim();
  const description = document.getElementById('projectDescription').value.trim();
  const category = document.getElementById('projectCategory').value;
  const fundingType = document.getElementById('projectFundingType').value;
  const amount = parseInt(document.getElementById('projectAmount').value) || 0;
  const textInfo = document.getElementById('projectTextInfo').value.trim();
  
  // Parse multilingual fields
  const [title_ko, title_en, title_zh] = title.includes('|||') ? title.split('|||').map(s => s.trim()) : [title, title, title];
  const [desc_ko, desc_en, desc_zh] = description.includes('|||') ? description.split('|||').map(s => s.trim()) : [description, description, description];
  const [text_ko, text_en, text_zh] = textInfo.includes('|||') ? textInfo.split('|||').map(s => s.trim()) : [textInfo, textInfo, textInfo];
  
  const data = {
    title: title_ko,
    title_ko, title_en, title_zh,
    description: desc_ko,
    description_ko: desc_ko, description_en: desc_en, description_zh: desc_zh,
    category,
    funding_type: fundingType,
    amount,
    youtube_url_1: document.getElementById('youtubeUrl1').value.trim(),
    youtube_url_2: document.getElementById('youtubeUrl2').value.trim(),
    youtube_url_3: document.getElementById('youtubeUrl3').value.trim(),
    youtube_url_4: document.getElementById('youtubeUrl4').value.trim(),
    youtube_url_5: document.getElementById('youtubeUrl5').value.trim(),
    text_info: text_ko,
    text_info_ko: text_ko, text_info_en: text_en, text_info_zh: text_zh
  };
  
  try {
    if (editing) {
      await axios.put(`/api/projects/${editing.id}`, data);
      alert(t('success_updated'));
    } else {
      await axios.post('/api/projects', data);
      alert(t('success_added'));
    }
    loadAdminProjects();
  } catch (error) {
    console.error('Error saving project:', error);
    alert(t('error_save') + (error.response?.data?.message || error.message));
  }
}

function editProject(id) {
  showProjectForm(id);
}

async function deleteProject(id) {
  if (!confirm(t('confirm_delete'))) return;
  
  try {
    await axios.delete(`/api/projects/${id}`);
    alert(t('success_deleted'));
    loadAdminProjects();
  } catch (error) {
    console.error('Error deleting project:', error);
    alert(t('error_delete'));
  }
}

// Router for SPA
function loadPage() {
  const hash = window.location.hash.slice(1) || '/';
  const mainPage = document.getElementById('mainPage');
  const adminPage = document.getElementById('adminPage');
  
  if (hash === '/admin') {
    mainPage.style.display = 'none';
    adminPage.style.display = 'block';
    loadAdminProjects();
  } else {
    mainPage.style.display = 'block';
    adminPage.style.display = 'none';
    loadProjects();
  }
}

window.addEventListener('hashchange', loadPage);
window.addEventListener('load', loadPage);
