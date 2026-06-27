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

  let finalBuffer = file.buffer;
  let finalExt = validation.ext;

  try {
    const sharp = require('sharp');
    finalBuffer = await sharp(file.buffer)
      .resize({ width: 500, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();
    finalExt = 'jpg';
  } catch (sharpError) {
    console.error('Sharp image processing failed, fallback to original buffer:', sharpError);
  }

  const filename = `cover.${finalExt}`;
  const destPath = path.join(movieDir, filename);
  fs.writeFileSync(destPath, finalBuffer);

  const relativeUrl = `/uploads/movies/${id}/${filename}?v=${Date.now()}`;
  movieRepository.updateField(id, 'image_url', relativeUrl);

  return {
    success: true,
    url: relativeUrl,
    message: 'Poster uploaded and processed successfully',
  };
}

module.exports = { uploadMoviePoster };
