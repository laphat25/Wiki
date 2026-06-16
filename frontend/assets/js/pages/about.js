// ============================================
// pages/about.js
// ============================================

async function initAboutPage() {
  initNavSearch();

  const form = document.getElementById('feedbackForm');
  const nameInput = document.getElementById('fbName');
  const emailInput = document.getElementById('fbEmail');
  const submitBtn = document.getElementById('fbSubmitBtn');

  if (!form) return;

  // Prefill user session if logged in
  const res = await apiGet('auth/me');
  const user = res?.user ?? null;
  if (user) {
    if (nameInput) nameInput.value = user.username;
    if (emailInput) emailInput.value = user.email || '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = document.getElementById('fbSubject').value.trim();
    const message = document.getElementById('fbMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Vui lòng nhập đầy đủ tất cả các trường', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Đang gửi góp ý...';

    const payload = { name, email, subject, message };
    const response = await apiPost('feedbacks', payload);

    submitBtn.disabled = false;
    submitBtn.textContent = '🚀 Gửi Góp Ý';

    if (response?.success) {
      showToast('✅ Gửi góp ý thành công! Trân trọng cảm ơn bạn.', 'success');
      form.reset();
      // Keep username prefilled after reset
      if (user) {
        if (nameInput) nameInput.value = user.username;
        if (emailInput) emailInput.value = user.email || '';
      }
    } else {
      showToast('❌ Gửi thất bại: ' + (response?.error || 'Lỗi hệ thống'), 'error');
    }
  });
}
