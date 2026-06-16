// ============================================
// pages/detail.js
// ============================================

const DIRECTOR_BADGE = {
  'Tsutomu Shibayama': { color: '#22D3EE', era: 'Era Shibayama (1980–2005)' },
  'Kozo Kusuba': { color: '#A855F7', era: 'Era Kusuba (2006–2013)' },
  'Yoshio Takeuchi': { color: '#F59E0B', era: 'Era Takeuchi (2014–2017)' },
  'Kazuaki Imai': { color: '#10B981', era: 'Era Imai (2018–2021)' },
  'Shinnosuke Yakuwa': { color: '#EF4444', era: 'Era Yakuwa (2022)' },
  'Takumi Dohi': { color: '#F97316', era: 'Era Dohi (2023)' },
  'Yukiyo Teramoto': { color: '#EC4899', era: 'Era Teramoto (2024+)' },
};

async function initDetailPage() {
  initNavSearch();

  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'), 10);
  if (!id) { location.href = 'movies.html'; return; }

  const [movie, allMovies] = await Promise.all([
    apiGet(`movies/${id}`),
    apiGet('movies'),
  ]);

  if (!movie || movie.error) {
    document.querySelector('.detail-page').innerHTML = `
      <div class="container empty-state">
        <div class="empty-state__emoji">🎬</div>
        <div class="empty-state__title">Không tìm thấy phim</div>
        <a class="btn btn--primary" href="movies.html">← Quay lại danh sách</a>
      </div>`;
    return;
  }

  document.title = `${movie.title_vi} (${movie.release_year}) — Doraemon Wiki`;
  setText('d-title-vi', movie.title_vi);
  setText('d-title-jp', movie.title_jp || '');
  setText('bc-name', movie.title_vi);
  setText('info-title', movie.title_vi);

  document.getElementById('d-plot').innerHTML = movie.plot
    ? `<p>${escapeHtml(movie.plot).replace(/\n/g, '</p><p>')}</p>`
    : `<p style="color:var(--text-muted);font-style:italic">Nội dung phim đang được cập nhật...</p>`;

  setText('info-dir', movie.director || '—');
  setText('info-year', movie.release_year || '—');
  setText('info-date', movie.release_date || '—');
  setText('info-box', movie.box_office || 'Đang cập nhật');
  setText('info-song', movie.theme_song || 'Đang cập nhật');

  const imgEl = document.getElementById('info-img');
  if (imgEl) {
    const resolvedImg = typeof window.resolveImageUrl === 'function' ? window.resolveImageUrl(movie.image_url) : movie.image_url;
    if (resolvedImg) {
      imgEl.style.backgroundImage = `url(${resolvedImg})`;
      imgEl.classList.remove('no-poster');
    } else {
      imgEl.classList.add('no-poster');
    }
  }

  const badgesEl = document.getElementById('detailBadges');
  if (badgesEl) {
    const info = DIRECTOR_BADGE[movie.director];
    badgesEl.innerHTML = `
      ${info ? `<span class="detail-era-badge" style="--era-color:${info.color}">${info.era}</span>` : ''}
      <span class="detail-era-badge" style="--era-color:#64748B">📽 Phim thứ #${movie.id}</span>
    `;
  }

  const favBtn = document.getElementById('favBtn');
  const favIcon = document.getElementById('favIcon');
  if (favBtn && favIcon) {
    const updateFavBtn = (active) => {
      favIcon.setAttribute('fill', active ? 'var(--accent-red)' : 'none');
      favIcon.setAttribute('stroke', active ? 'var(--accent-red)' : 'currentColor');
      favBtn.classList.toggle('fav-btn--active', active);
    };
    updateFavBtn(isFavorite(id));
    favBtn.addEventListener('click', () => updateFavBtn(toggleFavorite(id)));
  }

  const movies = unwrapList(allMovies);
  if (movies.length) {
    const idx = movies.findIndex((m) => Number(m.id) === id);
    const prev = idx > 0 ? movies[idx - 1] : null;
    const next = idx < movies.length - 1 ? movies[idx + 1] : null;
    const navPrev = document.getElementById('navPrev');
    const navNext = document.getElementById('navNext');
    if (navPrev && prev) {
      navPrev.href = `detail.html?id=${prev.id}`;
      setText('prevTitle', prev.title_vi);
    } else if (navPrev) { navPrev.style.opacity = '0.3'; navPrev.style.pointerEvents = 'none'; }
    if (navNext && next) {
      navNext.href = `detail.html?id=${next.id}`;
      setText('nextTitle', next.title_vi);
    } else if (navNext) { navNext.style.opacity = '0.3'; navNext.style.pointerEvents = 'none'; }
  }

  document.getElementById('shareCopy')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast('✅ Đã sao chép link!', 'success');
    } catch {
      showToast('Không thể sao chép');
    }
  });

  const meData = await apiGet('auth/me');
  const userRole = meData?.user?.role ?? 'user';
  const isEditor = ['editor', 'admin'].includes(userRole);

  initTrailer(movie.trailer_url, isEditor);
  initExternalLinks(movie.wiki_url, movie.streaming_url, isEditor);
  initWikiEdit(movie, isEditor);

  if (isEditor) {
    initUpload(id);
    initTrailerEdit(id, movie.trailer_url);
    initExternalLinksEdit(id, movie.wiki_url, movie.streaming_url);
  }

  initComments(id, meData?.user ?? null);
}
