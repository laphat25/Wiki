// ============================================
// search.js — Nav search dropdown
// ============================================

let navSearchTimer = null;

function initNavSearch() {
  const input = document.getElementById('navSearchInput');
  const dropdown = document.getElementById('navSearchDropdown');
  const form = document.getElementById('navSearchForm');
  if (!input || !dropdown) return;

  if (form) form.addEventListener('submit', (e) => e.preventDefault());

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (q.length < 2) { dropdown.classList.remove('active'); return; }

    clearTimeout(navSearchTimer);
    navSearchTimer = setTimeout(async () => {
      dropdown.innerHTML = '<div class="nav__search-loading">Đang tìm...</div>';
      dropdown.classList.add('active');

      const results = unwrapList(await apiGet(`movies?q=${encodeURIComponent(q)}`));

      if (!results.length) {
        dropdown.innerHTML = `<div class="nav__search-empty">Không tìm thấy phim "${escapeHtml(q)}"</div>`;
        return;
      }

      dropdown.innerHTML = `<div class="nav__search-dropdown-list">${results.slice(0, 6).map((m) => `
        <a href="detail.html?id=${m.id}" class="nav__search-item">
          <div class="nav__search-item-emoji">🎬</div>
          <div class="nav__search-item-info">
            <span class="nav__search-item-title">${escapeHtml(m.title_vi)}</span>
            <span class="nav__search-item-desc">${m.release_year} · ${escapeHtml(m.director || '—')}</span>
          </div>
          ${isFavorite(m.id) ? '<span class="nav__search-fav">❤️</span>' : ''}
        </a>
      `).join('')}</div>`;
    }, 280);
  });
}
