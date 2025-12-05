// Simple client-side router for SPA
function initRouter() {
  // Handle route changes
  function handleRoute() {
    const hash = window.location.hash.slice(1) || '/'
    
    if (hash === '/admin') {
      loadAdminPage()
    } else {
      loadMainPage()
    }
  }
  
  // Load main page
  function loadMainPage() {
    if (window.location.pathname !== '/') {
      window.location.href = '/'
    }
  }
  
  // Load admin page
  function loadAdminPage() {
    window.location.href = '/admin.html'
  }
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute)
  
  // Handle initial route
  handleRoute()
}

// Initialize router on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter)
} else {
  initRouter()
}
