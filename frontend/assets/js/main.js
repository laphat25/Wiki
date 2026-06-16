// ============================================
// main.js — Application router
// ============================================

const PAGE_INIT_FN = {
  'index.html': 'initHomePage',
  '': 'initHomePage',
  'movies.html': 'initMoviesPage',
  'detail.html': 'initDetailPage',
  'login.html': 'initLoginPage',
  'register.html': 'initRegisterPage',
  'favorites.html': 'initFavoritesPage',
  'about.html': 'initAboutPage',
  'admin.html': 'initAdminPage',
};

document.addEventListener('DOMContentLoaded', () => {
  initErrorBanner();
  initAuthNav();

  const page = location.pathname.split('/').pop() || 'index.html';
  const fnName = PAGE_INIT_FN[page];
  if (fnName && typeof window[fnName] === 'function') {
    window[fnName]();
  }
});
