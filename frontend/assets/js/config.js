// ============================================
// config.js — API configuration
// ============================================

(function () {
  const meta = document.querySelector('meta[name="api-base"]');
  if (meta?.content) {
    window.API_BASE_URL = meta.content.replace(/\/$/, '');
  } else if (location.protocol === 'file:' || location.port !== '3000') {
    window.API_BASE_URL = 'http://localhost:3000/api';
  } else {
    window.API_BASE_URL = '/api';
  }

  window.resolveImageUrl = function (url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }

    // Extract backend host from API_BASE_URL if it is absolute
    let backendHost = '';
    if (window.API_BASE_URL.startsWith('http://') || window.API_BASE_URL.startsWith('https://')) {
      backendHost = window.API_BASE_URL.replace(/\/api$/, '');
    }

    if (location.protocol === 'file:') {
      if (url.startsWith('/uploads/')) {
        return (backendHost || 'http://localhost:3000') + url;
      }
      if (url.startsWith('/')) {
        return url.substring(1);
      }
      return url;
    } else {
      // If frontend origin is different from backend host, route /uploads/ to backend
      if (url.startsWith('/uploads/') && backendHost && backendHost !== location.origin) {
        return backendHost + url;
      }
      return url;
    }
  };
})();

