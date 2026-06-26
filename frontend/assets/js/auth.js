// ============================================
// auth.js — Navigation auth dropdown
// ============================================

async function initAuthNav() {
  const authBtn = document.getElementById('navAuthBtn');
  const authPanel = document.getElementById('navAuthPanel');
  if (!authBtn || !authPanel) return;

  const res = await apiGet('auth/me');
  const user = res?.user ?? null;

  if (!user) {
    authBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
      <span>ĐĂNG NHẬP</span>
      <svg class="nav__auth-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    `;
    authPanel.innerHTML = `
      <div class="nav__auth-hint">Chưa có tài khoản?</div>
      <a href="register.html" class="nav__auth-action nav__auth-action--primary">TẠO TÀI KHOẢN</a>
      <a href="login.html" class="nav__auth-action nav__auth-action--secondary">ĐĂNG NHẬP</a>
    `;
  } else {
    const initials = escapeHtml(user.username).charAt(0).toUpperCase();
    const favCount = getFavorites().length;
    authBtn.innerHTML = `
      <div class="nav__auth-avatar">${initials}</div>
      <span class="nav__auth-username">${escapeHtml(user.username)}</span>
      <svg class="nav__auth-caret" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    `;
    const adminLink = user.role === 'admin'
      ? `<a href="admin.html" class="nav__auth-action nav__auth-action--secondary" style="border-color:var(--accent-yellow); color:var(--accent-yellow);">${typeof ICONS !== 'undefined' ? ICONS.key : '🔑'} Quản trị viên</a>`
      : '';
    authPanel.innerHTML = `
      <div class="nav__auth-hint">Xin chào, <strong>${escapeHtml(user.username)}</strong></div>
      <a href="favorites.html" class="nav__auth-action nav__auth-action--fav">${typeof ICONS !== 'undefined' ? ICONS.heartFilled : '❤️'} Yêu thích (${favCount})</a>
      ${adminLink}
      <button id="logoutLink" class="nav__auth-action nav__auth-action--logout">ĐĂNG XUẤT</button>
    `;
    document.getElementById('logoutLink')?.addEventListener('click', async () => {
      await apiPost('auth/logout', {});
      showToast('Đã đăng xuất!');
      setTimeout(() => { location.href = 'index.html'; }, 600);
    });
  }

  authBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = authPanel.classList.toggle('open');
    authBtn.setAttribute('aria-expanded', open);
    authBtn.classList.toggle('active', open);
  });

  document.addEventListener('click', (e) => {
    if (!authBtn.contains(e.target) && !authPanel.contains(e.target)) {
      authPanel.classList.remove('open');
      authBtn.classList.remove('active');
      authBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
