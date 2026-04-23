// Centralized HTTP client.
// - Reads the JWT access token from localStorage and injects it as a Bearer
//   Authorization header on every request.
// - On 401 it tries the refresh endpoint exactly once, retries the original
//   request with the new token, and otherwise clears the auth cache so the
//   AuthGate can route the user to /login.

const runtimeConfig = typeof window !== 'undefined' ? window.AB_CONFIG || {} : {}

export const API_BASE = import.meta.env.VITE_API_BASE || runtimeConfig.API_BASE || '/api'

const ACCESS_KEY  = 'ph_access_token'
const REFRESH_KEY = 'ph_refresh_token'
const USER_KEY    = 'ph_auth_user'

function _safeLocalStorage() {
  try { return window.localStorage } catch { return null }
}

export function getAccessToken() {
  const ls = _safeLocalStorage()
  return ls ? ls.getItem(ACCESS_KEY) : null
}

export function setAuth(tokens, user) {
  const ls = _safeLocalStorage()
  if (!ls) return
  if (tokens?.access_token)  ls.setItem(ACCESS_KEY, tokens.access_token)
  if (tokens?.refresh_token) ls.setItem(REFRESH_KEY, tokens.refresh_token)
  if (user)                  ls.setItem(USER_KEY, JSON.stringify(user))
}

export function getCachedUser() {
  const ls = _safeLocalStorage()
  if (!ls) return null
  try { return JSON.parse(ls.getItem(USER_KEY) || 'null') } catch { return null }
}

export function clearAuth() {
  const ls = _safeLocalStorage()
  if (!ls) return
  ls.removeItem(ACCESS_KEY)
  ls.removeItem(REFRESH_KEY)
  ls.removeItem(USER_KEY)
}

let _refreshInFlight = null

async function _tryRefresh() {
  if (_refreshInFlight) return _refreshInFlight
  const ls = _safeLocalStorage()
  const refresh = ls?.getItem(REFRESH_KEY)
  if (!refresh) return false
  _refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      })
      if (!res.ok) return false
      const body = await res.json()
      if (!body?.access_token) return false
      ls.setItem(ACCESS_KEY, body.access_token)
      if (body.refresh_token) ls.setItem(REFRESH_KEY, body.refresh_token)
      return true
    } catch {
      return false
    } finally {
      _refreshInFlight = null
    }
  })()
  return _refreshInFlight
}

async function _doRequest(path, options, attemptedRefresh) {
  const token = getAccessToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (response.status === 401 && !attemptedRefresh) {
    const ok = await _tryRefresh()
    if (ok) return _doRequest(path, options, true)
    clearAuth()
    throw new Error('Unauthenticated')
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    try {
      const payload = await response.json()
      detail = payload.detail || payload.error || detail
    } catch {}
    throw new Error(detail)
  }

  if (response.status === 204) return null
  return response.json()
}

async function request(path, options = {}) {
  return _doRequest(path, options, false)
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  // Multipart upload helper — used by ComposePage voice notes. Skips JSON
  // Content-Type so the browser sets the right multipart boundary.
  upload: (path, formData) => {
    const token = getAccessToken()
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    return fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: formData })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Upload failed (${r.status})`)
        return r.json()
      })
  },

  // Auth endpoints (mirror the mobile app surface)
  authLogin: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  authRegister: (email, password, name) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  authMe: () => request('/auth/me'),
  authLogout: (refresh_token) =>
    request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }).catch(() => null),
}

export async function safeQuery(fn, fallback = null) {
  try {
    return await fn()
  } catch {
    return fallback
  }
}
