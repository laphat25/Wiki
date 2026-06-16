// ============================================
// comments.js — Comment section
// ============================================

function buildCommentCard(c, currentUser) {
  const displayName = c.name || c.username || '?';
  const initial = displayName.charAt(0).toUpperCase();
  const canDelete = currentUser && (
    currentUser.role === 'admin' || currentUser.id === c.user_id
  );

  const ratingStars = c.rating
    ? `<span class="comment-stars" title="${c.rating} sao">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</span>`
    : '';

  const emailText = c.email
    ? `<span class="comment-email">(${escapeHtml(c.email)})</span>`
    : '';

  return `
    <div class="comment-card" id="comment-${c.id}" data-comment-id="${c.id}">
      <div class="comment-avatar">${escapeHtml(initial)}</div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-username">${escapeHtml(displayName)}</span>
          ${emailText}
          ${ratingStars}
          <span class="comment-time">${timeAgo(c.created_at)}</span>
          ${canDelete ? `<button class="comment-delete-btn" data-id="${c.id}" title="Xoá bình luận">✕</button>` : ''}
        </div>
        <div class="comment-text">${escapeHtml(c.body)}</div>
      </div>
    </div>
  `;
}

async function initComments(movieId, currentUser) {
  const list = document.getElementById('commentsList');
  const formWrap = document.getElementById('commentFormWrap');
  const emptyEl = document.getElementById('commentsEmpty');
  const countEl = document.getElementById('commentsCount');
  if (!list || !formWrap) return;

  if (currentUser) {
    const initial = currentUser.username.charAt(0).toUpperCase();
    formWrap.innerHTML = `
      <div class="comment-form">
        <div class="comment-form-avatar">${escapeHtml(initial)}</div>
        <div class="comment-form-right">
          
          <div class="comment-meta-inputs" style="display: flex; gap: var(--space-3); margin-bottom: var(--space-3);">
            <div style="flex: 1;">
              <input type="text" id="commentNameInput" class="trailer-url-input" placeholder="Họ tên của bạn" required />
            </div>
            <div style="flex: 1;">
              <input type="email" id="commentEmailInput" class="trailer-url-input" placeholder="Email liên hệ" required />
            </div>
          </div>

          <div class="comment-rating-select">
            <span class="rating-label">Đánh giá:</span>
            <div class="stars-picker" id="starsPicker">
              <span class="star-picker-item" data-value="1">★</span>
              <span class="star-picker-item" data-value="2">★</span>
              <span class="star-picker-item" data-value="3">★</span>
              <span class="star-picker-item" data-value="4">★</span>
              <span class="star-picker-item" data-value="5">★</span>
            </div>
            <input type="hidden" id="commentRatingValue" value="" />
          </div>

          <textarea id="commentTextarea" class="comment-textarea"
            placeholder="Viết bình luận về phim này..." rows="3" maxlength="1000"></textarea>
          <div class="comment-form-footer">
            <span class="comment-char-count" id="charCount">0 / 1000</span>
            <button class="comment-submit-btn" id="commentSubmitBtn">Gửi</button>
          </div>
        </div>
      </div>
    `;

    const nameInput = document.getElementById('commentNameInput');
    const emailInput = document.getElementById('commentEmailInput');
    if (nameInput) nameInput.value = currentUser.username || '';
    if (emailInput) emailInput.value = currentUser.email || '';

    // Star picker interactive logic
    const starsPicker = document.getElementById('starsPicker');
    const ratingValueInput = document.getElementById('commentRatingValue');
    const starItems = starsPicker?.querySelectorAll('.star-picker-item');

    starItems?.forEach(item => {
      item.addEventListener('click', () => {
        const val = item.dataset.value;
        ratingValueInput.value = val;
        
        starItems.forEach(star => {
          const starVal = star.dataset.value;
          if (parseInt(starVal, 10) <= parseInt(val, 10)) {
            star.classList.add('active');
          } else {
            star.classList.remove('active');
          }
        });
      });
    });

    const textarea = document.getElementById('commentTextarea');
    const submitBtn = document.getElementById('commentSubmitBtn');
    const charCount = document.getElementById('charCount');

    textarea?.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = `${len} / 1000`;
      charCount.style.color = len > 900 ? 'var(--accent-red)' : '';
    });

    submitBtn?.addEventListener('click', async () => {
      const body = textarea.value.trim();
      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const rating = ratingValueInput?.value || null;

      if (!name) { showToast('Vui lòng nhập họ tên của bạn', 'error'); return; }
      if (!email) { showToast('Vui lòng nhập email liên hệ', 'error'); return; }
      if (!body) { showToast('Vui lòng nhập nội dung bình luận', 'error'); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';

      const res = await apiPost('comments', { movie_id: movieId, body, name, email, rating });
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gửi';

      if (res?.success && res.comment) {
        textarea.value = '';
        charCount.textContent = '0 / 1000';
        ratingValueInput.value = '';
        starItems?.forEach(star => star.classList.remove('active'));

        if (emptyEl) emptyEl.style.display = 'none';
        list.querySelectorAll('.comment-skeleton').forEach((s) => s.remove());

        const newCard = document.createElement('div');
        newCard.innerHTML = buildCommentCard(res.comment, currentUser);
        const card = newCard.firstElementChild;
        card.classList.add('comment-new');
        list.prepend(card);

        const cur = parseInt(countEl?.textContent || '0', 10) || 0;
        if (countEl) countEl.textContent = cur + 1;

        card.querySelector('.comment-delete-btn')
          ?.addEventListener('click', () => handleDeleteComment(res.comment.id, currentUser, list, countEl, emptyEl));
        showToast('✅ Đã gửi bình luận!', 'success');
      } else {
        showToast('❌ ' + (res?.error || 'Không thể gửi bình luận'), 'error');
      }
    });
  } else {
    formWrap.innerHTML = `
      <div class="comment-login-prompt">
        <span>Bạn cần <a href="login.html">đăng nhập</a> để bình luận</span>
      </div>
    `;
  }


  const commentsRes = await apiGet(`comments?movie_id=${movieId}&page=1&limit=50`);
  const comments = Array.isArray(commentsRes) ? commentsRes : (commentsRes?.data || []);

  list.innerHTML = '';

  if (!comments.length) {
    if (emptyEl) emptyEl.style.display = '';
    if (countEl) countEl.textContent = '0';
    return;
  }

  const total = commentsRes?.pagination?.total ?? comments.length;
  if (countEl) countEl.textContent = total;
  if (emptyEl) emptyEl.style.display = 'none';

  list.innerHTML = comments.map((c) => buildCommentCard(c, currentUser)).join('');

  list.querySelectorAll('.comment-delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleDeleteComment(
      parseInt(btn.dataset.id, 10), currentUser, list, countEl, emptyEl
    ));
  });
}

async function handleDeleteComment(commentId, currentUser, list, countEl, emptyEl) {
  if (!confirm('Xoá bình luận này?')) return;

  const res = await apiDelete(`comments/${commentId}`);

  if (res?.success) {
    const card = document.getElementById(`comment-${commentId}`);
    card?.classList.add('comment-removing');
    setTimeout(() => {
      card?.remove();
      const remaining = list.querySelectorAll('.comment-card').length;
      if (countEl) countEl.textContent = remaining;
      if (remaining === 0 && emptyEl) emptyEl.style.display = '';
    }, 350);
    showToast('Đã xoá bình luận');
  } else {
    showToast('❌ ' + (res?.error || 'Không thể xoá'), 'error');
  }
}
