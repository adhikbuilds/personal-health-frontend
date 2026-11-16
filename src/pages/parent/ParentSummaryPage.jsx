import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../../lib/api'

const RISK_HEADLINES = {
  low: 'Training safely',
  medium: 'Training actively — worth checking in',
  high: 'Elevated risk — consider reaching out',
}

const RISK_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
}

export function ParentSummaryPage({ consentId, token }) {
  const summaryQuery = useQuery({
    queryKey: ['parent-summary', consentId, token],
    enabled: Boolean(consentId && token),
    queryFn: () =>
      safeQuery(
        () =>
          api.get(
            `/parent/${encodeURIComponent(consentId)}/safety-summary?token=${encodeURIComponent(token)}`,
          ),
        null,
      ),
    refetchInterval: 60_000,
  })

  return (
    <div style={{ background: '#0a0e1a', color: '#fff', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Logo */}
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

        {!consentId || !token ? (
          <ErrorCard message="Missing access token. Use the link provided by the athlete." />
        ) : summaryQuery.isLoading ? (
          <div style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading…</div>
        ) : !summaryQuery.data ? (
          <ErrorCard message="Access denied or link expired. The athlete may have revoked access." />
        ) : (
          <SummaryBody summary={summaryQuery.data} />
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
      <h2 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700 }}>Access unavailable</h2>
      <p style={{ margin: 0, fontSize: 14, color: '#9ca3af' }}>{message}</p>
    </div>
  )
}

function SummaryBody({ summary }) {
  const risk = summary.injury_risk_level || 'low'
  const headline = RISK_HEADLINES[risk] || RISK_HEADLINES.low
  const color = RISK_COLORS[risk] || RISK_COLORS.low
  const fillPct = risk === 'low' ? 20 : risk === 'medium' ? 55 : 90

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
        Safety summary for <strong style={{ color: '#fff' }}>{summary.athlete_name || 'your athlete'}</strong>
        {' · '}
        {(summary.sport || 'sport not set').replace(/_/g, ' ')}
      </p>

      {/* Risk bar */}
      <div
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 10 }}>
          Injury risk
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ width: `${fillPct}%`, height: '100%', background: color, transition: 'width 200ms' }} />
        </div>
        {summary.injury_risk_reason ? (
          <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.5, margin: 0 }}>{summary.injury_risk_reason}</p>
        ) : null}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <Stat label="Sessions this week" value={summary.sessions_last_7_days ?? 0} accent />
        <Stat label="Last session" value={summary.last_session_date || 'No sessions yet'} small />
        <Stat label="Training load" value={summary.training_volume || '—'} pill={summary.training_volume} />
        <Stat label="Sport" value={(summary.sport || '—').replace(/_/g, ' ')} small />
      </div>

      {/* Plain-language summary */}
      {summary.summary_sentence ? (
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
          {summary.summary_sentence}
        </div>
      ) : null}

      <p style={{ fontSize: 12, color: '#4b5563', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
        This view shows only safety-relevant signals.
        <br />
        Detailed scores and session data are private to the athlete.
      </p>
    </>
  )
}

function Stat({ label, value, accent, small, pill }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 4 }}>
        {label}
      </div>
      {pill ? (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 700,
            background:
              pill === 'heavy'
                ? 'rgba(245,158,11,0.15)'
                : pill === 'moderate'
                  ? 'rgba(6,182,212,0.15)'
                  : 'rgba(148,163,184,0.15)',
            color:
              pill === 'heavy' ? '#f59e0b' : pill === 'moderate' ? '#06b6d4' : '#94a3b8',
          }}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ) : (
        <div
          style={{
            fontSize: small ? 15 : 20,
            fontWeight: 800,
            color: accent ? '#06b6d4' : '#f9fafb',
            paddingTop: small ? 3 : 0,
          }}
        >
          {value}
        </div>
      )}
    </div>
  )
}
