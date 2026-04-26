import React, { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '../../context/UserContext'
import { api, safeQuery } from '../../lib/api'
import { StravaLayout, PageHeader, StravaCard, ORANGE, DARK, GRAY, LIGHT, BORDER } from '../../components/StravaLayout'

export function EnhancedCoachDashboard() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('urgency')
  const [filterRisk, setFilterRisk] = useState('all')

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  const activeQuery = useQuery({
    queryKey: ['sessions-active'],
    queryFn: () => safeQuery(() => api.get('/sessions/active'), { active_sessions: [] }),
    refetchInterval: 5000,
  })

  const athletesQuery = useQuery({
    queryKey: ['athletes'],
    queryFn: () => safeQuery(() => api.get('/athletes'), { athletes: [] }),
  })

  const sessionsQuery = useQuery({
    queryKey: ['sessions-list'],
    queryFn: () => safeQuery(() => api.get('/sessions'), { sessions: [] }),
  })

  const activeSessions = activeQuery.data?.active_sessions || []
  const apiAthletes = athletesQuery.data?.athletes || []
  const allSessions = sessionsQuery.data?.sessions || []

  // Build roster from real athletes (fall back to mock for empty state)
  const mockAthletes = [
    { id: '1', name: 'Aryan Kapoor', sport: 'Sprint', sessions: 8, formScore: 82, risk: 'ready', lastSession: '2h ago' },
    { id: '2', name: 'Priya Singh', sport: 'Jump', sessions: 12, formScore: 78, risk: 'watch', lastSession: '1h ago' },
    { id: '3', name: 'Rohan Patel', sport: 'Cricket', sessions: 5, formScore: 65, risk: 'high', lastSession: '4h ago' },
    { id: '4', name: 'Zara Khan', sport: 'Football', sessions: 10, formScore: 81, risk: 'ready', lastSession: '30m ago' },
    { id: '5', name: 'Karan Sharma', sport: 'Badminton', sessions: 6, formScore: 72, risk: 'watch', lastSession: '2h ago' },
  ]

  const roster = apiAthletes.length > 0
    ? apiAthletes.map((a) => ({
        id: a.athlete_id || a.id,
        name: a.athlete_name || a.name || a.athlete_id,
        sport: a.sport || 'Unknown',
        sessions: a.session_count || 0,
        formScore: a.avg_form_score || 0,
        risk: (a.avg_form_score || 0) >= 80 ? 'ready' : (a.avg_form_score || 0) >= 70 ? 'watch' : 'high',
        lastSession: a.last_session_at ? new Date(a.last_session_at).toLocaleDateString() : '—',
      }))
    : mockAthletes

  const priorities = roster
    .filter((a) => a.risk !== 'ready')
    .slice(0, 4)

  const filteredRoster = roster
    .filter((a) => filterRisk === 'all' || a.risk === filterRisk)
    .sort((a, b) => {
      if (sortBy === 'form') return b.formScore - a.formScore
      if (sortBy === 'sessions') return b.sessions - a.sessions
      if (sortBy === 'urgency') {
        const order = { high: 3, watch: 2, ready: 1 }
        return (order[b.risk] || 0) - (order[a.risk] || 0)
      }
      return a.name.localeCompare(b.name)
    })

  const teamAvgScore = roster.length
    ? roster.reduce((sum, a) => sum + (a.formScore || 0), 0) / roster.length
    : 0

  const totalSessions = roster.reduce((sum, a) => sum + (a.sessions || 0), 0)
  const atRiskCount = roster.filter((a) => a.risk === 'high').length

  const displayName = String(user?.userId || user?.email || 'Coach')

  return (
    <StravaLayout displayName={displayName} role="coach">
      <PageHeader
        eyebrow={`Coach · ${roster.length} athletes`}
        title={`Welcome back, ${displayName.split(/[@\s]/)[0]}.`}
        description="Live overview of your team. Click any athlete to dive into their form scores, sessions, and weak joints."
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Top stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <BigStat label="Total Athletes" value={roster.length} accent />
          <BigStat label="Team Avg Form" value={teamAvgScore.toFixed(0)} unit="/100" />
          <BigStat label="Live Now" value={activeSessions.length} unit="active" />
          <BigStat
            label="At Risk"
            value={atRiskCount}
            unit={atRiskCount === 1 ? 'athlete' : 'athletes'}
            danger={atRiskCount > 0}
          />
        </div>

        {/* Live + Priorities */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Live Sessions */}
          <StravaCard
            title="Live Sessions"
            action={<span style={{ fontSize: '11px', color: activeSessions.length > 0 ? ORANGE : GRAY, fontWeight: 700 }}>
              {activeSessions.length > 0 ? `● ${activeSessions.length} LIVE` : 'NO ACTIVE SESSIONS'}
            </span>}
            accent={activeSessions.length > 0}
          >
            {activeSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeSessions.slice(0, 3).map((s, i) => (
                  <Link
                    key={i}
                    to="/session/$sessionId"
                    params={{ sessionId: s.id || s.session_id }}
                    style={{
                      padding: '12px 16px',
                      background: LIGHT,
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: DARK,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>
                        {s.athlete_name || s.athlete_id}
                      </div>
                      <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px', textTransform: 'capitalize' }}>
                        {String(s.sport || 'Training').replace(/_/g, ' ')} · {s.frame_count || 0} frames
                      </div>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: ORANGE,
                      background: 'rgba(252, 76, 2, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '50px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}>
                      ● Live
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: GRAY, fontSize: '13px' }}>
                No athletes are recording right now.<br />
                <span style={{ fontSize: '11px', color: GRAY, opacity: 0.6 }}>Active sessions appear here in real-time.</span>
              </div>
            )}
          </StravaCard>

          {/* Priorities */}
          <StravaCard title="Priorities" action={<span style={{ fontSize: '11px', color: GRAY }}>{priorities.length} flagged</span>}>
            {priorities.length > 0 ? (
              <div>
                {priorities.map((a, i) => (
                  <div key={i} style={{
                    padding: '12px 0',
                    borderBottom: i < priorities.length - 1 ? `1px solid ${LIGHT}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '40px',
                      background: a.risk === 'high' ? '#ef4444' : '#f97316',
                      borderRadius: '3px',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>
                        {a.name}
                      </div>
                      <div style={{ fontSize: '10px', color: GRAY, marginTop: '2px', textTransform: 'capitalize' }}>
                        {a.sport} · Form {a.formScore}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: a.risk === 'high' ? '#ef4444' : '#f97316',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {a.risk}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: GRAY, fontSize: '12px' }}>
                All athletes look good 🎉
              </div>
            )}
          </StravaCard>
        </div>

        {/* Roster Table */}
        <StravaCard
          title={`Roster · ${filteredRoster.length} athletes`}
          action={
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                style={{
                  padding: '6px 10px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All risks</option>
                <option value="ready">Ready</option>
                <option value="watch">Watch</option>
                <option value="high">High risk</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '6px 10px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="urgency">Sort: Urgency</option>
                <option value="form">Sort: Form Score</option>
                <option value="sessions">Sort: Sessions</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          }
          padding="0"
        >
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 2fr 1fr 1fr 1fr 1fr 100px',
            padding: '12px 20px',
            background: LIGHT,
            fontSize: '10px',
            fontWeight: 700,
            color: GRAY,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            gap: '12px',
            alignItems: 'center',
          }}>
            <span>&nbsp;</span>
            <span>Athlete</span>
            <span>Sport</span>
            <span>Sessions</span>
            <span>Form Score</span>
            <span>Last Session</span>
            <span style={{ textAlign: 'right' }}>Status</span>
          </div>

          {filteredRoster.map((a, i) => (
            <Link
              key={a.id}
              to="/athlete/$athleteId"
              params={{ athleteId: a.id }}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 2fr 1fr 1fr 1fr 1fr 100px',
                padding: '14px 20px',
                borderBottom: i < filteredRoster.length - 1 ? `1px solid ${LIGHT}` : 'none',
                textDecoration: 'none',
                color: DARK,
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: ORANGE,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
              }}>
                {String(a.name).charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                {a.name}
              </div>
              <div style={{ fontSize: '12px', color: GRAY, textTransform: 'capitalize' }}>
                {a.sport}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>
                {a.sessions}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: ORANGE }}>{a.formScore}</span>
                <div style={{ flex: 1, height: '4px', background: LIGHT, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.formScore}%`, background: ORANGE }} />
                </div>
              </div>
              <div style={{ fontSize: '11px', color: GRAY }}>
                {a.lastSession}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '50px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: a.risk === 'high' ? 'rgba(239, 68, 68, 0.1)' : a.risk === 'watch' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: a.risk === 'high' ? '#ef4444' : a.risk === 'watch' ? '#f97316' : '#22c55e',
                }}>
                  {a.risk}
                </span>
              </div>
            </Link>
          ))}

          {filteredRoster.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: GRAY, fontSize: '13px' }}>
              No athletes match this filter.
            </div>
          )}
        </StravaCard>
      </div>
    </StravaLayout>
  )
}

function BigStat({ label, value, unit, accent, danger }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${danger ? '#ef4444' : BORDER}`,
      borderRadius: '4px',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 700,
        color: GRAY,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: 800,
        color: danger ? '#ef4444' : accent ? ORANGE : DARK,
        lineHeight: 1,
      }}>
        {value}
        {unit && <span style={{ fontSize: '12px', fontWeight: 500, color: GRAY, marginLeft: '6px' }}>{unit}</span>}
      </div>
    </div>
  )
}
