// ============================================
// pages/login.js
// ============================================

async function initLoginPage() {
  initNavSearch();
  const form = document.getElementById('loginForm');
  const errEl = document.getElementById('authError');
  if (!form) return;

  const me = await apiGet('auth/me');
  if (me?.user) { location.href = 'index.html'; return; }

  const submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errEl) errEl.textContent = '';

    const usernameOrEmail = form.elements['usernameOrEmail']?.value?.trim();
    const password = form.elements['password']?.value || '';

    if (!usernameOrEmail || !password) {
      if (errEl) errEl.textContent = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Đang đăng nhập...'; }
    const res = await apiPost('auth/login', { usernameOrEmail, password });
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Đăng nhập'; }

    if (!res || res.error) {
      if (errEl) errEl.textContent = res?.error || 'Đăng nhập thất bại.';
      return;
    }
    showToast('Đăng nhập thành công!', 'success');
    setTimeout(() => { location.href = 'index.html'; }, 500);
  });
}
