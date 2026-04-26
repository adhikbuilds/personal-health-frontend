import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../../lib/api'

const RISK_HEADLINES = {
  low: 'Training safely this week',
  high: 'Coach is monitoring closely',
}

const RISK_COLORS = {
  low: '#22c55e',
  high: '#ef4444',
}

export function ParentDigestPage({ token }) {
  const digestQuery = useQuery({
    queryKey: ['parent-digest', token],
    enabled: Boolean(token),
    queryFn: () =>
      safeQuery(() => api.get(`/parent/${encodeURIComponent(token)}/weekly-digest`), null),
  })

  return (
    <div style={{ background: '#0a0e1a', color: '#fff', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(6,182,212,0.15)',
              color: '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            PH
          </span>
          <strong style={{ fontSize: 14, color: '#06b6d4' }}>Personal Health</strong>
        </div>

        {!token ? (
          <ErrorCard message="Missing token in the link." />
        ) : digestQuery.isLoading ? (
          <div style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</div>
        ) : !digestQuery.data ? (
          <ErrorCard message="Link not found or expired. Ask your athlete to share a fresh link." />
        ) : (
          <DigestBody digest={digestQuery.data} />
        )}
      </div>
    </div>
  )
}

function ErrorCard({ message }) {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 12,
        padding: 32,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700 }}>Link unavailable</h2>
      <p style={{ margin: 0, fontSize: 14, color: '#9ca3af' }}>{message}</p>
    </div>
  )
}

function DigestBody({ digest }) {
  const risk = digest.injury_risk || 'unknown'
  const headline = RISK_HEADLINES[risk] || 'Active week — all good'
  const color = RISK_COLORS[risk] || '#06b6d4'

  const sessions = digest.sessions_this_week ?? 0
  const avgForm = digest.avg_form_score != null ? `${digest.avg_form_score} / 100` : '—'
  const mins = digest.total_training_minutes ?? 0
  const reps = digest.total_reps || '—'

  return (
    <>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: -0.5,
          margin: '0 0 8px 0',
          color,
        }}
      >
        {headline}
      </h1>
      <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 28px 0', lineHeight: 1.6 }}>
        Weekly update for <strong style={{ color: '#fff' }}>{digest.athlete_name || 'your athlete'}</strong>
        {' · '}
        {(digest.sport || 'sport not set').replace(/_/g, ' ')}
        {' · '}
        week ending {digest.week_ending || ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <Stat label="Sessions this week" value={sessions} accent />
        <Stat label="Avg form score" value={avgForm} />
        <Stat label="Training time" value={`${mins} min`} />
        <Stat label="Total reps" value={reps} />
      </div>

      {digest.safety_note ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: 16,
            fontSize: 14,
            color: '#e2e8f0',
            lineHeight: 1.7,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }}>
            Note from coach
          </div>
          {digest.safety_note}
        </div>
      ) : null}

      <p style={{ fontSize: 12, color: '#4b5563', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
        This view shows only safety-relevant signals.
        <br />
        Detailed scores are private to the athlete and their coach.
      </p>
    </>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent ? '#06b6d4' : '#f9fafb' }}>{value}</div>
    </div>
  )
}
