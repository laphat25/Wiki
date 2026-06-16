// ============================================
// api.js — HTTP client (credentials: include everywhere)
// ============================================

const FETCH_OPTS = { credentials: 'include' };

async function parseJsonResponse(res) {
  const text = await res.text().catch(() => '{}');
  try {
    return JSON.parse(text);
  } catch {
    return { error: 'Invalid JSON response' };
  }
}

async function apiGet(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, FETCH_OPTS);
    if (!res.ok && res.status !== 401) {
      window.dispatchEvent(new CustomEvent('api:error', { detail: { status: res.status } }));
    }
    return await parseJsonResponse(res);
  } catch (e) {
    console.error('API GET Error:', e);
    window.dispatchEvent(new CustomEvent('api:offline'));
    return null;
  }
}

async function apiPost(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...FETCH_OPTS,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    return await parseJsonResponse(res);
  } catch (e) {
    console.error('API POST Error:', e);
    window.dispatchEvent(new CustomEvent('api:offline'));
    return null;
  }
}

async function apiPatch(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...FETCH_OPTS,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    return await parseJsonResponse(res);
  } catch (e) {
    console.error('API PATCH Error:', e);
    window.dispatchEvent(new CustomEvent('api:offline'));
    return null;
  }
}

async function apiPut(endpoint, payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...FETCH_OPTS,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    return await parseJsonResponse(res);
  } catch (e) {
    console.error('API PUT Error:', e);
    window.dispatchEvent(new CustomEvent('api:offline'));
    return null;
  }
}

async function apiDelete(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...FETCH_OPTS,
      method: 'DELETE',
    });
    return await parseJsonResponse(res);
  } catch (e) {
    console.error('API DELETE Error:', e);
    window.dispatchEvent(new CustomEvent('api:offline'));
    return null;
  }
}

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'include' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok' || data.status === 'degraded';
  } catch {
    return false;
  }
}

/** Normalize movies API response (array or paginated). */
function unwrapList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
}
