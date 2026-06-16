// ============================================
// pages/favorites.js
// ============================================

async function initFavoritesPage() {
  initNavSearch();

  const grid = document.getElementById('favoritesGrid');
  const emptyEl = document.getElementById('favoritesEmpty');
  const countEl = document.getElementById('favoritesCount');
  if (!grid) return;

  const favIds = getFavorites();
  if (countEl) countEl.textContent = favIds.length;

  if (!favIds.length) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  const allMovies = unwrapList(await apiGet('movies'));
  const favMovies = allMovies.filter((m) => favIds.includes(Number(m.id)));

  if (!favMovies.length) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  grid.innerHTML = favMovies.map((m) => renderMovieCard(m)).join('');
}
