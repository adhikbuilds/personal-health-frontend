import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('ph_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse user from storage', e)
        localStorage.removeItem('ph_user')
      }
    }
    setLoading(false)
  }, [])

  // Until the real /auth backend is wired, we keep a tiny local "user store"
  // in localStorage keyed by email so login can recover the role/sport that
  // was set during signup. This fixes the bug where logging in always
  // routed users to the athlete dashboard regardless of their original role.
  const _userStoreKey = 'ph_user_store'

  const _getUserStore = () => {
    try {
      return JSON.parse(localStorage.getItem(_userStoreKey) || '{}')
    } catch {
      return {}
    }
  }

  const _saveUserStore = (store) => {
    localStorage.setItem(_userStoreKey, JSON.stringify(store))
  }

  const signup = async (email, password, role, sport = null) => {
    // Local-only signup (no backend yet). Role is captured here.
    const normalized = String(email || '').trim().toLowerCase()
    if (!normalized || !password) {
      setError('Email and password required')
      return null
    }
    if (!role) {
      setError('Role required (athlete/coach/parent)')
      return null
    }
    const userData = {
      userId: `${role}_${Date.now()}`,
      id: `${role}_${Date.now()}`,
      email: normalized,
      role,
      sport,
      createdAt: new Date().toISOString(),
    }
    // Save in user store so future logins recover the role
    const store = _getUserStore()
    store[normalized] = { ...userData, password }
    _saveUserStore(store)
    setUser(userData)
    localStorage.setItem('ph_user', JSON.stringify(userData))
    setError(null)
    return userData
  }

  const login = async (email, password) => {
    if (!email || !password) {
      setError('Email and password required')
      return null
    }
    const normalized = String(email).trim().toLowerCase()
    const store = _getUserStore()
    const existing = store[normalized]

    // Demo seed accounts (so the demo creds shown on login page work too)
    const demoAccounts = {
      'coach@example.com':   { role: 'coach',   password: 'password123', sport: null },
      'athlete@example.com': { role: 'athlete', password: 'password123', sport: 'Cricket' },
      'parent@example.com':  { role: 'parent',  password: 'password123', sport: null },
    }

    let matched = existing
    if (!matched && demoAccounts[normalized]) {
      matched = { ...demoAccounts[normalized], email: normalized }
    }

    if (!matched) {
      setError('No account found for this email. Sign up first.')
      return null
    }
    if (matched.password && matched.password !== password) {
      setError('Incorrect password')
      return null
    }

    const userData = {
      userId: matched.userId || `${matched.role}_${Date.now()}`,
      id: matched.id || matched.userId || `${matched.role}_${Date.now()}`,
      email: normalized,
      role: matched.role,           // ← THE FIX: pull role from store, not hardcoded
      sport: matched.sport || null,
      createdAt: matched.createdAt || new Date().toISOString(),
    }
    setUser(userData)
    localStorage.setItem('ph_user', JSON.stringify(userData))
    setError(null)
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ph_user')
    setError(null)
  }

  const isCoach = user?.role === 'coach'
  const isAthlete = user?.role === 'athlete'

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        isCoach,
        isAthlete,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
