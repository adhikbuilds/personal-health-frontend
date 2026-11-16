import React, { useState } from 'react'
import { useNavigate, Link, useSearch } from '@tanstack/react-router'
import { useUser } from '../context/UserContext'

const ORANGE = '#FC4C02'
const DARK = '#242428'
const GRAY = '#6D6D78'
const LIGHT = '#F7F7FA'
const BORDER = '#E6E6EA'

const SPORTS = [
  'Basketball', 'Cricket', 'Football', 'Volleyball', 'Tennis',
  'Track & Field', 'Swimming', 'Badminton', 'Martial Arts',
  'Weight Training', 'CrossFit', 'Other',
]

export function ProperSignupPage() {
  const navigate = useNavigate()
  const { signup } = useUser()
  const search = useSearch({ from: '/signup' })
  const initialRole = search?.role || null

  const [step, setStep] = useState(initialRole ? 1 : 0)
  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sport, setSport] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep(1)
  }

  const handleCredentialsNext = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email required'); return }
    if (!password.trim()) { setError('Password required'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (role === 'athlete') setStep(2)
    else handleSubmit(null, null)
  }

  const handleSubmit = async (e, selectedSport = sport) => {
    if (e) e.preventDefault()
    setError('')
    if (role === 'athlete' && !selectedSport) { setError('Please select a sport'); return }
    setLoading(true)
    try {
      const result = await signup(email, password, role, selectedSport || null)
      if (result) navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err.message || 'Signup failed')
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
      {/* LEFT: Hero */}
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
        <Link to="/" style={{ color: ORANGE, textDecoration: 'none', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
          ← PERSONAL HEALTH
        </Link>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, margin: 0, lineHeight: 1.0, letterSpacing: '-2px' }}>
            Join 2,400+<br />
            <span style={{ color: ORANGE }}>athletes.</span>
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginTop: '24px', lineHeight: 1.6, maxWidth: '420px' }}>
            Create your account in 60 seconds. AI biomechanics from your phone — free to start.
          </p>

          <div style={{ marginTop: '40px' }}>
            {[
              { num: '01', label: 'Pick your role' },
              { num: '02', label: 'Email + password' },
              { num: '03', label: role === 'coach' ? 'Done' : 'Pick your sport' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 0',
                opacity: step === i ? 1 : step > i ? 0.7 : 0.3,
              }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step >= i ? ORANGE : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800,
                }}>
                  {step > i ? '✓' : s.num}
                </span>
                <span style={{ fontSize: '14px', fontWeight: step === i ? 700 : 500 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 2 }}>
          © 2026 Personal Health
        </div>

        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: ORANGE,
          borderRadius: '50%',
          opacity: 0.15,
          filter: 'blur(60px)',
        }} />
      </div>

      {/* RIGHT: Form */}
      <div style={{
        background: '#fff',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {step === 0 && (
            <RoleSelect onSelect={handleRoleSelect} />
          )}

          {step === 1 && (
            <CredentialsForm
              role={role}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
              error={error} setError={setError}
              onSubmit={handleCredentialsNext}
              onBack={() => setStep(0)}
              loading={loading}
            />
          )}

          {step === 2 && role === 'athlete' && (
            <SportSelect
              sport={sport}
              onSelect={(s) => { setSport(s); handleSubmit(null, s) }}
              onBack={() => setStep(1)}
              error={error}
              loading={loading}
            />
          )}

          {/* Already have account */}
          <p style={{
            marginTop: '32px',
            fontSize: '13px',
            color: GRAY,
            textAlign: 'center',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: ORANGE, textDecoration: 'none', fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function RoleSelect({ onSelect }) {
  const roles = [
    { id: 'athlete', title: 'Athlete', desc: 'Record sessions, get AI form feedback, track progress.', emoji: '🏃' },
    { id: 'coach', title: 'Coach', desc: 'Manage a roster, monitor team form, assign drills.', emoji: '📋' },
    { id: 'parent', title: 'Parent', desc: 'Watch your kid train safely. Get weekly safety summaries.', emoji: '👨‍👧' },
  ]

  return (
    <div>
      <h2 style={{ fontSize: '32px', fontWeight: 800, color: DARK, margin: '0 0 8px 0', letterSpacing: '-1px' }}>
        Who are you?
      </h2>
      <p style={{ fontSize: '14px', color: GRAY, margin: '0 0 24px 0' }}>
        Pick the role that fits you best. You can always change later.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            style={{
              padding: '20px',
              background: '#fff',
              border: `1px solid ${BORDER}`,
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.background = LIGHT }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = '#fff' }}
          >
            <span style={{ fontSize: '32px' }}>{r.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: DARK }}>{r.title}</div>
              <div style={{ fontSize: '12px', color: GRAY, marginTop: '2px' }}>{r.desc}</div>
            </div>
            <span style={{ fontSize: '18px', color: ORANGE }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CredentialsForm({ role, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, error, setError, onSubmit, onBack, loading }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: ORANGE, fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', padding: 0, marginBottom: '20px' }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: '32px', fontWeight: 800, color: DARK, margin: '0 0 8px 0', letterSpacing: '-1px' }}>
        Create account
      </h2>
      <p style={{ fontSize: '14px', color: GRAY, margin: '0 0 24px 0', textTransform: 'capitalize' }}>
        Signing up as {role}
      </p>

      <form onSubmit={onSubmit}>
        <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setError('') }} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={(v) => { setPassword(v); setError('') }} placeholder="At least 6 characters" />
        <Field label="Confirm Password" type="password" value={confirmPassword} onChange={(v) => { setConfirmPassword(v); setError('') }} placeholder="Re-enter password" />

        {error && (
          <div style={{
            padding: '10px 12px',
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

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
          {loading ? 'Creating account...' : (role === 'athlete' ? 'Next: Pick Sport →' : 'Create Account →')}
        </button>
      </form>
    </div>
  )
}

function SportSelect({ sport, onSelect, onBack, error, loading }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: ORANGE, fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', padding: 0, marginBottom: '20px' }}
      >
        ← Back
      </button>

      <h2 style={{ fontSize: '32px', fontWeight: 800, color: DARK, margin: '0 0 8px 0', letterSpacing: '-1px' }}>
        Pick your sport
      </h2>
      <p style={{ fontSize: '14px', color: GRAY, margin: '0 0 24px 0' }}>
        We'll tailor form analysis to your sport's biomechanics.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
      }}>
        {SPORTS.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            disabled={loading}
            style={{
              padding: '14px',
              background: sport === s ? ORANGE : '#fff',
              color: sport === s ? '#fff' : DARK,
              border: `1px solid ${sport === s ? ORANGE : BORDER}`,
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if (sport !== s) e.currentTarget.style.borderColor = ORANGE }}
            onMouseLeave={(e) => { if (sport !== s) e.currentTarget.style.borderColor = BORDER }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid #ef4444',
          color: '#ef4444',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '16px',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        fontSize: '11px',
        color: GRAY,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'block',
        marginBottom: '6px',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
  )
}
