// ============================================
// editor.js — Editor/admin tools on detail page
// ============================================

function initTrailer(videoId, isEditor = false) {
  const section = document.getElementById('trailer-section');
  const wrap = document.getElementById('trailerWrap');
  const thumb = document.getElementById('trailerThumb');
  const playBtn = document.getElementById('trailerPlayBtn');
  const iframeWrap = document.getElementById('trailerIframeWrap');

  if (!section) return;

  if (!videoId) {
    if (isEditor) section.style.display = '';
    if (wrap) wrap.style.display = 'none';
    return;
  }

  section.style.display = '';
  if (wrap) wrap.style.display = '';
  if (thumb) thumb.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;

  playBtn?.addEventListener('click', () => {
    playBtn.style.display = 'none';
    iframeWrap.style.display = '';
    iframeWrap.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
        title="Trailer YouTube" frameborder="0" allowfullscreen></iframe>
    `;
  });
}

function initExternalLinks(wikiUrl, streamingUrl, isEditor = false) {
  const section = document.getElementById('externalLinks');
  const wikiBtn = document.getElementById('wikiBtn');
  const streamBtn = document.getElementById('streamBtn');
  let hasAny = false;

  if (wikiUrl && wikiBtn) { wikiBtn.href = wikiUrl; wikiBtn.style.display = ''; hasAny = true; }
  if (streamingUrl && streamBtn) { streamBtn.href = streamingUrl; streamBtn.style.display = ''; hasAny = true; }
  if ((hasAny || isEditor) && section) section.style.display = '';
}

function initExternalLinksEdit(movieId, wikiUrl, streamingUrl) {
  const editBtn = document.getElementById('extEditBtn');
  const editForm = document.getElementById('extEditForm');
  const wikiInput = document.getElementById('extWikiInput');
  const streamInput = document.getElementById('extStreamInput');
  const saveBtn = document.getElementById('extSaveBtn');
  const cancelBtn = document.getElementById('extCancelBtn');
  const wikiBtn = document.getElementById('wikiBtn');
  const streamBtn = document.getElementById('streamBtn');
  const editBtnText = editBtn?.querySelector('.ext-edit-btn-text');

  if (!editBtn || !editForm) return;

  editBtn.style.display = '';

  function setEditFormOpen(isOpen) {
    editForm.style.display = isOpen ? '' : 'none';
    editBtn.classList.toggle('is-open', isOpen);
    if (editBtnText) editBtnText.textContent = isOpen ? 'Đóng' : 'Sửa';
    if (isOpen) {
      wikiInput.value = wikiUrl || '';
      streamInput.value = streamingUrl || '';
      wikiInput.focus();
    }
  }

  setEditFormOpen(false);
  editBtn.addEventListener('click', () => setEditFormOpen(!editBtn.classList.contains('is-open')));
  cancelBtn?.addEventListener('click', () => setEditFormOpen(false));

  saveBtn?.addEventListener('click', async () => {
    const newWiki = wikiInput.value.trim();
    const newStream = streamInput.value.trim();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Đang lưu...';

    const [resWiki, resStream] = await Promise.all([
      apiPatch(`movies/${movieId}/update`, { field: 'wiki_url', value: newWiki }),
      apiPatch(`movies/${movieId}/update`, { field: 'streaming_url', value: newStream }),
    ]);

    saveBtn.disabled = false;
    saveBtn.textContent = 'Lưu thay đổi';

    if (resWiki?.success || resStream?.success) {
      wikiUrl = newWiki;
      streamingUrl = newStream;
      setEditFormOpen(false);
      if (newWiki) { wikiBtn.href = newWiki; wikiBtn.style.display = ''; }
      else wikiBtn.style.display = 'none';
      if (newStream) { streamBtn.href = newStream; streamBtn.style.display = ''; }
      else streamBtn.style.display = 'none';
      showToast('Liên kết đã được cập nhật!', 'success');
    } else {
      showToast(resWiki?.error || resStream?.error || 'Lỗi', 'error');
    }
  });
}

function initUpload(movieId) {
  const overlay = document.getElementById('infoUploadOverlay');
  const input = document.getElementById('uploadInput');
  const feedback = document.getElementById('uploadFeedback');
  const infoImg = document.getElementById('info-img');
  if (!overlay || !input) return;

  overlay.style.display = '';

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { showFb('error', 'Chỉ nhận JPG, PNG, WebP, GIF'); return; }
    if (file.size > 2 * 1024 * 1024) { showFb('error', 'Tối đa 2MB'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (infoImg) {
        infoImg.style.backgroundImage = `url(${e.target.result})`;
        infoImg.classList.remove('no-poster');
      }
    };
    reader.readAsDataURL(file);

    showFb('loading', 'Đang lưu...');
    const formData = new FormData();
    formData.append('movie_id', movieId);
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST', credentials: 'include', body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const resolved = typeof window.resolveImageUrl === 'function' ? window.resolveImageUrl(data.url) : data.url;
        if (infoImg) infoImg.style.backgroundImage = `url(${resolved}?t=${Date.now()})`;
        showFb('success', 'Đã lưu ảnh bìa!');
        showToast('Ảnh bìa đã được cập nhật!', 'success');
        setTimeout(hideFb, 2500);
      } else {
        showFb('error', data.error || 'Upload thất bại');
      }
    } catch {
      showFb('error', 'Lỗi kết nối');
    }
  });

  function showFb(type, msg) {
    if (!feedback) return;
    let iconHtml = '';
    if (typeof ICONS !== 'undefined') {
      if (type === 'success') iconHtml = ICONS.check + ' ';
      else if (type === 'error') iconHtml = ICONS.x + ' ';
      else if (type === 'loading') iconHtml = '<span class="spin-icon">' + ICONS.film + '</span> ';
    }
    feedback.innerHTML = iconHtml + '<span>' + msg + '</span>';
    feedback.className = 'infobox-upload-feedback infobox-upload-feedback--' + type;
    feedback.style.display = '';
  }
  function hideFb() {
    if (feedback) { feedback.style.display = 'none'; feedback.textContent = ''; }
  }
}

function initTrailerEdit(movieId, currentVideoId) {
  const editBtn = document.getElementById('trailerEditBtn');
  const editForm = document.getElementById('trailerEditForm');
  const urlInput = document.getElementById('trailerUrlInput');
  const saveBtn = document.getElementById('trailerSaveBtn');
  const clearBtn = document.getElementById('trailerClearBtn');
  const cancelBtn = document.getElementById('trailerEditCancel');
  const section = document.getElementById('trailer-section');
  if (!editBtn) return;

  editBtn.style.display = '';
  editBtn.addEventListener('click', () => {
    editForm.style.display = editForm.style.display === 'none' ? '' : 'none';
    if (editForm.style.display !== 'none') {
      urlInput.value = currentVideoId || '';
      urlInput.focus();
    }
  });
  cancelBtn?.addEventListener('click', () => { editForm.style.display = 'none'; });

  saveBtn?.addEventListener('click', async () => {
    saveBtn.disabled = true;
    const res = await apiPatch(`movies/${movieId}/update`, {
      field: 'trailer_url', value: urlInput.value.trim(),
    });
    saveBtn.disabled = false;
    if (res?.success) {
      editForm.style.display = 'none';
      showToast('Trailer đã được cập nhật!', 'success');
      location.reload();
    } else {
      showToast(res?.error || 'Lỗi', 'error');
    }
  });

  clearBtn?.addEventListener('click', async () => {
    if (!confirm('Xoá trailer khỏi phim này?')) return;
    const res = await apiPatch(`movies/${movieId}/update`, { field: 'trailer_url', value: '' });
    if (res?.success) { showToast('Đã xoá trailer'); location.reload(); }
  });
}

function initWikiEdit(movie, isEditor = false) {
  const editBtn = document.getElementById('editWikiBtn');
  const modal = document.getElementById('editWikiModal');
  const cancelBtn = document.getElementById('editWikiCancel');
  const form = document.getElementById('editWikiForm');
  const submitBtn = document.getElementById('editWikiSubmit');

  if (!editBtn || !modal || !form) return;

  if (isEditor) {
    editBtn.style.display = '';
  }

  const closeModal = () => {
    modal.classList.remove('open');
  };

  editBtn.addEventListener('click', () => {
    document.getElementById('wikiTitleVi').value = movie.title_vi || '';
    document.getElementById('wikiTitleJp').value = movie.title_jp || '';
    document.getElementById('wikiReleaseYear').value = movie.release_year || '';
    document.getElementById('wikiReleaseDate').value = movie.release_date || '';
    document.getElementById('wikiDirector').value = movie.director || '';
    document.getElementById('wikiBoxOffice').value = movie.box_office || '';
    document.getElementById('wikiThemeSong').value = movie.theme_song || '';
    document.getElementById('wikiPlot').value = movie.plot || '';
    document.getElementById('wikiIsFeatured').checked = Boolean(movie.is_featured);

    modal.classList.add('open');
  });

  cancelBtn?.addEventListener('click', closeModal);

  // Close when clicking overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang lưu...';
    }

    const payload = {
      title_vi: document.getElementById('wikiTitleVi').value.trim(),
      title_jp: document.getElementById('wikiTitleJp').value.trim(),
      release_year: parseInt(document.getElementById('wikiReleaseYear').value, 10) || 0,
      release_date: document.getElementById('wikiReleaseDate').value.trim(),
      director: document.getElementById('wikiDirector').value.trim(),
      box_office: document.getElementById('wikiBoxOffice').value.trim(),
      theme_song: document.getElementById('wikiThemeSong').value.trim(),
      plot: document.getElementById('wikiPlot').value.trim(),
      is_featured: document.getElementById('wikiIsFeatured').checked
    };

    const res = await apiPut(`movies/${movie.id}`, payload);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Lưu Thay Đổi';
    }

    if (res?.success) {
      showToast('Đã cập nhật thông tin thành công!', 'success');
      closeModal();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      showToast('Cập nhật thất bại: ' + (res?.error || 'Lỗi kết nối'), 'error');
    }
  });
}

