import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { loginWithCredentials, registerWithCredentials } from '../lib/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode]     = useState('login')   // 'login' | 'register'
  const [email, setEmail]   = useState('')
  const [name, setName]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]   = useState(null)
  const [busy, setBusy]     = useState(false)

  const isLogin = mode === 'login'
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit = validEmail && password.length >= 8 && (isLogin || name.trim().length >= 1) && !busy

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setBusy(true)
    try {
      if (isLogin) await loginWithCredentials(email, password)
      else         await registerWithCredentials(email, password, name.trim())
      navigate({ to: '/', replace: true })
    } catch (err) {
      setError(err?.message || (isLogin ? 'Login failed' : 'Registration failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <div className="auth-head">
          <span className="brand-mark">PH</span>
          <div>
            <strong>Personal Health</strong>
            <small>{isLogin ? 'Sign in to your bio-passport' : 'Create your bio-passport'}</small>
          </div>
        </div>

        {!isLogin && (
          <label className="auth-field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              maxLength={80}
              disabled={busy}
              required
            />
          </label>
        )}

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete={isLogin ? 'email' : 'email'}
            disabled={busy}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password · min 8 chars</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={8}
            disabled={busy}
            required
          />
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-cta" disabled={!canSubmit}>
          {busy ? 'Working…' : isLogin ? 'Sign in' : 'Create account'}
        </button>

        <button
          type="button"
          className="auth-altlink"
          onClick={() => { setError(null); setMode(isLogin ? 'register' : 'login') }}
          disabled={busy}
        >
          {isLogin ? 'New here? Create an account' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
