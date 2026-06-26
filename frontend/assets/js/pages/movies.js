// ============================================
// pages/movies.js
// ============================================

let allMovies = [];

async function initMoviesPage() {
  initNavSearch();

  const grid = document.getElementById('moviesGrid');
  const listView = document.getElementById('moviesListView');
  const tbody = document.getElementById('moviesBody');
  const countEl = document.getElementById('movieCount');
  const emptyEl = document.getElementById('moviesEmpty');
  const viewGrid = document.getElementById('viewGrid');
  const viewList = document.getElementById('viewList');
  const eraFilter = document.getElementById('eraFilter');
  const navInput = document.getElementById('navSearchInput');

  if (!grid) return;

  let currentView = 'grid';
  let currentEra = 'all';
  let searchQ = '';

  viewGrid?.addEventListener('click', () => {
    currentView = 'grid';
    viewGrid.classList.add('active');
    viewList.classList.remove('active');
    grid.style.display = '';
    listView.style.display = 'none';
    applyFilters();
  });

  viewList?.addEventListener('click', () => {
    currentView = 'list';
    viewList.classList.add('active');
    viewGrid.classList.remove('active');
    grid.style.display = 'none';
    listView.style.display = '';
    applyFilters();
  });

  eraFilter?.addEventListener('click', (e) => {
    const btn = e.target.closest('.era-btn');
    if (!btn) return;
    eraFilter.querySelectorAll('.era-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentEra = btn.dataset.era;
    applyFilters();
  });

  navInput?.addEventListener('input', () => {
    searchQ = navInput.value.toLowerCase().trim();
    applyFilters();
  });

  function applyFilters() {
    let filtered = allMovies;

    if (searchQ.length >= 1) {
      filtered = filtered.filter((m) =>
        m.title_vi.toLowerCase().includes(searchQ)
        || (m.title_jp || '').toLowerCase().includes(searchQ)
        || String(m.release_year).includes(searchQ)
        || (m.director || '').toLowerCase().includes(searchQ)
      );
    }

    if (currentEra !== 'all') {
      filtered = filtered.filter((m) => getEraDecade(m.release_year) === currentEra);
    }

    if (countEl) countEl.textContent = `${filtered.length} phim`;

    if (filtered.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      grid.style.display = 'none';
      if (listView) listView.style.display = 'none';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    if (currentView === 'grid') {
      grid.style.display = '';
      grid.innerHTML = filtered.map((m) => renderMovieCard(m)).join('');
    } else if (tbody) {
      tbody.innerHTML = filtered.map((m) => renderMovieRow(m)).join('');
    }
  }

  const movies = unwrapList(await apiGet('movies'));
  if (!movies.length) {
    if (emptyEl) { emptyEl.style.display = ''; grid.innerHTML = ''; }
    return;
  }

  allMovies = movies;
  if (countEl) countEl.textContent = `${movies.length} phim`;
  applyFilters();

  // Auth check and Setup Add Movie button
  const meRes = await apiGet('auth/me');
  const userRole = meRes?.user?.role ?? 'user';
  const isEditor = ['editor', 'admin'].includes(userRole);

  const addBtn = document.getElementById('addMovieBtn');
  if (addBtn && isEditor) {
    addBtn.style.display = '';

    const modal = document.getElementById('addWikiModal');
    const cancelBtn = document.getElementById('addWikiCancel');
    const form = document.getElementById('addWikiForm');
    const submitBtn = document.getElementById('addWikiSubmit');

    const closeModal = () => {
      modal.classList.remove('open');
    };

    addBtn.addEventListener('click', () => {
      document.getElementById('wikiTitleVi').value = '';
      document.getElementById('wikiTitleJp').value = '';
      document.getElementById('wikiReleaseYear').value = '';
      document.getElementById('wikiReleaseDate').value = '';
      document.getElementById('wikiDirector').value = '';
      document.getElementById('wikiBoxOffice').value = '';
      document.getElementById('wikiThemeSong').value = '';
      document.getElementById('wikiPlot').value = '';
      document.getElementById('wikiIsFeatured').checked = false;

      modal.classList.add('open');
    });

    cancelBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang thêm...';
      }

      const payload = {
        title_vi: document.getElementById('wikiTitleVi').value.trim(),
        title_jp: document.getElementById('wikiTitleJp').value.trim(),
        release_year: parseInt(document.getElementById('wikiReleaseYear').value, 10) || 0,
        release_date: document.getElementById('wikiReleaseDate').value.trim(),
        director: document.getElementById('wikiDirector').value.trim(),
        box_office: document.getElementById('wikiBoxOffice').value.trim(),
        theme_song: document.getElementById('wikiThemeSong').value.trim(),
        plot: document.getElementById('wikiPlot').value.trim(),
        is_featured: document.getElementById('wikiIsFeatured').checked
      };

      const res = await apiPost('movies', payload);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Thêm Phim';
      }

      if (res?.success) {
        showToast('Đã thêm phim mới thành công!', 'success');
        closeModal();
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        showToast('Thêm thất bại: ' + (res?.error || 'Lỗi kết nối'), 'error');
      }
    });
  }
}
