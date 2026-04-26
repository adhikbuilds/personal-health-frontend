import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from '@tanstack/react-router'
import { useUser } from '../../context/UserContext'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function TeamAnalyticsPage() {
  const { user } = useUser()
  const navigate = useNavigate()

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const athletesQuery = useQuery({
    queryKey: ['athletes-analytics'],
    queryFn: () => safeQuery(() => api.get('/athletes'), { athletes: [] }),
  })

  const apiAthletes = athletesQuery.data?.athletes || []
  const fallback = [
    { athlete_id: '1', athlete_name: 'Aryan Kapoor', sport: 'sprint', avg_form_score: 82, session_count: 8 },
    { athlete_id: '2', athlete_name: 'Priya Singh', sport: 'jump', avg_form_score: 78, session_count: 12 },
    { athlete_id: '3', athlete_name: 'Rohan Patel', sport: 'cricket', avg_form_score: 65, session_count: 5 },
    { athlete_id: '4', athlete_name: 'Zara Khan', sport: 'football', avg_form_score: 81, session_count: 10 },
    { athlete_id: '5', athlete_name: 'Karan Sharma', sport: 'badminton', avg_form_score: 72, session_count: 6 },
  ]
  const athletes = apiAthletes.length > 0 ? apiAthletes : fallback

  const totalSessions = athletes.reduce((sum, a) => sum + (a.session_count || 0), 0)
  const avgScore = athletes.length
    ? athletes.reduce((sum, a) => sum + (a.avg_form_score || 0), 0) / athletes.length
    : 0
  const topPerformer = [...athletes].sort((a, b) => (b.avg_form_score || 0) - (a.avg_form_score || 0))[0]
  const atRisk = athletes.filter((a) => (a.avg_form_score || 0) < 70)

  const sportBreakdown = {}
  athletes.forEach((a) => {
    const sport = (a.sport || 'unknown').toLowerCase()
    if (!sportBreakdown[sport]) sportBreakdown[sport] = { count: 0, totalScore: 0, sessions: 0 }
    sportBreakdown[sport].count++
    sportBreakdown[sport].totalScore += a.avg_form_score || 0
    sportBreakdown[sport].sessions += a.session_count || 0
  })
  const sportRows = Object.entries(sportBreakdown).map(([sport, data]) => ({
    sport,
    athletes: data.count,
    avgScore: data.totalScore / data.count,
    sessions: data.sessions,
  }))

  const displayName = String(user?.userId || user?.email || 'Coach')

  return (
    <StravaLayout displayName={displayName} role="coach">
      <PageHeader
        eyebrow="Coach · Team Analytics"
        title="Your team, in numbers."
        description="Aggregate form trends, sport-by-sport breakdown, and athletes that need your attention."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <BigStat label="Athletes" value={athletes.length} accent />
          <BigStat label="Avg Form Score" value={avgScore.toFixed(1)} unit="/100" />
          <BigStat label="Total Sessions" value={totalSessions} />
          <BigStat label="At Risk" value={atRisk.length} unit={atRisk.length === 1 ? 'athlete' : 'athletes'} danger={atRisk.length > 0} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <StravaCard title="Form Score Distribution" action={<span style={{ fontSize: '11px', color: GRAY }}>{athletes.length} athletes</span>}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '220px' }}>
              {athletes.map((a, i) => {
                const score = a.avg_form_score || 0
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }} title={`${a.athlete_name || a.athlete_id}: ${score}`}>
                    <div style={{
                      width: '100%',
                      height: `${score}%`,
                      background: score >= 80 ? ORANGE : score >= 70 ? '#f97316' : '#ef4444',
                      borderRadius: '2px 2px 0 0',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    />
                    <div style={{ fontSize: '9px', color: GRAY, textAlign: 'center' }}>
                      {String(a.athlete_name || a.athlete_id || '').slice(0, 6)}
                    </div>
                  </div>
                )
              })}
            </div>
          </StravaCard>

          {topPerformer && (
            <StravaCard title="Top Performer" accent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: ORANGE,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 800,
                }}>
                  {String(topPerformer.athlete_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{topPerformer.athlete_name || topPerformer.athlete_id}</div>
                  <div style={{ fontSize: '11px', color: GRAY, textTransform: 'capitalize', marginTop: '2px' }}>{topPerformer.sport || 'Athlete'}</div>
                </div>
              </div>
              <div style={{ paddingTop: '16px', borderTop: `1px solid ${LIGHT}` }}>
                <div style={{ fontSize: '11px', color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: '4px' }}>Form Score</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: ORANGE, lineHeight: 1 }}>{(topPerformer.avg_form_score || 0).toFixed(0)}</div>
              </div>
            </StravaCard>
          )}
        </div>

        <StravaCard title="By Sport" padding="0">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
            padding: '12px 20px',
            background: LIGHT,
            fontSize: '10px',
            fontWeight: 700,
            color: GRAY,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            gap: '12px',
          }}>
            <span>Sport</span>
            <span>Athletes</span>
            <span>Avg Form</span>
            <span>Sessions</span>
            <span style={{ textAlign: 'right' }}>Trend</span>
          </div>
          {sportRows.map((row, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
              padding: '14px 20px',
              borderBottom: i < sportRows.length - 1 ? `1px solid ${LIGHT}` : 'none',
              gap: '12px',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>{row.sport}</div>
              <div style={{ fontSize: '13px' }}>{row.athletes}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: ORANGE }}>{row.avgScore.toFixed(0)}</span>
                <div style={{ flex: 1, height: '4px', background: LIGHT, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${row.avgScore}%`, background: ORANGE }} />
                </div>
              </div>
              <div style={{ fontSize: '13px' }}>{row.sessions}</div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: row.avgScore >= 75 ? '#22c55e' : '#f97316', fontWeight: 700 }}>
                {row.avgScore >= 75 ? '↑ Strong' : '→ Steady'}
              </div>
            </div>
          ))}
        </StravaCard>
      </div>
    </StravaLayout>
  )
}

function BigStat({ label, value, unit, accent, danger }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${danger ? '#ef4444' : BORDER}`, borderRadius: '4px', padding: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: danger ? '#ef4444' : accent ? ORANGE : DARK, lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: '12px', fontWeight: 500, color: GRAY, marginLeft: '6px' }}>{unit}</span>}
      </div>
    </div>
  )
}
