// ============================================
// pages/home.js
// ============================================

async function initHomePage() {
  initNavSearch();
  initPromoPopup();
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  grid.innerHTML = Array(6).fill(`
    <div class="gadget-card gadget-card--skeleton" aria-hidden="true">
      <div class="gadget-card__img"></div>
      <div class="gadget-card__body">
        <div class="sk-line sk-line--80"></div>
        <div class="sk-line sk-line--50"></div>
      </div>
    </div>
  `).join('');

  const featured = unwrapList(await apiGet('movies?featured=true'));
  const allMovies = unwrapList(await apiGet('movies'));

  if (!featured.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = featured.map((m) => renderGadgetCard(m)).join('');
  setText('moviesCount', allMovies.length || featured.length);
}

function initPromoPopup() {
  const popup = document.getElementById('adPopup');
  const closeBtn = document.getElementById('adPopupClose');
  const overlay = document.getElementById('adPopupOverlay');
  if (!popup) return;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  if (getCookie('doraemon_ad_popup_closed') === 'true') {
    return;
  }

  // Kích hoạt sau 1 phút (60.000 ms)
  setTimeout(() => {
    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
  }, 60000);

  const closePopup = () => {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    // Lưu cookie hết hạn sau 24h
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `doraemon_ad_popup_closed=true; expires=${date.toUTCString()}; path=/`;
  };

  closeBtn?.addEventListener('click', closePopup);
  overlay?.addEventListener('click', closePopup);
}

