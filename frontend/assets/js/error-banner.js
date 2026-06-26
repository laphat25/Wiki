// ============================================
// error-banner.js — Global API offline banner
// ============================================

function initErrorBanner() {
  let banner = document.getElementById('apiErrorBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'apiErrorBanner';
    banner.className = 'api-error-banner';
    banner.innerHTML = `
      <span>${typeof ICONS !== 'undefined' ? ICONS.alertTriangle : '⚠️'} Không thể kết nối máy chủ. Kiểm tra backend đang chạy tại <strong>/api/health</strong>.</span>
      <button type="button" class="api-error-banner__close" aria-label="Đóng">✕</button>
    `;
    document.body.prepend(banner);
    banner.querySelector('.api-error-banner__close')?.addEventListener('click', () => {
      banner.classList.remove('api-error-banner--visible');
    });
  }

  function show() {
    banner.classList.add('api-error-banner--visible');
  }

  window.addEventListener('api:offline', show);
  window.addEventListener('api:error', (e) => {
    if (e.detail?.status >= 500) show();
  });

  checkApiHealth().then((ok) => {
    if (!ok) show();
  });
}
