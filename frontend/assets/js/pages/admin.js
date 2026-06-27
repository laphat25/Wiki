// ============================================
// pages/admin.js
// ============================================

async function initAdminPage() {
  initNavSearch();

  // 1. Auth Guard: Check if user is Admin
  const authRes = await apiGet('auth/me');
  const user = authRes?.user ?? null;

  if (!user || user.role !== 'admin') {
    showToast('Bạn không có quyền truy cập trang quản trị!', 'error');
    setTimeout(() => {
      location.href = 'index.html';
    }, 1500);
    return;
  }

  // 2. Fetch and render dashboard data
  await loadAdminStats();
  await loadAdminComments();
  await loadAdminMovies();

  // Tự động làm mới thống kê mỗi 10 giây
  setInterval(async () => {
    await loadAdminStats();
  }, 10000);

  // 3. Setup tabs
  setupAdminTabs();

  // 4. Setup modal listeners
  setupMovieEditorModal();
}

async function loadAdminStats() {
  const stats = await apiGet('admin/stats');
  if (stats && !stats.error) {
    setText('statViews', stats.total_views || 0);
    setText('statComments', stats.total_comments || 0);
    setText('statMovies', stats.total_movies || 0);
  }
}

async function loadAdminComments() {
  const tbody = document.getElementById('adminCommentsBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">Đang tải danh sách bình luận...</td></tr>';

  const res = await apiGet('admin/comments');
  const comments = res?.comments || [];

  if (!comments.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">' + (typeof ICONS !== 'undefined' ? ICONS.messageCircle + ' ' : '') + 'Chưa có bình luận nào trên hệ thống.</td></tr>';
    return;
  }

  tbody.innerHTML = comments.map(c => {
    const starText = c.rating ? '★'.repeat(c.rating) : '—';
    const commenterName = c.name || c.username || 'Ẩn danh';
    const emailText = c.email || '—';
    return `
      <tr id="admin-comment-row-${c.id}">
        <td style="font-weight: 600;">${escapeHtml(c.movie_title || 'Phim #' + c.movie_id)}</td>
        <td>${escapeHtml(commenterName)}</td>
        <td><span style="font-family: monospace; opacity: 0.8;">${escapeHtml(emailText)}</span></td>
        <td style="color: var(--accent-yellow);">${escapeHtml(starText)}</td>
        <td>${escapeHtml(c.body)}</td>
        <td><span style="color:var(--text-muted); font-size:11px;">${timeAgo(c.created_at)}</span></td>
        <td>
          <button class="admin-btn-sm admin-btn-delete" data-id="${c.id}">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');

  // Delete listener
  tbody.querySelectorAll('.admin-btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('Bạn có chắc chắn muốn xóa bình luận này khỏi hệ thống?')) return;

      btn.disabled = true;
      btn.textContent = '...';

      const delRes = await apiDelete(`comments/${id}`);
      if (delRes?.success) {
        showToast('Đã xóa bình luận thành công!');
        document.getElementById(`admin-comment-row-${id}`)?.remove();
        // Update stats counter
        const curComments = parseInt(document.getElementById('statComments').textContent, 10) || 0;
        setText('statComments', Math.max(0, curComments - 1));
      } else {
        btn.disabled = false;
        btn.textContent = 'Xóa';
        showToast(delRes?.error || 'Lỗi', 'error');
      }
    });
  });
}

async function loadAdminMovies() {
  const tbody = document.getElementById('adminMoviesBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">Đang tải danh sách phim dài...</td></tr>';

  const movies = unwrapList(await apiGet('movies'));

  if (!movies.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">' + (typeof ICONS !== 'undefined' ? ICONS.film + ' ' : '') + 'Không có dữ liệu phim.</td></tr>';
    return;
  }

  tbody.innerHTML = movies.map(m => {
    return `
      <tr id="admin-movie-row-${m.id}">
        <td>${m.id}</td>
        <td style="font-weight: 600;">${escapeHtml(m.title_vi)}</td>
        <td style="font-style: italic; color:var(--text-muted);">${escapeHtml(m.title_jp || '—')}</td>
        <td>${m.release_year}</td>
        <td>${escapeHtml(m.director || '—')}</td>
        <td>
          <button class="admin-btn-sm admin-btn-edit" data-id="${m.id}">Sửa</button>
          <button class="admin-btn-sm admin-btn-delete admin-movie-delete" data-id="${m.id}" style="margin-right: 5px;">Xóa</button>
          <a href="detail.html?id=${m.id}" target="_blank" class="admin-btn-sm" style="background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.15); color:white;">Xem</a>
        </td>
      </tr>
    `;
  }).join('');

  // Edit listener
  tbody.querySelectorAll('.admin-btn-edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      openMovieEditor(id);
    });
  });

  // Delete listener
  tbody.querySelectorAll('.admin-movie-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('Bạn có chắc chắn muốn xóa bộ phim này khỏi hệ thống? Tất cả bình luận liên quan cũng sẽ bị xóa.')) return;

      btn.disabled = true;
      btn.textContent = '...';

      const delRes = await apiDelete(`movies/${id}`);
      if (delRes?.success) {
        showToast('Đã xóa phim thành công!', 'success');
        document.getElementById(`admin-movie-row-${id}`)?.remove();
        // Update stats counter
        const curMovies = parseInt(document.getElementById('statMovies').textContent, 10) || 0;
        setText('statMovies', Math.max(0, curMovies - 1));
      } else {
        btn.disabled = false;
        btn.textContent = 'Xóa';
        showToast(delRes?.error || 'Lỗi', 'error');
      }
    });
  });
}


function setupAdminTabs() {
  const tabCommentsBtn = document.getElementById('tabCommentsBtn');
  const tabMoviesBtn = document.getElementById('tabMoviesBtn');
  const tabCommentsContent = document.getElementById('tabCommentsContent');
  const tabMoviesContent = document.getElementById('tabMoviesContent');

  if (!tabCommentsBtn || !tabMoviesBtn) return;

  tabCommentsBtn.addEventListener('click', () => {
    tabCommentsBtn.classList.add('active');
    tabMoviesBtn.classList.remove('active');
    tabCommentsContent.style.display = '';
    tabMoviesContent.style.display = 'none';
  });

  tabMoviesBtn.addEventListener('click', () => {
    tabMoviesBtn.classList.add('active');
    tabCommentsBtn.classList.remove('active');
    tabMoviesContent.style.display = '';
    tabCommentsContent.style.display = 'none';
  });
}

// Edit Modal Functions
let currentEditingMovieId = null;

async function openMovieEditor(movieId) {
  const modal = document.getElementById('editMovieModal');
  if (!modal) return;

  const modalTitle = modal.querySelector('h2');
  if (modalTitle) modalTitle.textContent = 'Chỉnh Sửa Thông Tin Phim';

  // Load movie detail
  const res = await apiGet(`movies/${movieId}`);
  if (!res || res.error) {
    showToast('Không thể tải thông tin chi tiết phim!', 'error');
    return;
  }

  const m = res;
  currentEditingMovieId = movieId;

  document.getElementById('editMovieId').value = m.id;
  document.getElementById('editTitleVi').value = m.title_vi || '';
  document.getElementById('editTitleJp').value = m.title_jp || '';
  document.getElementById('editReleaseYear').value = m.release_year || '';
  document.getElementById('editReleaseDate').value = m.release_date || '';
  document.getElementById('editDirector').value = m.director || '';
  document.getElementById('editBoxOffice').value = m.box_office || '';
  document.getElementById('editThemeSong').value = m.theme_song || '';
  document.getElementById('editPlot').value = m.plot || '';
  document.getElementById('editIsFeatured').checked = Boolean(m.is_featured);

  // Reset file input
  const fileInput = document.getElementById('adminMoviePosterInput');
  if (fileInput) fileInput.value = '';

  const feedback = document.getElementById('adminPosterFeedback');
  if (feedback) feedback.style.display = 'none';

  // Image Preview
  const preview = document.getElementById('adminMoviePosterPreview');
  if (preview) {
    if (m.image_url) {
      const resolvedImg = typeof window.resolveImageUrl === 'function' ? window.resolveImageUrl(m.image_url) : m.image_url;
      preview.style.backgroundImage = `url(${resolvedImg})`;
      preview.textContent = '';
    } else {
      preview.style.backgroundImage = '';
      preview.textContent = 'No Poster';
    }
  }

  modal.classList.add('open');
}

function setupMovieEditorModal() {
  const modal = document.getElementById('editMovieModal');
  const cancelBtn = document.getElementById('editMovieCancel');
  const overlay = document.getElementById('editModalOverlay');
  const form = document.getElementById('editMovieForm');
  const submitBtn = document.getElementById('editMovieSubmit');
  const addBtn = document.getElementById('adminAddMovieBtn');
  const fileInput = document.getElementById('adminMoviePosterInput');
  const preview = document.getElementById('adminMoviePosterPreview');
  const feedback = document.getElementById('adminPosterFeedback');

  if (!modal || !form) return;

  const closeModal = () => {
    modal.classList.remove('open');
    currentEditingMovieId = null;
  };

  cancelBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // Local File Input Change listener to update preview immediately
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file && preview) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(file.type)) {
        if (feedback) {
          feedback.textContent = 'Chỉ hỗ trợ file ảnh (JPG, PNG, WebP, GIF)';
          feedback.style.color = 'var(--accent-red)';
          feedback.style.display = '';
        }
        fileInput.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        if (feedback) {
          feedback.textContent = 'File quá dung lượng cho phép (tối đa 2MB)';
          feedback.style.color = 'var(--accent-red)';
          feedback.style.display = '';
        }
        fileInput.value = '';
        return;
      }

      if (feedback) feedback.style.display = 'none';

      const reader = new FileReader();
      reader.onload = (e) => {
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.textContent = '';
      };
      reader.readAsDataURL(file);
    }
  });

  addBtn?.addEventListener('click', () => {
    currentEditingMovieId = null;
    document.getElementById('editMovieId').value = '';
    document.getElementById('editTitleVi').value = '';
    document.getElementById('editTitleJp').value = '';
    document.getElementById('editReleaseYear').value = '';
    document.getElementById('editReleaseDate').value = '';
    document.getElementById('editDirector').value = '';
    document.getElementById('editBoxOffice').value = '';
    document.getElementById('editThemeSong').value = '';
    document.getElementById('editPlot').value = '';
    document.getElementById('editIsFeatured').checked = false;

    if (fileInput) fileInput.value = '';
    if (preview) {
      preview.style.backgroundImage = '';
      preview.textContent = 'No Poster';
    }
    if (feedback) feedback.style.display = 'none';

    const modalTitle = modal.querySelector('h2');
    if (modalTitle) modalTitle.textContent = 'Thêm Phim Mới';

    modal.classList.add('open');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang lưu...';

    const payload = {
      title_vi: document.getElementById('editTitleVi').value.trim(),
      title_jp: document.getElementById('editTitleJp').value.trim(),
      release_year: parseInt(document.getElementById('editReleaseYear').value, 10),
      release_date: document.getElementById('editReleaseDate').value.trim(),
      director: document.getElementById('editDirector').value.trim(),
      box_office: document.getElementById('editBoxOffice').value.trim(),
      theme_song: document.getElementById('editThemeSong').value.trim(),
      plot: document.getElementById('editPlot').value.trim(),
      is_featured: document.getElementById('editIsFeatured').checked
    };

    let response;
    if (currentEditingMovieId) {
      response = await apiPut(`movies/${currentEditingMovieId}`, payload);
    } else {
      response = await apiPost('movies', payload);
    }

    if (response?.success) {
      const activeMovieId = currentEditingMovieId || response.movie?.id;
      const file = fileInput?.files?.[0];

      if (activeMovieId && file) {
        submitBtn.textContent = 'Đang tải poster...';
        const formData = new FormData();
        formData.append('movie_id', activeMovieId);
        formData.append('image', file);

        try {
          const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST', credentials: 'include', body: formData,
          });
          const uploadData = await uploadRes.json();
          if (!uploadData.success) {
            showToast('Lưu phim thành công nhưng không thể upload poster: ' + (uploadData.error || ''), 'warning');
          }
        } catch (uploadErr) {
          console.error(uploadErr);
          showToast('Lưu phim thành công nhưng không thể upload poster do lỗi mạng', 'warning');
        }
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Lưu Thay Đổi';

      showToast(currentEditingMovieId ? 'Đã cập nhật phim dài thành công!' : 'Đã thêm phim mới thành công!', 'success');
      closeModal();
      // Reload lists
      await loadAdminMovies();
      await loadAdminStats();
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Lưu Thay Đổi';
      showToast('Lỗi: ' + (response?.error || 'Không thể lưu'), 'error');
    }
  });
}
