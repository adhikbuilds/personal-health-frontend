import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'
import { api, safeQuery } from '../../lib/api'

export function PerformanceReportsPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('weekly')
  const [athletes, setAthletes] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate({ to: '/login' }); return }
    loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    const [athleteData, sessionData] = await Promise.all([
      safeQuery(() => api.get('/athletes'), { athletes: [] }),
      safeQuery(() => api.get('/sessions?limit=200&status=completed'), { sessions: [] }),
    ])
    setAthletes(athleteData?.athletes || [])
    setSessions(sessionData?.sessions || [])
    setLoading(false)
  }

  if (!user) return null

  const displayName = String(user?.userId || user?.email || 'Coach')

  const reports = [
    { id: 'weekly', label: 'Weekly Summary' },
    { id: 'injury', label: 'Injury Risk' },
    { id: 'compliance', label: 'Compliance' },
  ]

  return (
    <StravaLayout displayName={displayName} role="coach">
      <PageHeader
        eyebrow="Coach · Reports"
        title="Performance reports."
        description="Auto-generated from real session data for team meetings and program planning."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: `1px solid ${BORDER}` }}>
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveTab(r.id)}
              style={{
                padding: '12px 20px', background: 'transparent', border: 'none',
                borderBottom: activeTab === r.id ? `3px solid ${ORANGE}` : '3px solid transparent',
                color: activeTab === r.id ? DARK : GRAY,
                fontSize: '13px', fontWeight: activeTab === r.id ? 700 : 600,
                cursor: 'pointer', marginBottom: '-1px', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {loading
          ? <div style={{ color: GRAY, fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>Loading report data…</div>
          : <>
            {activeTab === 'weekly' && <WeeklyReport athletes={athletes} sessions={sessions} />}
            {activeTab === 'injury' && <InjuryReport athletes={athletes} sessions={sessions} />}
            {activeTab === 'compliance' && <ComplianceReport athletes={athletes} sessions={sessions} />}
          </>
        }
      </div>
    </StravaLayout>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function sevenDaysAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d
}

function scoreOf(s) {
  return s?.summary?.avg_form_score ?? s?.avg_form_score ?? null
}

// ─── Weekly Report ───────────────────────────────────────────────────────────

function WeeklyReport({ athletes, sessions }) {
  const cutoff = sevenDaysAgo()
  const weekSessions = sessions.filter(s => new Date(s.started_at) >= cutoff)

  const scores = weekSessions.map(scoreOf).filter(Boolean)
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—'

  // Count sessions per athlete this week
  const countByAthlete = {}
  weekSessions.forEach(s => { countByAthlete[s.athlete_id] = (countByAthlete[s.athlete_id] || 0) + 1 })
  const mostActive = Object.entries(countByAthlete).sort((a, b) => b[1] - a[1])[0]
  const mostActiveName = mostActive
    ? (athletes.find(a => a.id === mostActive[0])?.name || mostActive[0])
    : '—'

  // Top improver: biggest avg score delta vs prev week
  const prevCutoff = new Date(cutoff); prevCutoff.setDate(prevCutoff.getDate() - 7)
  const prevWeekSessions = sessions.filter(s => {
    const d = new Date(s.started_at)
    return d >= prevCutoff && d < cutoff
  })

  const avgByAthlete = (sessionList) => {
    const byA = {}
    sessionList.forEach(s => {
      const sc = scoreOf(s)
      if (sc == null) return
      byA[s.athlete_id] = byA[s.athlete_id] || []
      byA[s.athlete_id].push(sc)
    })
    return Object.fromEntries(Object.entries(byA).map(([id, arr]) => [id, arr.reduce((a, b) => a + b, 0) / arr.length]))
  }
  const thisWeekAvg = avgByAthlete(weekSessions)
  const prevWeekAvg = avgByAthlete(prevWeekSessions)

  let topImprover = null, topDelta = -Infinity
  Object.entries(thisWeekAvg).forEach(([id, cur]) => {
    const prev = prevWeekAvg[id]
    if (prev == null) return
    const delta = cur - prev
    if (delta > topDelta) { topDelta = delta; topImprover = id }
  })
  const topImproverName = topImprover
    ? (athletes.find(a => a.id === topImprover)?.name || topImprover)
    : '—'

  // Personal bests this week
  const pbs = weekSessions.filter(s => {
    const sc = scoreOf(s)
    if (sc == null) return false
    const allPrev = sessions.filter(p => p.athlete_id === s.athlete_id && new Date(p.started_at) < new Date(s.started_at))
    return allPrev.every(p => (scoreOf(p) || 0) < sc)
  })

  // Top 5 athletes by sessions this week
  const topAthleteRows = Object.entries(countByAthlete)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, count]) => ({
      name: athletes.find(a => a.id === id)?.name || id,
      sport: sessions.find(s => s.athlete_id === id)?.sport || '—',
      count,
      avg: thisWeekAvg[id] ? thisWeekAvg[id].toFixed(1) : '—',
    }))

  const prevCount = prevWeekSessions.length
  const changeStr = prevCount > 0
    ? `${weekSessions.length >= prevCount ? '+' : ''}${weekSessions.length - prevCount}`
    : null

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <BigStat label="Sessions This Week" value={weekSessions.length} change={changeStr} accent />
        <BigStat label="Avg Form Score" value={avgScore} unit="/100" />
        <BigStat label="Most Active" value={mostActiveName} unit={mostActive ? `${mostActive[1]} sessions` : ''} />
        <BigStat label="Top Improver" value={topImproverName} unit={topImprover && topDelta > 0 ? `+${topDelta.toFixed(1)} form` : ''} />
      </div>

      <StravaCard title={`Team Activity (${weekSessions.length} sessions this week)`} padding="0">
        {topAthleteRows.length === 0
          ? <div style={{ padding: '20px', color: GRAY, fontSize: '13px' }}>No sessions this week yet.</div>
          : topAthleteRows.map((a, i, arr) => (
            <div key={i} style={{
              padding: '14px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
              display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '20px', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>{a.sport}</div>
              </div>
              <span style={{ fontSize: '13px', color: GRAY }}>{a.count} sessions</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: ORANGE }}>
                {a.avg !== '—' ? `${a.avg}/100` : '—'}
              </span>
            </div>
          ))
        }
      </StravaCard>

      {pbs.length > 0 && (
        <>
          <div style={{ height: '12px' }} />
          <StravaCard title={`Personal Bests This Week (${pbs.length})`} padding="0">
            {pbs.slice(0, 5).map((s, i, arr) => {
              const name = athletes.find(a => a.id === s.athlete_id)?.name || s.athlete_id
              return (
                <div key={i} style={{
                  padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{name}</span>
                    <span style={{ fontSize: '11px', color: GRAY, marginLeft: '8px' }}>{s.sport}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#22c55e' }}>
                    ★ {scoreOf(s)?.toFixed(1)}/100
                  </span>
                </div>
              )
            })}
          </StravaCard>
        </>
      )}
    </div>
  )
}

// ─── Injury Risk Report ──────────────────────────────────────────────────────

function InjuryReport({ athletes, sessions }) {
  const cutoff = sevenDaysAgo()
  const recentSessions = sessions.filter(s => new Date(s.started_at) >= cutoff)

  // Compute risk per athlete: look at form_score decline and asymmetry
  const byAthlete = {}
  sessions.forEach(s => {
    if (!byAthlete[s.athlete_id]) byAthlete[s.athlete_id] = []
    byAthlete[s.athlete_id].push(s)
  })

  const riskRows = athletes.map(a => {
    const all = (byAthlete[a.id] || []).sort((x, y) => new Date(x.started_at) - new Date(y.started_at))
    const recent = all.slice(-3)
    const scores = recent.map(scoreOf).filter(Boolean)
    const lastScore = scores[scores.length - 1] || null
    const firstScore = scores[0] || null
    const decline = firstScore && lastScore ? firstScore - lastScore : 0
    const sessionCount14d = all.filter(s => new Date(s.started_at) >= new Date(Date.now() - 14 * 86400000)).length
    const inactive = sessionCount14d === 0

    let risk = 'healthy'
    let reason = 'No issues detected'
    if (inactive) { risk = 'watch'; reason = 'No sessions in 14 days' }
    if (decline > 10) { risk = 'watch'; reason = `Form declined ${decline.toFixed(0)} pts (last 3 sessions)` }
    if (decline > 20) { risk = 'high'; reason = `Severe form decline — ${decline.toFixed(0)} pts drop` }
    if (lastScore != null && lastScore < 40) { risk = 'high'; reason = `Very low form score (${lastScore.toFixed(0)}/100)` }

    return { id: a.id, name: a.name, sport: a.sport || '—', risk, reason, lastScore, sessionCount14d }
  }).filter(r => r.risk !== 'healthy' || r.sessionCount14d > 0)
    .sort((a, b) => {
      const ord = { high: 0, watch: 1, healthy: 2 }
      return ord[a.risk] - ord[b.risk]
    })

  const high = riskRows.filter(r => r.risk === 'high').length
  const watch = riskRows.filter(r => r.risk === 'watch').length
  const healthy = riskRows.filter(r => r.risk === 'healthy').length

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <BigStat label="High Risk" value={high} unit="athletes" danger={high > 0} />
        <BigStat label="Watch" value={watch} unit="athletes" />
        <BigStat label="Active & Healthy" value={healthy} unit="athletes" accent={healthy > 0} />
      </div>

      <StravaCard title="Risk Breakdown" padding="0">
        {riskRows.length === 0
          ? <div style={{ padding: '20px', color: GRAY, fontSize: '13px' }}>Not enough data yet — check back after athletes complete sessions.</div>
          : riskRows.map((a, i, arr) => (
            <div key={i} style={{
              padding: '16px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
              display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '14px', alignItems: 'center',
            }}>
              <span style={{
                width: '8px', height: '40px',
                background: a.risk === 'high' ? '#ef4444' : a.risk === 'watch' ? '#f97316' : '#22c55e',
                borderRadius: '4px', display: 'block',
              }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>
                  {a.sport} · {a.reason}
                </div>
              </div>
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                background: a.risk === 'high' ? 'rgba(239,68,68,0.1)' : a.risk === 'watch' ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)',
                color: a.risk === 'high' ? '#ef4444' : a.risk === 'watch' ? '#f97316' : '#22c55e',
              }}>
                {a.risk}
              </span>
            </div>
          ))
        }
      </StravaCard>
    </div>
  )
}

