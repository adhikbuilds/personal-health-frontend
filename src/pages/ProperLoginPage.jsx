import React, { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'

const ORANGE = '#FC4C02'
const DARK = '#242428'
const GRAY = '#6D6D78'
const LIGHT = '#F7F7FA'
const BORDER = '#E6E6EA'

export function ProperLoginPage() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!email.trim()) {
      setLocalError('Email required')
      return
    }

    if (!password.trim()) {
      setLocalError('Password required')
      return
    }

    setLoading(true)
    try {
      const result = await login(email, password)
      if (result) {
        navigate({ to: '/dashboard' })
      } else {
        setLocalError('Login failed')
      }
    } catch (err) {
      setLocalError(err.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* LEFT: Hero panel */}
      <div style={{
        background: DARK,
        color: '#fff',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Link
          to="/"
          style={{
            color: ORANGE,
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-0.5px',
          }}
        >
          ← PERSONAL HEALTH
        </Link>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: '-2px',
          }}>
            Form scores<br />
            in <span style={{ color: ORANGE }}>real-time.</span>
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '24px',
            lineHeight: 1.6,
            maxWidth: '420px',
          }}>
            AI biomechanics from your phone camera. No equipment. No coach needed.
          </p>

          {/* Decorative stat */}
          <div style={{ marginTop: '40px', display: 'flex', gap: '40px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: ORANGE }}>2,400+</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: 700 }}>
                Athletes
              </div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: ORANGE }}>52%</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: 700 }}>
                Faster Improvement
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 2 }}>
          © 2026 Personal Health
        </div>

        {/* Decorative orange accent */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: ORANGE,
          borderRadius: '50%',
          opacity: 0.15,
          filter: 'blur(60px)',
        }} />
      </div>

      {/* RIGHT: Login form */}
      <div style={{
        background: '#fff',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: 800,
            color: DARK,
            letterSpacing: '-1px',
          }}>
            Welcome back
          </h2>
          <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: GRAY }}>
            Sign in to track your form, sessions, and progress.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '11px',
                color: GRAY,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalError('') }}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#fff',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  color: DARK,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = ORANGE}
                onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '11px',
                color: GRAY,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLocalError('') }}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#fff',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  color: DARK,
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = ORANGE}
                onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
              />
            </div>

            {/* Error */}
            {localError && (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '16px',
              }}>
                {localError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: ORANGE,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                opacity: loading ? 0.6 : 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Signup Link */}
          <p style={{
            marginTop: '24px',
            fontSize: '13px',
            color: GRAY,
            textAlign: 'center',
          }}>
            New to Personal Health?{' '}
            <Link to="/signup" style={{
              color: ORANGE,
              textDecoration: 'none',
              fontWeight: 700,
            }}>
              Create an account
            </Link>
          </p>

          {/* Demo Info */}
          <div style={{
            marginTop: '32px',
            padding: '16px',
            background: LIGHT,
            border: `1px solid ${BORDER}`,
            borderRadius: '4px',
            fontSize: '11px',
            color: GRAY,
          }}>
            <strong style={{ color: DARK, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Demo credentials
            </strong>
            <div style={{ marginTop: '8px', fontFamily: 'monospace' }}>
              <div>coach@example.com / password123</div>
              <div>athlete@example.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
