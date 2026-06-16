// ============================================
// favorites.js — localStorage favorites
// ============================================

const FAV_KEY = 'dw_favorites';

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
  catch { return []; }
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) { favs.push(id); showToast('❤️ Đã thêm vào yêu thích!', 'success'); }
  else { favs.splice(idx, 1); showToast('💔 Đã xoá khỏi yêu thích'); }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return idx === -1;
}

function isFavorite(id) {
  return getFavorites().includes(id);
}