// ─── Compliance Report ───────────────────────────────────────────────────────

function ComplianceReport({ athletes, sessions }) {
  const cutoff30 = new Date(Date.now() - 30 * 86400000)
  const recent = sessions.filter(s => new Date(s.started_at) >= cutoff30)

  const sessionGoal = 12 // sessions per month target

  const rows = athletes.map(a => {
    const mine = recent.filter(s => s.athlete_id === a.id)
    const count = mine.length
    const pct = Math.min(100, Math.round((count / sessionGoal) * 100))
    const scores = mine.map(scoreOf).filter(Boolean)
    const avg = scores.length ? Math.round(scores.reduce((x, y) => x + y, 0) / scores.length) : null
    return { id: a.id, name: a.name, sport: a.sport || '—', count, pct, avg }
  }).filter(r => r.count > 0).sort((a, b) => b.pct - a.pct)

  const overallPct = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.pct, 0) / rows.length)
    : 0
  const avgFormAll = (() => {
    const scores = recent.map(scoreOf).filter(Boolean)
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  })()
  const activeAthletes = rows.length

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <BigStat label="Session Compliance" value={`${overallPct}%`} accent />
        <BigStat label="Active Athletes (30d)" value={activeAthletes} unit={`of ${athletes.length}`} />
        <BigStat label="Avg Form Score" value={avgFormAll != null ? `${avgFormAll}/100` : '—'} />
      </div>

      <StravaCard title={`Athlete Compliance (last 30 days, goal: ${sessionGoal} sessions)`} padding="0">
        {rows.length === 0
          ? <div style={{ padding: '20px', color: GRAY, fontSize: '13px' }}>No sessions in the last 30 days.</div>
          : rows.map((a, i, arr) => (
            <div key={i} style={{
              padding: '14px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${LIGHT}` : 'none',
              display: 'grid', gridTemplateColumns: '2fr 2fr 80px', gap: '20px', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: '11px', color: GRAY }}>{a.sport} · {a.count} sessions</div>
              </div>
              <ProgressBar label="Compliance" value={a.pct} />
              <span style={{ fontSize: '13px', fontWeight: 800, color: ORANGE, textAlign: 'right' }}>
                {a.avg != null ? `${a.avg}` : '—'}
                {a.avg != null && <span style={{ fontSize: '10px', color: GRAY, fontWeight: 500 }}> /100</span>}
              </span>
            </div>
          ))
        }
      </StravaCard>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({ label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
        <span style={{ color: GRAY }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: '4px', background: LIGHT, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value}%`,
          background: value >= 80 ? ORANGE : value >= 50 ? '#f97316' : '#ef4444',
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

function BigStat({ label, value, unit, accent, danger, change }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${danger ? '#ef4444' : BORDER}`,
      borderRadius: '4px', padding: '20px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 800, color: danger ? '#ef4444' : accent ? ORANGE : DARK, lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: '12px', fontWeight: 500, color: GRAY, marginLeft: '6px' }}>{unit}</span>}
      </div>
      {change && (
        <div style={{ fontSize: '11px', color: change.startsWith('+') ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: '6px' }}>
          {change.startsWith('+') ? '↑' : '↓'} {change} vs last week
        </div>
      )}
    </div>
  )
}
