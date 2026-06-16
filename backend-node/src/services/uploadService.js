// ============================================
// services/uploadService.js
// ============================================

const fs = require('fs');
const path = require('path');
const config = require('../config');
const movieRepository = require('../repositories/movieRepository');
const { validateImageBuffer } = require('../utils/fileValidation');

const MOVIES_UPLOAD_DIR = path.join(config.uploads.dir, 'movies');

async function uploadMoviePoster(movieId, file) {
  const id = parseInt(movieId, 10);
  if (!id || id <= 0) {
    return { error: 'Invalid movie_id', status: 400 };
  }
  if (!file) {
    return { error: 'No file selected', status: 400 };
  }

  const validation = await validateImageBuffer(file.buffer, file.mimetype);
  if (!validation.valid) {
    return { error: validation.error, status: 400 };
  }

  if (!movieRepository.exists(id)) {
    return { error: 'Movie not found', status: 404 };
  }

  const movieDir = path.join(MOVIES_UPLOAD_DIR, String(id));
  fs.mkdirSync(movieDir, { recursive: true });

  try {
    const oldFiles = fs.readdirSync(movieDir).filter((f) => f.startsWith('cover.'));
    oldFiles.forEach((f) => fs.unlinkSync(path.join(movieDir, f)));
  } catch {
    // ignore
  }

  const filename = `cover.${validation.ext}`;
  const destPath = path.join(movieDir, filename);
  fs.writeFileSync(destPath, file.buffer);

  const relativeUrl = `/uploads/movies/${id}/${filename}`;
  movieRepository.updateField(id, 'image_url', relativeUrl);

  return {
    success: true,
    url: relativeUrl,
    message: 'Poster uploaded successfully',
  };
}

module.exports = { uploadMoviePoster };
