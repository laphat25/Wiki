// ============================================
// pages/register.js
// ============================================

async function initRegisterPage() {
  initNavSearch();
  const form = document.getElementById('registerForm');
  const errEl = document.getElementById('authError');
  if (!form) return;

  const me = await apiGet('auth/me');
  if (me?.user) { location.href = 'index.html'; return; }

  const submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errEl) errEl.textContent = '';

    const username = form.elements['username']?.value?.trim();
    const email = form.elements['email']?.value?.trim();
    const password = form.elements['password']?.value || '';
    const confirmPassword = form.elements['confirmPassword']?.value || '';

    if (!username || !email || !password) {
      if (errEl) errEl.textContent = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }
    if (password !== confirmPassword) {
      if (errEl) errEl.textContent = 'Mật khẩu xác nhận không khớp.';
      return;
    }
    if (password.length < 8) {
      if (errEl) errEl.textContent = 'Mật khẩu phải có ít nhất 8 ký tự.';
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Đang đăng ký...'; }
    const res = await apiPost('auth/register', { username, email, password });
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Đăng ký'; }

    if (!res || res.error) {
      if (errEl) errEl.textContent = res?.error || 'Đăng ký thất bại.';
      return;
    }
    showToast('Đăng ký thành công!', 'success');
    setTimeout(() => { location.href = 'login.html'; }, 800);
  });
}
