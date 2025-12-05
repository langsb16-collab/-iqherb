// Main page JavaScript
let allProjects = []
let filteredProjects = []

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

// Create project card HTML
function createProjectCard(project) {
  const fundingBadgeClass = 
    project.funding_type === '투자' ? 'badge-investment' :
    project.funding_type === '수익분배' ? 'badge-revenue' :
    'badge-loan'
  
  const thumbnail = project.youtube_link 
    ? getYouTubeThumbnail(project.youtube_link)
    : project.thumbnail || 'https://via.placeholder.com/400x300/667eea/FFFFFF?text=No+Image'
  
  const hasYouTube = project.youtube_link && getYouTubeVideoId(project.youtube_link)
  
  return `
    <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover">
      <div class="relative ${hasYouTube ? 'youtube-thumbnail' : ''}" 
           ${hasYouTube ? `onclick="window.open('${project.youtube_link}', '_blank')"` : ''}>
        <img src="${thumbnail}" 
             alt="${project.title}" 
             class="w-full h-48 object-cover"
             onerror="this.src='https://via.placeholder.com/400x300/667eea/FFFFFF?text=No+Image'">
        ${hasYouTube ? '<div class="youtube-play-btn"></div>' : ''}
      </div>
      
      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-xl font-bold text-gray-900 flex-1">${project.title}</h3>
          ${project.view_count ? `<span class="text-sm text-gray-500 ml-2"><i class="fas fa-eye"></i> ${project.view_count}</span>` : ''}
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">${project.description || '설명 없음'}</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="badge ${fundingBadgeClass}">
            <i class="fas fa-${project.funding_type === '투자' ? 'hand-holding-usd' : project.funding_type === '수익분배' ? 'chart-line' : 'coins'} mr-1"></i>
            ${project.funding_type}
          </span>
          ${project.category ? `<span class="badge bg-gray-200 text-gray-800">${project.category}</span>` : ''}
        </div>
        
        <div class="mb-4">
          <div class="amount-tag inline-block">
            <i class="fas fa-won-sign mr-1"></i>
            ${(project.amount || 0).toLocaleString()}만원
          </div>
        </div>
        
        ${project.languages ? `
          <div class="mb-4 text-sm text-gray-600">
            <i class="fas fa-language mr-2"></i>${project.languages}
          </div>
        ` : ''}
        
        <div class="flex gap-2 pt-4 border-t">
          ${project.app_link ? `<a href="${project.app_link}" target="_blank" class="flex-1 text-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"><i class="fas fa-mobile-alt mr-1"></i>앱</a>` : ''}
          ${project.website_link ? `<a href="${project.website_link}" target="_blank" class="flex-1 text-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"><i class="fas fa-globe mr-1"></i>웹</a>` : ''}
          ${project.contact_email ? `<a href="mailto:${project.contact_email}" class="flex-1 text-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"><i class="fas fa-envelope mr-1"></i>문의</a>` : ''}
        </div>
      </div>
    </div>
  `
}

// Load and display projects
async function loadProjects() {
  try {
    const response = await axios.get('/api/projects')
    
    if (response.data.success) {
      allProjects = response.data.data
      applyFilters()
    }
  } catch (error) {
    console.error('Failed to load projects:', error)
    document.getElementById('loadingIndicator').innerHTML = `
      <i class="fas fa-exclamation-triangle text-4xl text-red-600"></i>
      <p class="mt-4 text-gray-600">프로젝트를 불러오는데 실패했습니다</p>
    `
  }
}

// Apply filters and sorting
function applyFilters() {
  const fundingFilter = document.getElementById('filterFunding').value
  const sortBy = document.getElementById('sortBy').value
  const searchTerm = document.getElementById('searchInput').value.toLowerCase()
  
  // Filter projects
  filteredProjects = allProjects.filter(project => {
    const matchesFunding = !fundingFilter || project.funding_type === fundingFilter
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm) ||
      (project.description && project.description.toLowerCase().includes(searchTerm)) ||
      (project.category && project.category.toLowerCase().includes(searchTerm))
    
    return matchesFunding && matchesSearch
  })
  
  // Sort projects
  filteredProjects.sort((a, b) => {
    switch (sortBy) {
      case 'amount_desc':
        return (b.amount || 0) - (a.amount || 0)
      case 'amount_asc':
        return (a.amount || 0) - (b.amount || 0)
      case 'views':
        return (b.view_count || 0) - (a.view_count || 0)
      case 'latest':
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })
  
  displayProjects()
}

// Display projects in grid
function displayProjects() {
  const container = document.getElementById('projectsContainer')
  const loading = document.getElementById('loadingIndicator')
  const empty = document.getElementById('emptyState')
  
  loading.classList.add('hidden')
  
  if (filteredProjects.length === 0) {
    container.innerHTML = ''
    empty.classList.remove('hidden')
  } else {
    empty.classList.add('hidden')
    container.innerHTML = filteredProjects.map(project => createProjectCard(project)).join('')
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadProjects()
  
  // Add event listeners for filters
  document.getElementById('filterFunding').addEventListener('change', applyFilters)
  document.getElementById('sortBy').addEventListener('change', applyFilters)
  document.getElementById('searchInput').addEventListener('input', applyFilters)
})
