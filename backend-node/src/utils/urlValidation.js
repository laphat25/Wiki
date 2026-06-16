// ============================================
// utils/urlValidation.js — HTTPS-only external URL validation
// ============================================

/**
 * Validate that a URL uses HTTPS only.
 * @param {string} url
 * @returns {{ valid: boolean, error?: string, normalized?: string }}
 */
function validateHttpsUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only https:// URLs are allowed' };
  }

  return { valid: true, normalized: parsed.href };
}

module.exports = { validateHttpsUrl };
