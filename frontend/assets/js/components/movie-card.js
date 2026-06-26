// ============================================
// components/movie-card.js — Reusable movie card renderers
// ============================================

const DIRECTOR_ERA = {
  'Tsutomu Shibayama': { color: '#22D3EE', label: 'Era Shibayama' },
  'Kozo Kusuba': { color: '#A855F7', label: 'Era Kusuba' },
  'Yoshio Takeuchi': { color: '#F59E0B', label: 'Era Takeuchi' },
  'Kazuaki Imai': { color: '#10B981', label: 'Era Imai' },
  'Shinnosuke Yakuwa': { color: '#EF4444', label: 'Era Yakuwa' },
  'Takumi Dohi': { color: '#F97316', label: 'Era Dohi' },
  'Yukiyo Teramoto': { color: '#EC4899', label: 'Era Teramoto' },
};

function getEraDecade(year) {
  const y = parseInt(year, 10);
  if (y < 1990) return '1980';
  if (y < 2000) return '1990';
  if (y < 2010) return '2000';
  return '2010';
}

function renderGadgetCard(m) {
  const fav = isFavorite(m.id);
  const resolvedImg = typeof window.resolveImageUrl === 'function' ? window.resolveImageUrl(m.image_url) : m.image_url;
  const bg = resolvedImg ? `background:url(${escapeHtml(resolvedImg)}) center/cover no-repeat;` : '';
  return `
    <a href="detail.html?id=${m.id}" class="gadget-card gadget-card--movie">
      <div class="gadget-card__img" style="${bg}">
        ${!resolvedImg ? ICONS.film : ''}
        ${fav ? '<span class="gadget-card__fav-badge">' + ICONS.heartFilled + '</span>' : ''}
      </div>
      <div class="gadget-card__body">
        <div class="gadget-card__name">${escapeHtml(m.title_vi)}</div>
        <div class="gadget-card__desc">${escapeHtml(m.title_jp || '')}</div>
        <div class="gadget-card__footer">
          <span class="badge badge--yellow">${escapeHtml(String(m.release_year))}</span>
          <span class="gadget-card__episode">${escapeHtml(m.director || '—')}</span>
        </div>
      </div>
    </a>
  `;
}

function renderMovieCard(m) {
  const fav = isFavorite(m.id);
  const era = DIRECTOR_ERA[m.director] || { color: '#94A3B8', label: m.director };
  const resolvedImg = typeof window.resolveImageUrl === 'function' ? window.resolveImageUrl(m.image_url) : m.image_url;
  const bg = resolvedImg ? `background:url(${escapeHtml(resolvedImg)}) center/cover;` : '';
  return `
    <a href="detail.html?id=${m.id}" class="movie-card" data-era="${getEraDecade(m.release_year)}" data-id="${m.id}">
      <div class="movie-card__poster" style="${bg}">
        ${!resolvedImg ? '<div class="movie-card__poster-emoji">' + ICONS.filmLg + '</div>' : ''}
        <div class="movie-card__year-badge">${m.release_year}</div>
        ${fav ? '<div class="movie-card__fav">' + ICONS.heartFilled + '</div>' : ''}
      </div>
      <div class="movie-card__body">
        <div class="movie-card__num">#${m.id}</div>
        <div class="movie-card__title">${escapeHtml(m.title_vi)}</div>
        <div class="movie-card__jp">${escapeHtml(m.title_jp || '')}</div>
        <div class="movie-card__footer">
          <span class="movie-card__era" style="--era-color:${era.color}">${era.label}</span>
        </div>
      </div>
    </a>
  `;
}

function renderMovieRow(m) {
  const fav = isFavorite(m.id);
  return `
    <tr style="cursor:pointer" onclick="location.href='detail.html?id=${m.id}'">
      <td>${m.id}</td>
      <td>
        <div class="movie-title-vi">${escapeHtml(m.title_vi)} ${fav ? ICONS.heartFilled : ''}</div>
        ${m.title_jp ? `<div class="movie-title-jp">${escapeHtml(m.title_jp)}</div>` : ''}
      </td>
      <td><span class="movie-year">${m.release_year}</span></td>
      <td class="movie-date">${escapeHtml(m.release_date || '—')}</td>
      <td class="movie-director">${escapeHtml(m.director || '—')}</td>
      <td><span style="color:var(--text-muted);font-size:12px">${ICONS.arrowRight}</span></td>
    </tr>
  `;
}
