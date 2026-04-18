const runtimeConfig = typeof window !== 'undefined' ? window.AB_CONFIG || {} : {}

export const API_BASE = import.meta.env.VITE_API_BASE || runtimeConfig.API_BASE || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

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

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
}

export async function safeQuery(fn, fallback = null) {
  try {
    return await fn()
  } catch {
    return fallback
  }
}
