// ============================================
// utils/fileValidation.js — Magic-byte file validation
// ============================================

const FileType = require('file-type');

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Validate image buffer by magic bytes (not just MIME header).
 * @param {Buffer} buffer
 * @param {string} declaredMime
 * @returns {{ valid: boolean, error?: string, mime?: string, ext?: string }}
 */
async function validateImageBuffer(buffer, declaredMime) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file' };
  }

  if (!ALLOWED_MIMES.has(declaredMime)) {
    return { valid: false, error: 'File type not allowed' };
  }

  const detected = await FileType.fromBuffer(buffer);
  if (!detected || !ALLOWED_MIMES.has(detected.mime)) {
    return { valid: false, error: 'File content does not match an allowed image type' };
  }

  if (detected.mime !== declaredMime) {
    return { valid: false, error: 'Declared MIME type does not match file content' };
  }

  return {
    valid: true,
    mime: detected.mime,
    ext: MIME_TO_EXT[detected.mime] || 'jpg',
  };
}

module.exports = { validateImageBuffer, ALLOWED_MIMES, MIME_TO_EXT };
