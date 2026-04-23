// Auth helpers + a tiny React hook for components that need the signed-in
// user. We don't run a full Context provider here — TanStack Router has its
// own state model — but useCurrentUser() reads from localStorage + listens
// for storage events so multi-tab logins/logouts stay in sync.

import { useEffect, useSyncExternalStore } from 'react'
import { api, getCachedUser, setAuth, clearAuth, getAccessToken } from './api'

const _listeners = new Set()

function _notify() {
  _listeners.forEach((fn) => { try { fn() } catch {} })
}

function _subscribe(cb) {
  _listeners.add(cb)
  // Cross-tab sync via the standard 'storage' event
  const onStorage = (e) => { if (!e.key || e.key.startsWith('ph_')) cb() }
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage)
  return () => {
    _listeners.delete(cb)
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage)
  }
}

function _snapshot() {
  return getCachedUser()
}

export function useCurrentUser() {
  return useSyncExternalStore(_subscribe, _snapshot, () => null)
}

export function isAuthed() {
  return !!getAccessToken()
}

export async function loginWithCredentials(email, password) {
  const res = await api.authLogin(email.trim().toLowerCase(), password)
  if (!res?.access_token) throw new Error('Invalid email or password')
  setAuth(res, res.user)
  _notify()
  return res.user
}

export async function registerWithCredentials(email, password, name) {
  const res = await api.authRegister(email.trim().toLowerCase(), password, name)
  if (!res?.access_token) throw new Error('Registration failed')
  setAuth(res, res.user)
  _notify()
  return res.user
}

export async function logout() {
  try {
    const ls = typeof window !== 'undefined' ? window.localStorage : null
    const rt = ls ? ls.getItem('ph_refresh_token') : null
    if (rt) await api.authLogout(rt)
  } catch {}
  clearAuth()
  _notify()
}

// Convenience: components that need an athlete_id (Inbox, Compose, etc) can
// derive it from the signed-in user with a single readable expression. Falls
// back to legacy localStorage keys + 'athlete_01' for the dev-without-auth
// case so the app keeps rendering during the transition.
export function getCurrentAthleteId() {
  const u = getCachedUser()
  if (u?.athlete_id) return u.athlete_id
  try {
    const legacy = window.localStorage.getItem('ph_self_athlete_id')
    if (legacy) return legacy
  } catch {}
  return 'athlete_01'
}

export function getCurrentCoachId() {
  const u = getCachedUser()
  if (u?.athlete_id) return u.athlete_id   // coach IS an athlete in the MVP model
  try {
    const legacy = window.localStorage.getItem('ph_coach_id')
    if (legacy) return legacy
  } catch {}
  return 'athlete_01'
}
